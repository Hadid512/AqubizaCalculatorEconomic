import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { X, Fish, CheckCircle2, Calendar, Layers, Ruler, Percent, Zap, Clock } from "lucide-react";

interface NewCycleForm {
  namaSiklus: string;
  komoditas: string;
  namaKolam: string;
  tanggalMulai: string;
  kepadatanTebar: string;
  jumlahUnit: string;
  luasUnit: string;
  masaPemeliharaan: string;
  sr: string;
  targetFCR: string;
}

const INIT: NewCycleForm = {
  namaSiklus: "",
  komoditas: "Udang Vaname",
  namaKolam: "",
  tanggalMulai: new Date().toISOString().slice(0, 10),
  kepadatanTebar: "200",
  jumlahUnit: "4",
  luasUnit: "25",
  masaPemeliharaan: "90",
  sr: "90",
  targetFCR: "1.4",
};

const KOMODITAS = [
  "Udang Vaname", "Udang Windu", "Bandeng (Milkfish)",
  "Lele Dumbo", "Nila Gift", "Mas Koi", "Gurame", "Patin",
];

function Field({ label, icon: Icon, value, onChange, type = "text", unit, options, placeholder, color = "#2563EB" }: {
  label: string; icon?: React.ElementType; value: string;
  onChange: (v: string) => void; type?: string; unit?: string;
  options?: string[]; placeholder?: string; color?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-foreground text-xs font-semibold mb-1.5">
        {Icon && <Icon size={12} style={{ color }} />}
        {label}
      </label>
      <div className="relative">
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
            style={{ paddingRight: "12px" }}
          >
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            style={{ paddingRight: unit ? `${unit.length * 7 + 12}px` : "12px" }}
          />
        )}
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[11px] pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

interface NewCycleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (cycle: NewCycleForm) => void;
}

export function NewCycleModal({ open, onClose, onSave }: NewCycleModalProps) {
  const [form, setForm] = useState<NewCycleForm>(INIT);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof NewCycleForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const totalPopulasi = Math.round(
    (parseFloat(form.kepadatanTebar) || 0) *
    (parseFloat(form.jumlahUnit) || 0) *
    (parseFloat(form.luasUnit) || 0)
  );

  const harvestDate = (() => {
    if (!form.tanggalMulai || !form.masaPemeliharaan) return "-";
    const d = new Date(form.tanggalMulai);
    d.setDate(d.getDate() + parseInt(form.masaPemeliharaan));
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  })();

  function handleSave() {
    if (!form.namaSiklus || !form.namaKolam) return;
    setSaved(true);
    setTimeout(() => {
      onSave(form);
      setSaved(false);
      setForm(INIT);
      onClose();
    }, 1000);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.2, 0.64, 1] }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                    w-[calc(100vw-2rem)] max-w-lg bg-card rounded-2xl border border-border shadow-2xl
                    max-h-[90vh] overflow-y-auto focus:outline-none"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Fish size={18} className="text-primary" />
                      </div>
                      <div>
                        <Dialog.Title className="text-foreground font-semibold text-base"
                          style={{ fontFamily: "Poppins, sans-serif" }}>
                          Mulai Siklus Baru
                        </Dialog.Title>
                        <Dialog.Description className="text-muted-foreground text-xs mt-0.5">
                          Isi parameter awal budidaya kolam Anda
                        </Dialog.Description>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
                        <X size={16} className="text-muted-foreground" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-5">
                    {/* Identitas */}
                    <div>
                      <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                        Identitas Siklus
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        <Field label="Nama Siklus" icon={Layers} value={form.namaSiklus}
                          onChange={set("namaSiklus")} placeholder="mis. Siklus Udang Mei 2025"
                          color="#2563EB" />
                        <Field label="Komoditas Ikan / Udang" icon={Fish} value={form.komoditas}
                          onChange={set("komoditas")} options={KOMODITAS} color="#0EA5E9" />
                        <Field label="Nama Kolam / Petak" icon={Layers} value={form.namaKolam}
                          onChange={set("namaKolam")} placeholder="mis. Kolam A1" color="#10B981" />
                        <Field label="Tanggal Mulai Tebar" icon={Calendar} value={form.tanggalMulai}
                          onChange={set("tanggalMulai")} type="date" color="#F97316" />
                      </div>
                    </div>

                    {/* Parameter Produksi */}
                    <div>
                      <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-3">
                        Parameter Produksi
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Kepadatan Tebar" icon={Layers} value={form.kepadatanTebar}
                          onChange={set("kepadatanTebar")} unit="ekor/m²" color="#10B981" />
                        <Field label="Jumlah Petak Kolam" icon={Layers} value={form.jumlahUnit}
                          onChange={set("jumlahUnit")} unit="unit" color="#10B981" />
                        <Field label="Luas per Petak" icon={Ruler} value={form.luasUnit}
                          onChange={set("luasUnit")} unit="m²" color="#10B981" />
                        <Field label="Masa Pemeliharaan" icon={Clock} value={form.masaPemeliharaan}
                          onChange={set("masaPemeliharaan")} unit="hari" color="#F97316" />
                        <Field label="Target SR" icon={Percent} value={form.sr}
                          onChange={set("sr")} unit="%" color="#2563EB" />
                        <Field label="Target FCR" icon={Zap} value={form.targetFCR}
                          onChange={set("targetFCR")} unit="-" color="#0EA5E9" />
                      </div>
                    </div>

                    {/* Auto-calculated preview */}
                    <div className="bg-muted/40 rounded-xl border border-border p-4 space-y-2">
                      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider mb-3">
                        Ringkasan Otomatis
                      </p>
                      {[
                        { label: "Total Populasi Tebar", val: `${totalPopulasi.toLocaleString("id-ID")} ekor`, hi: true },
                        { label: "Estimasi Selesai", val: harvestDate },
                        { label: "Komoditas", val: form.komoditas },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{r.label}</span>
                          <span className={`font-semibold ${r.hi ? "text-primary" : "text-foreground"}`}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-3 p-5 pt-0">
                    <Dialog.Close asChild>
                      <button className="flex-1 h-11 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">
                        Batal
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleSave}
                      disabled={!form.namaSiklus || !form.namaKolam}
                      className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-medium
                        hover:bg-primary/90 transition-colors shadow-md shadow-primary/20
                        disabled:opacity-40 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                    >
                      {saved
                        ? <><CheckCircle2 size={16} /> Siklus Dimulai!</>
                        : <><Fish size={16} /> Mulai Budidaya</>
                      }
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
