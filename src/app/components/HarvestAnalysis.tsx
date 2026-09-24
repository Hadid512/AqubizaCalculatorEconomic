import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  BarChart3,
  Percent,
  Clock,
  Fish,
  Package,
  Leaf,
  AlertCircle,
  Activity,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

// ─── IRR via bisection ───────────────────────────────────────────────────────
function calcIRR(
  initialInvestment: number,
  annualCashFlow: number,
  years: number,
): number {
  if (annualCashFlow <= 0 || initialInvestment <= 0) return 0;
  const npv = (r: number) => {
    let s = -initialInvestment;
    for (let t = 1; t <= years; t++)
      s += annualCashFlow / Math.pow(1 + r, t);
    return s;
  };
  let lo = -0.9999,
    hi = 100;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (Math.abs(hi - lo) < 0.00001) return mid * 100;
    npv(mid) > 0 ? (lo = mid) : (hi = mid);
  }
  return ((lo + hi) / 2) * 100;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function num(s: string) {
  return (
    parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0
  );
}
function fmtIDR(n: number, compact = true): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (!compact)
    return (
      sign + "Rp " + Math.round(abs).toLocaleString("id-ID")
    );
  if (abs >= 1_000_000_000) return sign + "Rp " + abs;
  if (abs >= 1_000_000) return sign + "Rp " + abs;
  if (abs >= 1_000) return sign + "Rp " + abs;
  return sign + "Rp " + abs.toFixed(0);
}
function fmtNum(n: number, dec = 2) {
  return isFinite(n) ? n.toFixed(dec) : "—";
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface F {
  // Step 1 – Parameter Produksi
  kepadatanTebar: string;
  jumlahUnit: string;
  luasUnit: string;
  sr: string;
  adg: string;
  masaPemeliharaan: string;
  fcr: string;
  // Step 2 – Investasi
  kja: string;
  waring: string;
  peralatanLain: string;
  gajiPerBulan: string;
  lamaGaji: string;
  // Step 3 – Operasional
  hargaBenur: string;
  hargaPakan: string;
  pembuatanAnco: string;
  serok: string;
  transportasi: string;
  toples: string;
  // Step 4 – Asumsi Keuangan
  hargaJual: string;
  discountRate: string;
  umurProyek: string;
}

const INIT: F = {
  kepadatanTebar: "200",
  jumlahUnit: "4",
  luasUnit: "25",
  sr: "90",
  adg: "2.5",
  masaPemeliharaan: "90",
  fcr: "1.4",
  kja: "12000000",
  waring: "4000000",
  peralatanLain: "2000000",
  gajiPerBulan: "1500000",
  lamaGaji: "3",
  hargaBenur: "65",
  hargaPakan: "14000",
  pembuatanAnco: "500000",
  serok: "300000",
  transportasi: "750000",
  toples: "200000",
  hargaJual: "100000",
  discountRate: "12",
  umurProyek: "5",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-foreground text-xs font-semibold mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          className="w-full h-10 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          style={{
            paddingRight: unit
              ? `${unit.length * 7 + 16}px`
              : "12px",
          }}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[11px] font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className="text-muted-foreground text-[10px] mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}

function AutoField({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-muted/40"}`}
    >
      <p className="text-muted-foreground text-[10px] font-medium mb-0.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-bold text-sm ${accent ? "text-primary" : "text-foreground"}`}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-muted-foreground text-[10px]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
  verdict,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  verdict?: { text: string; ok: boolean };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {verdict && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              verdict.ok
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {verdict.ok ? (
              <CheckCircle2 size={10} />
            ) : (
              <AlertCircle size={10} />
            )}
            {verdict.text}
          </span>
        )}
      </div>
      <div>
        <p className="text-muted-foreground text-[10px] font-medium">
          {label}
        </p>
        <p
          className="text-foreground font-bold text-lg leading-tight"
          style={{ fontFamily: "Poppins, sans-serif", color }}
        >
          {value}
        </p>
        <p className="text-muted-foreground text-[10px] mt-0.5">
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
      <p className="text-muted-foreground mb-1.5 font-medium">
        {label}
      </p>
      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          className="flex items-center gap-2 mb-0.5"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-muted-foreground">
            {p.name}:
          </span>
          <span className="text-foreground font-semibold">
            {p.value >= 100000
              ? fmtIDR(p.value)
              : typeof p.value === "number"
                ? p.value.toFixed(2)
                : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Parameter Produksi", short: "Produksi" },
  { id: 2, label: "Biaya Investasi", short: "Investasi" },
  { id: 3, label: "Biaya Operasional", short: "Operasional" },
  { id: 4, label: "Asumsi Keuangan", short: "Keuangan" },
  { id: 5, label: "Hasil & Analisis", short: "Hasil" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export function HarvestAnalysis() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [form, setForm] = useState<F>(INIT);
  const [saved, setSaved] = useState(false);
  const [chartTab, setChartTab] = useState<
    "bio" | "eco" | "feasibility"
  >("eco");

  const set = (k: keyof F) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // ── Derived values ──────────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const kepadatan = num(form.kepadatanTebar);
    const unit = num(form.jumlahUnit);
    const luas = num(form.luasUnit);
    const sr = num(form.sr) / 100;
    const adg = num(form.adg);
    const masa = num(form.masaPemeliharaan);
    const fcr = num(form.fcr);
    const hJual = num(form.hargaJual);
    const hBenur = num(form.hargaBenur);
    const hPakan = num(form.hargaPakan);
    const rate = num(form.discountRate) / 100;
    const years = num(form.umurProyek);
    const gajiPerBln = num(form.gajiPerBulan);
    const lamaGaji = num(form.lamaGaji);

    // 1. Biologi
    const totalPopulasi = kepadatan * unit * luas;
    const finalWeight = (adg * masa) / 10; // gram
    const biomassa = (totalPopulasi * sr * finalWeight) / 1000; // kg

    // 2. Investasi
    const totalInvestasi =
      num(form.kja) +
      num(form.waring) +
      num(form.peralatanLain);
    const penyusutan = 0.02 * totalInvestasi;
    const gaji = gajiPerBln * lamaGaji;
    const biayaTetap = penyusutan + gaji;

    // 3. Operasional
    const biayaBenur = hBenur * totalPopulasi;
    const kebutuhanPakan = biomassa * fcr;
    const biayaPakan = hPakan * kebutuhanPakan;
    const totalOperasional =
      biayaBenur +
      biayaPakan +
      num(form.pembuatanAnco) +
      num(form.serok) +
      num(form.transportasi) +
      num(form.toples);

    // 4. Ringkasan Biaya
    const totalBiaya = biayaTetap + totalOperasional;
    const pendapatan = biomassa * hJual;
    const labaBersih = pendapatan - totalBiaya;

    // 5. BEP
    const bepUnit = hJual > 0 ? totalBiaya / hJual : 0; // kg
    const bepHarga = biomassa > 0 ? totalBiaya / biomassa : 0; // Rp/kg

    // 6. Kelayakan
    const masaBulan = masa / 30;
    const siklusPerTahun = masaBulan > 0 ? 12 / masaBulan : 0;
    const cashFlow = (labaBersih + penyusutan) * siklusPerTahun;
    const annuityFactor =
      rate > 0
        ? (1 - Math.pow(1 + rate, -years)) / rate
        : years;
    const npv = cashFlow * annuityFactor - totalInvestasi;
    const netBC =
      totalInvestasi > 0
        ? (cashFlow * annuityFactor) / totalInvestasi
        : 0;
    const pp =
      cashFlow > 0 ? totalInvestasi / cashFlow : Infinity;
    const irr = calcIRR(
      totalInvestasi,
      cashFlow,
      Math.round(years),
    );
    const roi =
      totalInvestasi > 0
        ? (labaBersih / totalInvestasi) * 100
        : 0;
    const roiTahunan =
      totalInvestasi > 0
        ? ((labaBersih * siklusPerTahun) / totalInvestasi) * 100
        : 0;

    // Chart data: cumulative cash flow over project life
    const cumData: {
      year: string;
      cashFlow: number;
      kumulatif: number;
    }[] = [];
    let kum = -totalInvestasi;
    for (let y = 1; y <= Math.min(Math.round(years), 10); y++) {
      kum += cashFlow;
      cumData.push({
        year: `Th ${y}`,
        cashFlow,
        kumulatif: kum,
      });
    }

    // Cost breakdown for chart
    const costChart = [
      { name: "Biaya Tetap", value: biayaTetap },
      { name: "Benur", value: biayaBenur },
      { name: "Pakan", value: biayaPakan },
      {
        name: "Lainnya",
        value:
          num(form.pembuatanAnco) +
          num(form.serok) +
          num(form.transportasi) +
          num(form.toples),
      },
    ];

    const totalLuas = unit * luas;
    const produksiBiomassa = totalLuas > 0 ? biomassa / totalLuas : 0;

    return {
      totalPopulasi,
      finalWeight,
      biomassa,
      produksiBiomassa,
      totalLuas,
      totalInvestasi,
      penyusutan,
      gaji,
      biayaTetap,
      biayaBenur,
      kebutuhanPakan,
      biayaPakan,
      totalOperasional,
      totalBiaya,
      pendapatan,
      labaBersih,
      bepUnit,
      bepHarga,
      masaBulan,
      siklusPerTahun,
      cashFlow,
      annuityFactor,
      npv,
      netBC,
      pp,
      irr,
      roi,
      roiTahunan,
      cumData,
      costChart,
    };
  }, [form]);

  const DISC_RATE = num(form.discountRate);
  const YEARS = num(form.umurProyek);

  // ── Navigation ──────────────────────────────────────────────────────────────
  function go(n: number) {
    setDir(n > step ? 1 : -1);
    setStep(n);
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-foreground text-2xl lg:text-3xl"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          Analisis Bioekonomi Panen
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Model bioeconomic Kolam — identik dengan perhitungan
          Excel penelitian Anda.
        </p>
      </div>

      {/* Live preview bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "🐟 Biomassa",
            value: `${fmtNum(calc.biomassa, 1)} kg`,
          },
          {
            label: "💰 Pendapatan",
            value: fmtIDR(calc.pendapatan),
          },
          {
            label: "💵 Laba Bersih",
            value: fmtIDR(calc.labaBersih),
          },
          {
            label: "📈 ROI/Siklus",
            value: `${fmtNum(calc.roi, 1)}%`,
          },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-card border border-border rounded-xl px-3 py-2.5"
          >
            <p className="text-muted-foreground text-[10px]">
              {k.label}
            </p>
            <p
              className="text-foreground font-bold text-sm mt-0.5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Stepper */}
      <div className="mb-6 flex items-center gap-0">
        {STEPS.map((s, i) => {
          const done = s.id < step;
          const active = s.id === step;
          return (
            <div
              key={s.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                onClick={() => go(s.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${done ? "bg-primary text-white" : active ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}
                >
                  {done ? <CheckCircle2 size={15} /> : s.id}
                </div>
                <span
                  className={`text-[9px] font-medium hidden sm:block whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {s.short}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 rounded-full transition-colors duration-400"
                  style={{
                    backgroundColor: done
                      ? "#2563EB"
                      : "var(--border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step card */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-5 overflow-hidden min-h-[360px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {/* ── STEP 1: Parameter Produksi ── */}
            {step === 1 && (
              <div>
                <h2
                  className="text-foreground font-semibold mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Parameter Produksi
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <Field
                    label="Kepadatan Tebar"
                    value={form.kepadatanTebar}
                    onChange={set("kepadatanTebar")}
                    unit="ekor/m²"
                  />
                  <Field
                    label="Jumlah Unit Kolam"
                    value={form.jumlahUnit}
                    onChange={set("jumlahUnit")}
                    unit="unit"
                  />
                  <Field
                    label="Luas per Unit Kolam"
                    value={form.luasUnit}
                    onChange={set("luasUnit")}
                    unit="m²"
                  />
                  <Field
                    label="Survival Rate (SR)"
                    value={form.sr}
                    onChange={set("sr")}
                    unit="%"
                  />
                  <Field
                    label="ADG (Pertambahan Bobot Harian)"
                    value={form.adg}
                    onChange={set("adg")}
                    unit="g/hari"
                  />
                  <Field
                    label="Masa Pemeliharaan"
                    value={form.masaPemeliharaan}
                    onChange={set("masaPemeliharaan")}
                    unit="hari"
                  />
                  <Field
                    label="FCR"
                    value={form.fcr}
                    onChange={set("fcr")}
                    unit="-"
                    hint="Feed Conversion Ratio — efisiensi pakan"
                  />
                </div>
                {/* Auto-calculated */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <AutoField
                    label="Total Populasi Tebar"
                    value={Math.round(
                      calc.totalPopulasi,
                    ).toLocaleString("id-ID")}
                    unit="ekor"
                    accent
                  />
                  <AutoField
                    label="Bobot Akhir (ADG × Masa)"
                    value={fmtNum(calc.finalWeight, 1)}
                    unit="gram"
                  />
                  <AutoField
                    label="Total Panen"
                    value={fmtNum(calc.biomassa, 2)}
                    unit="kg"
                    accent
                  />
                  <AutoField
                    label="Produksi Biomassa"
                    value={fmtNum(calc.produksiBiomassa, 3)}
                    unit="kg/m²"
                    accent
                  />
                </div>
                <div className="mt-3 bg-secondary/40 border border-border rounded-xl p-3 text-xs text-muted-foreground space-y-0.5">
                  <p>
                    <span className="font-semibold text-foreground">
                      Total Populasi
                    </span>{" "}
                    = Kepadatan × Jumlah Unit × Luas ={" "}
                    {Math.round(
                      calc.totalPopulasi,
                    ).toLocaleString("id-ID")}{" "}
                    ekor
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">
                      Total Panen
                    </span>{" "}
                    = (Populasi × SR × Bobot Akhir) ={" "}
                    {fmtNum(calc.biomassa, 2)} kg
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">
                      Produksi Biomassa
                    </span>{" "}
                    = Total Panen ÷ Total Luas Kolam ({fmtNum(calc.totalLuas, 0)} m²) ={" "}
                    {fmtNum(calc.produksiBiomassa, 3)} kg/m²
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 2: Biaya Investasi ── */}
            {step === 2 && (
              <div>
                <h2
                  className="text-foreground font-semibold mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Biaya Investasi
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <Field
                    label="Kolam (Keramba Jaring Apung)"
                    value={form.kja}
                    onChange={set("kja")}
                    unit="Rp"
                    placeholder="12000000"
                  />
                  <Field
                    label="Waring / Jaring"
                    value={form.waring}
                    onChange={set("waring")}
                    unit="Rp"
                  />
                  <Field
                    label="Peralatan Lain"
                    value={form.peralatanLain}
                    onChange={set("peralatanLain")}
                    unit="Rp"
                  />
                  <div className="sm:col-span-2 grid sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                    <Field
                      label="Gaji Pegawai / Bulan"
                      value={form.gajiPerBulan}
                      onChange={set("gajiPerBulan")}
                      unit="Rp"
                    />
                    <Field
                      label="Lama Pembayaran Gaji"
                      value={form.lamaGaji}
                      onChange={set("lamaGaji")}
                      unit="bulan"
                      hint={`Total gaji = ${fmtIDR(calc.gaji)}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <AutoField
                    label="Total Investasi"
                    value={fmtIDR(calc.totalInvestasi)}
                    accent
                  />
                  <AutoField
                    label="Penyusutan (2% × Investasi)"
                    value={fmtIDR(calc.penyusutan)}
                  />
                  <AutoField
                    label="Total Gaji"
                    value={fmtIDR(calc.gaji)}
                  />
                  <AutoField
                    label="Total Biaya Tetap"
                    value={fmtIDR(calc.biayaTetap)}
                    accent
                  />
                </div>
                <p className="text-muted-foreground text-[10px] mt-3">
                  Penyusutan = 2% × Total Investasi · Biaya
                  Tetap = Penyusutan + Gaji
                </p>
              </div>
            )}

            {/* ── STEP 3: Biaya Operasional ── */}
            {step === 3 && (
              <div>
                <h2
                  className="text-foreground font-semibold mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Biaya Operasional
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <Field
                    label="Harga Benur"
                    value={form.hargaBenur}
                    onChange={set("hargaBenur")}
                    unit="Rp/ekor"
                    hint={`Biaya benur = ${fmtIDR(calc.biayaBenur)} (× ${Math.round(calc.totalPopulasi).toLocaleString("id-ID")} ekor)`}
                  />
                  <Field
                    label="Harga Pakan"
                    value={form.hargaPakan}
                    onChange={set("hargaPakan")}
                    unit="Rp/kg"
                    hint={`Kebutuhan pakan = ${fmtNum(calc.kebutuhanPakan, 1)} kg · Biaya = ${fmtIDR(calc.biayaPakan)}`}
                  />
                  <Field
                    label="Pembuatan Anco"
                    value={form.pembuatanAnco}
                    onChange={set("pembuatanAnco")}
                    unit="Rp"
                  />
                  <Field
                    label="Serok"
                    value={form.serok}
                    onChange={set("serok")}
                    unit="Rp"
                  />
                  <Field
                    label="Transportasi"
                    value={form.transportasi}
                    onChange={set("transportasi")}
                    unit="Rp"
                  />
                  <Field
                    label="Toples / Kemasan"
                    value={form.toples}
                    onChange={set("toples")}
                    unit="Rp"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <AutoField
                    label="Biaya Benur"
                    value={fmtIDR(calc.biayaBenur)}
                  />
                  <AutoField
                    label="Biaya Pakan"
                    value={fmtIDR(calc.biayaPakan)}
                  />
                  <AutoField
                    label="Total Operasional"
                    value={fmtIDR(calc.totalOperasional)}
                    accent
                  />
                  <AutoField
                    label="Total Biaya Produksi"
                    value={fmtIDR(calc.totalBiaya)}
                    accent
                  />
                </div>
                <p className="text-muted-foreground text-[10px] mt-3">
                  Kebutuhan Pakan = Biomassa × FCR ={" "}
                  {fmtNum(calc.kebutuhanPakan, 1)} kg · Total
                  Biaya = Biaya Tetap + Operasional
                </p>
              </div>
            )}

            {/* ── STEP 4: Asumsi Keuangan ── */}
            {step === 4 && (
              <div>
                <h2
                  className="text-foreground font-semibold mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Asumsi Keuangan
                </h2>
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  <Field
                    label="Harga Jual"
                    value={form.hargaJual}
                    onChange={set("hargaJual")}
                    unit="Rp/kg"
                  />
                  <Field
                    label="Discount Rate (i)"
                    value={form.discountRate}
                    onChange={set("discountRate")}
                    unit="% p.a."
                    hint="Suku bunga pembanding / MARR"
                  />
                  <Field
                    label="Umur Proyek (n)"
                    value={form.umurProyek}
                    onChange={set("umurProyek")}
                    unit="tahun"
                  />
                </div>

                {/* Summary table */}
                <div className="rounded-2xl border border-border overflow-hidden text-sm">
                  {[
                    {
                      label: "Biomassa Panen",
                      val: `${fmtNum(calc.biomassa, 2)} kg`,
                    },
                    {
                      label: "Pendapatan",
                      val: fmtIDR(calc.pendapatan, false),
                    },
                    {
                      label: "Total Biaya",
                      val: fmtIDR(calc.totalBiaya, false),
                    },
                    {
                      label: "Laba Bersih",
                      val: fmtIDR(calc.labaBersih, false),
                      accent: true,
                    },
                    {
                      label: "BEP Unit",
                      val: `${fmtNum(calc.bepUnit, 1)} kg`,
                      border: true,
                    },
                    {
                      label: "BEP Harga",
                      val: `${fmtIDR(calc.bepHarga, false)}/kg`,
                    },
                    {
                      label: "Siklus / Tahun",
                      val: `${fmtNum(calc.siklusPerTahun, 2)} ×`,
                      border: true,
                    },
                    {
                      label: "Cash Flow / Tahun",
                      val: fmtIDR(calc.cashFlow, false),
                      accent: true,
                    },
                    {
                      label: "Faktor Anuitas PV(i,n)",
                      val: `${fmtNum(calc.annuityFactor, 4)}`,
                    },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className={`flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0
                        ${r.border ? "mt-0 bg-muted/30" : ""}
                        ${r.accent ? "bg-primary/5" : ""}`}
                    >
                      <span className="text-muted-foreground text-xs">
                        {r.label}
                      </span>
                      <span
                        className={`text-xs font-semibold ${r.accent ? "text-primary" : "text-foreground"}`}
                      >
                        {r.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 5: Hasil & Analisis ── */}
            {step === 5 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-foreground font-semibold"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Hasil & Analisis Kelayakan
                  </h2>
                  {saved && (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <CheckCircle2 size={14} /> Tersimpan
                    </span>
                  )}
                </div>

                {/* KPI Row 1 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <KPICard
                    label="🐟 Biomassa Panen"
                    value={`${fmtNum(calc.biomassa, 1)} kg`}
                    sub={`SR ${form.sr}% × ${fmtNum(calc.finalWeight, 0)} g/ekor`}
                    icon={Fish}
                    color="#0EA5E9"
                    bg="#F0F9FF"
                  />
                  <KPICard
                    label="💰 Pendapatan"
                    value={fmtIDR(calc.pendapatan)}
                    sub={`${fmtNum(calc.biomassa, 1)} kg × Rp ${Number(form.hargaJual).toLocaleString("id-ID")}`}
                    icon={DollarSign}
                    color="#10B981"
                    bg="#F0FDF4"
                  />
                  <KPICard
                    label="📈 NPV"
                    value={fmtIDR(calc.npv)}
                    sub={`r=${form.discountRate}%, n=${form.umurProyek} th`}
                    icon={TrendingUp}
                    color={calc.npv > 0 ? "#2563EB" : "#EF4444"}
                    bg="#EFF6FF"
                    verdict={{
                      text: calc.npv > 0 ? "LAYAK" : "TIDAK",
                      ok: calc.npv > 0,
                    }}
                  />
                  <KPICard
                    label="💵 Laba Bersih"
                    value={fmtIDR(calc.labaBersih)}
                    sub="per siklus budidaya"
                    icon={BarChart3}
                    color={
                      calc.labaBersih > 0
                        ? "#10B981"
                        : "#EF4444"
                    }
                    bg="#F0FDF4"
                    verdict={{
                      text:
                        calc.labaBersih > 0 ? "PROFIT" : "RUGI",
                      ok: calc.labaBersih > 0,
                    }}
                  />
                </div>

                {/* KPI Row 2 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <KPICard
                    label="✅ ROI / Tahun"
                    value={`${fmtNum(calc.roiTahunan, 1)}%`}
                    sub={`${fmtNum(calc.roi, 1)}% per siklus`}
                    icon={Percent}
                    color={
                      calc.roiTahunan > 5
                        ? "#10B981"
                        : "#EF4444"
                    }
                    bg="#F0FDF4"
                    verdict={{
                      text:
                        calc.roiTahunan > 5
                          ? "LAYAK"
                          : "KURANG",
                      ok: calc.roiTahunan > 5,
                    }}
                  />
                  <KPICard
                    label="✅ IRR"
                    value={`${fmtNum(calc.irr, 1)}%`}
                    sub={`Benchmark: ${form.discountRate}%`}
                    icon={Activity}
                    color={
                      calc.irr > DISC_RATE
                        ? "#10B981"
                        : "#EF4444"
                    }
                    bg="#F0FDF4"
                    verdict={{
                      text:
                        calc.irr > DISC_RATE
                          ? "LAYAK"
                          : "TIDAK",
                      ok: calc.irr > DISC_RATE,
                    }}
                  />
                  <KPICard
                    label="✅ Net B/C"
                    value={fmtNum(calc.netBC, 2)}
                    sub="Net Benefit Cost Ratio"
                    icon={Target}
                    color={
                      calc.netBC > 1 ? "#10B981" : "#EF4444"
                    }
                    bg="#F0FDF4"
                    verdict={{
                      text: calc.netBC > 1 ? "LAYAK" : "TIDAK",
                      ok: calc.netBC > 1,
                    }}
                  />
                  <KPICard
                    label="🎯 Payback Period"
                    value={
                      isFinite(calc.pp)
                        ? `${fmtNum(calc.pp, 1)} th`
                        : "∞"
                    }
                    sub={`Umur proyek: ${form.umurProyek} tahun`}
                    icon={Clock}
                    color={
                      calc.pp < YEARS ? "#10B981" : "#EF4444"
                    }
                    bg="#FFF7ED"
                    verdict={{
                      text: calc.pp < YEARS ? "LAYAK" : "LAMA",
                      ok: calc.pp < YEARS,
                    }}
                  />
                </div>

                {/* Charts */}
                <div className="flex gap-1 bg-muted p-1 rounded-xl mb-4 w-fit">
                  {(["bio", "eco", "feasibility"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setChartTab(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          chartTab === t
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t === "bio"
                          ? "Biologis"
                          : t === "eco"
                            ? "Ekonomi"
                            : "Kelayakan"}
                      </button>
                    ),
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {chartTab === "bio" && (
                    <motion.div
                      key="bio"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid sm:grid-cols-2 gap-4"
                    >
                      {/* SR / ADG / FCR bar */}
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <p className="text-foreground text-xs font-semibold mb-3">
                          Parameter Biologis
                        </p>
                        <ResponsiveContainer
                          width="100%"
                          height={140}
                        >
                          <BarChart
                            data={[
                              {
                                name: "SR (%)",
                                value: num(form.sr),
                              },
                              {
                                name: "ADG (g)",
                                value: num(form.adg),
                              },
                              {
                                name: "FCR",
                                value: num(form.fcr) * 10,
                              },
                            ]}
                            barSize={36}
                          >
                            <XAxis
                              dataKey="name"
                              tick={{
                                fontSize: 10,
                                fill: "var(--muted-foreground)",
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                              content={<CustomTooltip />}
                            />
                            <Bar
                              dataKey="value"
                              name="Nilai"
                              radius={[6, 6, 0, 0]}
                              fill="#2563EB"
                              fillOpacity={0.85}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Biomassa breakdown */}
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <p className="text-foreground text-xs font-semibold mb-3">
                          Ringkasan Produksi
                        </p>
                        <div className="space-y-2.5">
                          {[
                            {
                              label: "Total Populasi Tebar",
                              val: `${Math.round(calc.totalPopulasi).toLocaleString("id-ID")} ekor`,
                            },
                            {
                              label: "Final Weight",
                              val: `${fmtNum(calc.finalWeight, 1)} gram`,
                            },
                            {
                              label: "Survival Rate",
                              val: `${form.sr}%`,
                            },
                            {
                              label: "Biomassa Panen",
                              val: `${fmtNum(calc.biomassa, 2)} kg`,
                              hi: true,
                            },
                            {
                              label: "Kebutuhan Pakan",
                              val: `${fmtNum(calc.kebutuhanPakan, 1)} kg`,
                            },
                          ].map((r) => (
                            <div
                              key={r.label}
                              className={`flex justify-between text-xs ${r.hi ? "font-semibold text-primary" : ""}`}
                            >
                              <span className="text-muted-foreground">
                                {r.label}
                              </span>
                              <span className="text-foreground">
                                {r.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {chartTab === "eco" && (
                    <motion.div
                      key="eco"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid sm:grid-cols-2 gap-4"
                    >
                      {/* Cost breakdown */}
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <p className="text-foreground text-xs font-semibold mb-3">
                          Komponen Biaya
                        </p>
                        <ResponsiveContainer
                          width="100%"
                          height={140}
                        >
                          <BarChart
                            data={calc.costChart}
                            layout="vertical"
                            barSize={18}
                          >
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="name"
                              type="category"
                              tick={{
                                fontSize: 10,
                                fill: "var(--muted-foreground)",
                              }}
                              axisLine={false}
                              tickLine={false}
                              width={80}
                            />
                            <Tooltip
                              content={<CustomTooltip />}
                            />
                            <Bar
                              dataKey="value"
                              name="Biaya"
                              radius={[0, 6, 6, 0]}
                              fill="#0EA5E9"
                              fillOpacity={0.85}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Revenue vs Cost */}
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <p className="text-foreground text-xs font-semibold mb-3">
                          Pendapatan vs Biaya
                        </p>
                        <ResponsiveContainer
                          width="100%"
                          height={140}
                        >
                          <BarChart
                            data={[
                              {
                                name: "Pendapatan",
                                value: calc.pendapatan,
                                fill: "#10B981",
                              },
                              {
                                name: "Total Biaya",
                                value: calc.totalBiaya,
                                fill: "#EF4444",
                              },
                              {
                                name: "Laba Bersih",
                                value: Math.max(
                                  calc.labaBersih,
                                  0,
                                ),
                                fill: "#2563EB",
                              },
                            ]}
                            barSize={44}
                          >
                            <XAxis
                              dataKey="name"
                              tick={{
                                fontSize: 10,
                                fill: "var(--muted-foreground)",
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                              content={<CustomTooltip />}
                            />
                            <Bar
                              dataKey="value"
                              name="Nilai"
                              radius={[6, 6, 0, 0]}
                            >
                              {[
                                { fill: "#10B981" },
                                { fill: "#EF4444" },
                                { fill: "#2563EB" },
                              ].map((c, i) => (
                                <motion.rect
                                  key={i}
                                  fill={c.fill}
                                  fillOpacity={0.85}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {chartTab === "feasibility" && (
                    <motion.div
                      key="feasibility"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <p className="text-foreground text-xs font-semibold mb-1">
                          Kumulatif Arus Kas
                        </p>
                        <p className="text-muted-foreground text-[10px] mb-3">
                          Payback Period pada titik kumulatif =
                          0 ·{" "}
                          {isFinite(calc.pp)
                            ? `Est. ${fmtNum(calc.pp, 1)} tahun`
                            : "Belum BEP"}
                        </p>
                        <ResponsiveContainer
                          width="100%"
                          height={180}
                        >
                          <LineChart data={calc.cumData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border)"
                            />
                            <XAxis
                              dataKey="year"
                              tick={{
                                fontSize: 10,
                                fill: "var(--muted-foreground)",
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{
                                fontSize: 10,
                                fill: "var(--muted-foreground)",
                              }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(v) => fmtIDR(v)}
                            />
                            <Tooltip
                              content={<CustomTooltip />}
                            />
                            <ReferenceLine
                              y={0}
                              stroke="#EF4444"
                              strokeDasharray="4 3"
                              strokeWidth={1.5}
                            />
                            <Line
                              type="monotone"
                              dataKey="kumulatif"
                              name="Kumulatif"
                              stroke="#2563EB"
                              strokeWidth={2.5}
                              dot={{
                                r: 4,
                                fill: "#2563EB",
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="cashFlow"
                              name="Cash Flow/th"
                              stroke="#10B981"
                              strokeWidth={1.5}
                              strokeDasharray="5 3"
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          {[
                            {
                              label: "NPV",
                              val: fmtIDR(calc.npv),
                              ok: calc.npv > 0,
                              crit: "> 0",
                            },
                            {
                              label: "IRR",
                              val: `${fmtNum(calc.irr, 1)}%`,
                              ok: calc.irr > DISC_RATE,
                              crit: `> ${DISC_RATE}%`,
                            },
                            {
                              label: "Net B/C",
                              val: fmtNum(calc.netBC, 2),
                              ok: calc.netBC > 1,
                              crit: "> 1.0",
                            },
                            {
                              label: "PP",
                              val: isFinite(calc.pp)
                                ? `${fmtNum(calc.pp, 1)} th`
                                : "∞",
                              ok: calc.pp < YEARS,
                              crit: `< ${YEARS} th`,
                            },
                          ].map((m) => (
                            <div
                              key={m.label}
                              className={`rounded-xl p-2.5 border ${m.ok ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800" : "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"}`}
                            >
                              <p className="text-muted-foreground text-[10px]">
                                {m.label}{" "}
                                <span className="opacity-60">
                                  (kriteria {m.crit})
                                </span>
                              </p>
                              <p
                                className={`font-bold mt-0.5 ${m.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                {m.val}
                              </p>
                              <p
                                className={`text-[9px] mt-0.5 font-semibold ${m.ok ? "text-emerald-600" : "text-red-500"}`}
                              >
                                {m.ok
                                  ? "✓ LAYAK"
                                  : "✗ TIDAK LAYAK"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => go(step - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Sebelumnya
        </button>
        <span className="text-muted-foreground text-xs">
          Langkah {step} / {STEPS.length}
        </span>
        {step < 5 ? (
          <button
            onClick={() => go(step + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            <CheckCircle2 size={16} /> Simpan Analisis
          </button>
        )}
      </div>
    </div>
  );
}