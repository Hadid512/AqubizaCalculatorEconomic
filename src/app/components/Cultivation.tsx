import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Fish, Plus, Camera, CheckCircle2, TrendingUp, TrendingDown,
  AlertTriangle, Calendar, Droplets, Zap, ChevronDown, ChevronUp, X, ImageIcon
} from "lucide-react";
import { NewCycleModal } from "./NewCycleModal";

// ── mock photo URLs (Unsplash, topic: fish pond / aquaculture) ─────────────
const POND_PHOTOS = [
  "https://images.unsplash.com/photo-1612197527762-8cfb4b634d71?w=200&h=150&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=200&h=150&fit=crop&auto=format",
];

const cycles = [
  { id: "c1", name: "Kolam Bandeng A1", commodity: "Bandeng (Milkfish)", pond: "Kolam 1", day: 45, totalDays: 120, sr: 92.3, fcr: 1.42, status: "healthy", startDate: "2025-04-01", mortality: 180, totalStock: 15000 },
  { id: "c2", name: "Kolam Udang B2",   commodity: "Udang Vaname",       pond: "Kolam 2", day: 28, totalDays: 90,  sr: 88.1, fcr: 1.68, status: "warning",  startDate: "2025-05-10", mortality: 420, totalStock: 30000 },
  { id: "c3", name: "Kolam Lele C3",    commodity: "Lele Dumbo",          pond: "Kolam 3", day: 67, totalDays: 80,  sr: 95.7, fcr: 1.15, status: "excellent",startDate: "2025-03-25", mortality: 95,  totalStock: 5000 },
];

interface DailyLog {
  day: number; date: string; mortality: number; feed: number;
  note: string; photos: string[];
}
const dailyLogs: DailyLog[] = [
  { day: 45, date: "2025-05-16", mortality: 12, feed: 48.5, note: "Cuaca cerah, nafsu makan baik", photos: [POND_PHOTOS[0]] },
  { day: 44, date: "2025-05-15", mortality: 8,  feed: 46.0, note: "", photos: [POND_PHOTOS[1], POND_PHOTOS[2]] },
  { day: 43, date: "2025-05-14", mortality: 15, feed: 44.5, note: "Mortality sedikit meningkat, perlu observasi", photos: [] },
  { day: 42, date: "2025-05-13", mortality: 6,  feed: 47.0, note: "", photos: [POND_PHOTOS[2]] },
  { day: 41, date: "2025-05-12", mortality: 9,  feed: 45.5, note: "", photos: [] },
];

interface WeeklySample {
  week: number; date: string; avgWeight: number; sample: number;
  note: string; photos: string[];
}
const weeklySamples: WeeklySample[] = [
  { week: 6, date: "2025-05-12", avgWeight: 85.4, sample: 30, note: "Pertumbuhan normal", photos: [POND_PHOTOS[1]] },
  { week: 5, date: "2025-05-05", avgWeight: 74.2, sample: 30, note: "", photos: [POND_PHOTOS[0]] },
  { week: 4, date: "2025-04-28", avgWeight: 63.8, sample: 30, note: "", photos: [] },
  { week: 3, date: "2025-04-21", avgWeight: 52.1, sample: 30, note: "", photos: [] },
];

interface LogFormState { mortality: string; feed: string; note: string; localPhoto: string | null; }
interface SampleFormState { avgWeight: string; sample: string; note: string; localPhoto: string | null; }

function InputField({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-foreground text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text" value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ""}
          className="w-full h-11 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          style={{ paddingRight: unit ? `${unit.length * 7 + 16}px` : "12px" }}
        />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">{unit}</span>}
      </div>
    </div>
  );
}

function IndicatorBadge({ label, value, trend }: { label: string; value: string; trend: "up" | "down" | "neutral" }) {
  return (
    <div className="bg-muted/50 rounded-xl p-3 text-center">
      <p className="text-muted-foreground text-[10px] mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1">
        <span className="text-foreground text-sm font-semibold">{value}</span>
        {trend === "up" && <TrendingUp size={12} className="text-emerald-500" />}
        {trend === "down" && <TrendingDown size={12} className="text-red-500" />}
      </div>
    </div>
  );
}

// ── Photo lightbox ───────────────────────────────────────────────────────────
function PhotoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src={src} alt="Dokumentasi" className="w-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Photo strip ───────────────────────────────────────────────────────────────
function PhotoStrip({ photos }: { photos: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  if (photos.length === 0) return null;
  return (
    <>
      <div className="flex gap-2 flex-wrap mt-2">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(src)}
            className="relative w-16 h-16 rounded-xl overflow-hidden border border-border hover:opacity-80 transition-opacity flex-shrink-0 bg-muted"
          >
            <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all" />
          </button>
        ))}
        <div className="flex items-center text-muted-foreground text-[10px] gap-1 ml-1">
          <ImageIcon size={11} />
          <span>{photos.length} foto</span>
        </div>
      </div>
      {lightbox && <PhotoLightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

// ── File upload preview ───────────────────────────────────────────────────────
function PhotoUpload({ value, onChange, accent = "#2563EB" }: {
  value: string | null; onChange: (v: string | null) => void; accent?: string;
}) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="block text-foreground text-sm font-medium mb-1.5">Upload Dokumentasi</label>
      {value ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="block w-full border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 transition-all"
          style={{ "--hover-color": accent } as any}>
          <Camera size={22} className="text-muted-foreground" />
          <span className="text-muted-foreground text-xs text-center">Tap untuk upload foto bukti</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function Cultivation() {
  const [allCycles, setAllCycles] = useState(cycles);
  const [selectedCycle, setSelectedCycle] = useState(cycles[0]);
  const [activeTab, setActiveTab] = useState<"monitoring" | "sampling" | "progress">("monitoring");
  const [logForm, setLogForm] = useState<LogFormState>({ mortality: "", feed: "", note: "", localPhoto: null });
  const [sampleForm, setSampleForm] = useState<SampleFormState>({ avgWeight: "", sample: "30", note: "", localPhoto: null });
  const [logLogs, setLogLogs] = useState<DailyLog[]>(dailyLogs);
  const [sampLogs, setSampLogs] = useState<WeeklySample[]>(weeklySamples);
  const [saved, setSaved] = useState(false);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [expandedSample, setExpandedSample] = useState<number | null>(null);
  const [newCycleOpen, setNewCycleOpen] = useState(false);

  const pct = Math.round((selectedCycle.day / selectedCycle.totalDays) * 100);
  const daysLeft = selectedCycle.totalDays - selectedCycle.day;
  const harvestDate = new Date(selectedCycle.startDate);
  harvestDate.setDate(harvestDate.getDate() + selectedCycle.totalDays);

  const setLog    = (k: keyof LogFormState)    => (v: string | null) => setLogForm((f)  => ({ ...f, [k]: v }));
  const setSample = (k: keyof SampleFormState) => (v: string | null) => setSampleForm((f) => ({ ...f, [k]: v }));

  function handleSaveLog() {
    setSaved(true);
    const newLog: DailyLog = {
      day: selectedCycle.day + 1,
      date: new Date().toISOString().slice(0, 10),
      mortality: parseFloat(logForm.mortality) || 0,
      feed: parseFloat(logForm.feed) || 0,
      note: logForm.note,
      photos: logForm.localPhoto ? [logForm.localPhoto] : [],
    };
    setLogLogs((prev) => [newLog, ...prev]);
    setLogForm({ mortality: "", feed: "", note: "", localPhoto: null });
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSaveSample() {
    setSaved(true);
    const newSample: WeeklySample = {
      week: sampLogs.length > 0 ? sampLogs[0].week + 1 : 1,
      date: new Date().toISOString().slice(0, 10),
      avgWeight: parseFloat(sampleForm.avgWeight) || 0,
      sample: parseInt(sampleForm.sample) || 30,
      note: sampleForm.note,
      photos: sampleForm.localPhoto ? [sampleForm.localPhoto] : [],
    };
    setSampLogs((prev) => [newSample, ...prev]);
    setSampleForm({ avgWeight: "", sample: "30", note: "", localPhoto: null });
    setTimeout(() => setSaved(false), 2000);
  }

  function handleNewCycle(form: any) {
    const newCycle = {
      id: `c${allCycles.length + 1}`,
      name: `${form.namaKolam} — ${form.komoditas}`,
      commodity: form.komoditas,
      pond: form.namaKolam,
      day: 1,
      totalDays: parseInt(form.masaPemeliharaan) || 90,
      sr: parseFloat(form.sr) || 90,
      fcr: parseFloat(form.targetFCR) || 1.4,
      status: "healthy" as const,
      startDate: form.tanggalMulai,
      mortality: 0,
      totalStock: Math.round(
        (parseFloat(form.kepadatanTebar) || 0) *
        (parseFloat(form.jumlahUnit) || 0) *
        (parseFloat(form.luasUnit) || 0)
      ),
    };
    setAllCycles((prev) => [...prev, newCycle]);
    setSelectedCycle(newCycle);
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-foreground text-2xl lg:text-3xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Modul Budidaya
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Monitoring harian dan sampling pertumbuhan.</p>
        </div>
        <button
          onClick={() => setNewCycleOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex-shrink-0"
        >
          <Plus size={16} /> Siklus Baru
        </button>
      </div>

      {/* Cycle Selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
        {allCycles.map((c) => {
          const active = selectedCycle.id === c.id;
          const statusColor = c.status === "excellent" ? "#10B981" : c.status === "healthy" ? "#2563EB" : "#F97316";
          return (
            <button key={c.id} onClick={() => setSelectedCycle(c)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left transition-all ${
                active ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-foreground hover:border-primary/30"
              }`}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor }} />
              <div>
                <p className="text-xs font-medium whitespace-nowrap">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">Hari {c.day}/{c.totalDays}</p>
              </div>
            </button>
          );
        })}
        <button
          onClick={() => setNewCycleOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all text-sm"
        >
          <Plus size={16} /> Siklus Baru
        </button>
      </div>

      {/* Progress Overview */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-foreground font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>{selectedCycle.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                selectedCycle.status === "excellent" ? "bg-emerald-100 text-emerald-700" :
                selectedCycle.status === "healthy"   ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
              }`}>
                {selectedCycle.status === "excellent" ? "Excellent" : selectedCycle.status === "healthy" ? "Sehat" : "Perlu Perhatian"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{selectedCycle.commodity} · {selectedCycle.pond}</p>
          </div>
          <div className="text-right">
            <p className="text-foreground font-semibold text-2xl" style={{ fontFamily: "Poppins, sans-serif" }}>Hari {selectedCycle.day}</p>
            <p className="text-muted-foreground text-xs">{daysLeft} hari lagi panen</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-xs">Progress Budidaya</span>
            <span className="text-primary text-xs font-semibold">{pct}% dari {selectedCycle.totalDays} hari</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full relative"
              style={{ background: "linear-gradient(90deg, #2563EB, #0EA5E9)" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm border-2 border-primary" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <IndicatorBadge label="Survival Rate" value={`${selectedCycle.sr}%`} trend="up" />
          <IndicatorBadge label="FCR" value={selectedCycle.fcr.toString()} trend={selectedCycle.fcr > 1.5 ? "down" : "up"} />
          <IndicatorBadge label="Total Mortalitas" value={selectedCycle.mortality.toString()} trend="down" />
          <IndicatorBadge label="Est. Panen" value={harvestDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} trend="neutral" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6 w-fit">
        {(["monitoring", "sampling", "progress"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            {tab === "monitoring" ? "Monitoring Harian" : tab === "sampling" ? "Sampling Mingguan" : "Riwayat"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── MONITORING HARIAN ──────────────────────────────────────────── */}
        {activeTab === "monitoring" && (
          <motion.div key="monitoring" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Fish size={18} className="text-primary" />
                <h3 className="text-foreground font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Input Hari ke-{selectedCycle.day + 1}
                </h3>
              </div>
              <div className="space-y-4">
                <InputField label="Mortalitas Harian" value={logForm.mortality}
                  onChange={(v) => setLog("mortality")(v)} unit="ekor" placeholder="0" />
                <InputField label="Pakan Diberikan" value={logForm.feed}
                  onChange={(v) => setLog("feed")(v)} unit="kg" placeholder="0.0" />
                <div>
                  <label className="block text-foreground text-sm font-medium mb-1.5">Catatan</label>
                  <textarea value={logForm.note}
                    onChange={(e) => setLog("note")(e.target.value)}
                    placeholder="Kondisi kolam, cuaca, observasi khusus..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
                </div>
                <PhotoUpload value={logForm.localPhoto} onChange={(v) => setLog("localPhoto")(v)} accent="#2563EB" />
                <button onClick={handleSaveLog}
                  className="w-full h-11 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                  {saved ? <><CheckCircle2 size={16} /> Tersimpan!</> : <><Plus size={16} /> Simpan Data Hari Ini</>}
                </button>
              </div>
            </div>

            {/* Log history */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Log Monitoring Terbaru
              </h3>
              <div className="space-y-2">
                {logLogs.map((log) => (
                  <div key={log.day} className="rounded-xl border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => setExpandedLog(expandedLog === log.day ? null : log.day)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs font-bold">{log.day}</span>
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">Hari ke-{log.day}</p>
                          <p className="text-muted-foreground text-[10px]">
                            {new Date(log.date).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.photos.length > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Camera size={10} /> {log.photos.length}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          log.mortality > 10 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {log.mortality} mati
                        </span>
                        {expandedLog === log.day ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedLog === log.day && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3.5 pb-3 pt-2 bg-muted/30 border-t border-border space-y-2">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground text-[10px]">Pakan</p>
                                <p className="text-foreground font-medium">{log.feed} kg</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-[10px]">Mortalitas</p>
                                <p className="text-foreground font-medium">{log.mortality} ekor</p>
                              </div>
                            </div>
                            {log.note && (
                              <div>
                                <p className="text-muted-foreground text-[10px]">Catatan</p>
                                <p className="text-foreground text-xs">{log.note}</p>
                              </div>
                            )}
                            {/* Photos */}
                            {log.photos.length > 0 && (
                              <div>
                                <p className="text-muted-foreground text-[10px] mb-1.5">Dokumentasi Foto</p>
                                <PhotoStrip photos={log.photos} />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SAMPLING MINGGUAN ──────────────────────────────────────────── */}
        {activeTab === "sampling" && (
          <motion.div key="sampling" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Droplets size={18} className="text-accent" />
                <h3 className="text-foreground font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Sampling Minggu ke-{(sampLogs[0]?.week ?? 0) + 1}
                </h3>
              </div>
              <div className="space-y-4">
                <InputField label="Bobot Rata-rata" value={sampleForm.avgWeight}
                  onChange={(v) => setSample("avgWeight")(v)} unit="gram" placeholder="85.0" />
                <InputField label="Jumlah Sampel" value={sampleForm.sample}
                  onChange={(v) => setSample("sample")(v)} unit="ekor" placeholder="30" />
                <div>
                  <label className="block text-foreground text-sm font-medium mb-1.5">Catatan Sampling</label>
                  <textarea value={sampleForm.note}
                    onChange={(e) => setSample("note")(e.target.value)}
                    placeholder="Kondisi ikan, uniformitas, observasi..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
                </div>
                <PhotoUpload value={sampleForm.localPhoto} onChange={(v) => setSample("localPhoto")(v)} accent="#0EA5E9" />
                <button onClick={handleSaveSample}
                  className="w-full h-11 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-md shadow-accent/20">
                  {saved ? <><CheckCircle2 size={16} /> Tersimpan!</> : <>Simpan Data Sampling</>}
                </button>
              </div>
            </div>

            {/* Sampling history */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Riwayat Sampling
              </h3>
              <div className="space-y-2">
                {sampLogs.map((s, i) => {
                  const prevWeight = sampLogs[i + 1]?.avgWeight;
                  const adg = prevWeight ? ((s.avgWeight - prevWeight) / 7).toFixed(2) : "-";
                  return (
                    <div key={s.week} className="rounded-xl border border-border overflow-hidden">
                      <button
                        className="w-full flex items-start gap-3 p-3.5 hover:bg-muted/50 transition-colors text-left"
                        onClick={() => setExpandedSample(expandedSample === s.week ? null : s.week)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent text-xs font-bold">W{s.week}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-foreground text-sm font-medium">Minggu ke-{s.week}</p>
                            <div className="flex items-center gap-2">
                              {s.photos.length > 0 && (
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <Camera size={10} /> {s.photos.length}
                                </span>
                              )}
                              <p className="text-foreground text-sm font-bold">{s.avgWeight} g</p>
                              {expandedSample === s.week ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-[10px] mt-0.5">
                            {new Date(s.date).toLocaleDateString("id-ID")} · {s.sample} sampel · ADG: {adg} g/hari
                          </p>
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedSample === s.week && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-3.5 pb-3 pt-2 bg-muted/30 border-t border-border space-y-2">
                              {s.note && (
                                <div>
                                  <p className="text-muted-foreground text-[10px]">Catatan</p>
                                  <p className="text-foreground text-xs italic">{s.note}</p>
                                </div>
                              )}
                              {/* Photos */}
                              {s.photos.length > 0 && (
                                <div>
                                  <p className="text-muted-foreground text-[10px] mb-1.5">Foto Sampling</p>
                                  <PhotoStrip photos={s.photos} />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PROGRESS ──────────────────────────────────────────────────── */}
        {activeTab === "progress" && (
          <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Pertumbuhan",   icon: TrendingUp,    value: `${weeklySamples[0].avgWeight}g`, sub: "+11.2g vs minggu lalu", color: "#10B981", status: "Baik" },
                { label: "Efisiensi Pakan",icon: Zap,          value: `FCR ${selectedCycle.fcr}`, sub: selectedCycle.fcr <= 1.5 ? "Dalam batas ideal" : "Perlu perbaikan", color: selectedCycle.fcr <= 1.5 ? "#10B981" : "#F97316", status: selectedCycle.fcr <= 1.5 ? "Baik" : "Waspada" },
                { label: "Tren Mortalitas",icon: AlertTriangle, value: "12 ekor/hari", sub: "Rata-rata 7 hari terakhir", color: "#F97316", status: "Pantau" },
                { label: "Survival Rate", icon: Fish,           value: `${selectedCycle.sr}%`, sub: "Dari total tebar", color: "#2563EB", status: "Baik" },
                { label: "Hari Tersisa",  icon: Calendar,       value: `${daysLeft} hari`, sub: `Target panen: ${harvestDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`, color: "#0EA5E9", status: "On Track" },
                { label: "Total Pakan",   icon: Droplets,       value: "2,185 kg", sub: "Total pakan siklus ini", color: "#8B5CF6", status: "Normal" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.label} whileHover={{ y: -2 }} className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + "18" }}>
                        <Icon size={18} style={{ color: item.color }} />
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: item.color + "18", color: item.color }}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
                    <p className="text-foreground font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{item.value}</p>
                    <p className="text-muted-foreground text-[10px] mt-1">{item.sub}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Cycle Modal */}
      <NewCycleModal
        open={newCycleOpen}
        onClose={() => setNewCycleOpen(false)}
        onSave={handleNewCycle}
      />
    </div>
  );
}
