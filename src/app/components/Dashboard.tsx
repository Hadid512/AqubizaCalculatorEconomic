import { useState } from "react";
import { motion } from "motion/react";
import { NewCycleModal } from "./NewCycleModal";
import {
  Fish,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  BarChart3,
  Droplets,
  Zap,
  Bell,
  ChevronRight,
  Calendar,
  Leaf,
} from "lucide-react";
import { AreaChart, Area } from "recharts";

const sparklineData = [
  { v: 62 },
  { v: 65 },
  { v: 68 },
  { v: 64 },
  { v: 70 },
  { v: 73 },
  { v: 71 },
  { v: 75 },
];

const cultivations = [
  {
    id: "c1",
    name: "Tambak Bandeng A1",
    commodity: "Bandeng (Milkfish)",
    day: 45,
    totalDays: 120,
    sr: 92.3,
    fcr: 1.42,
    status: "healthy",
    harvest: "2025-08-15",
    biomass: "1.24 ton",
  },
  {
    id: "c2",
    name: "Tambak Udang B2",
    commodity: "Udang Vaname",
    day: 28,
    totalDays: 90,
    sr: 88.1,
    fcr: 1.68,
    status: "warning",
    harvest: "2025-07-20",
    biomass: "0.86 ton",
  },
  {
    id: "c3",
    name: "Kolam Lele C3",
    commodity: "Lele Dumbo",
    day: 67,
    totalDays: 80,
    sr: 95.7,
    fcr: 1.15,
    status: "excellent",
    harvest: "2025-06-28",
    biomass: "2.10 ton",
  },
];

const notifications = [
  {
    id: "n1",
    type: "critical",
    title: "FCR Meningkat",
    desc: "FCR Tambak B2 mencapai 1.68 — di atas batas ideal.",
    time: "2j lalu",
  },
  {
    id: "n2",
    type: "info",
    title: "Sampling Mingguan",
    desc: "Jadwal sampling Tambak A1 pada hari ini pukul 07.00.",
    time: "4j lalu",
  },
  {
    id: "n3",
    type: "success",
    title: "Panen Sukses",
    desc: "Tambak C2 berhasil panen 1.8 ton dengan SR 94%.",
    time: "1h lalu",
  },
];

const upcoming = [
  {
    id: "u1",
    label: "Sampling Minggu ke-7 — Tambak A1",
    date: "Hari ini",
    icon: Droplets,
    color: "#2563EB",
  },
  {
    id: "u2",
    label: "Pemberian pakan sore — Tambak B2",
    date: "16.00 WIB",
    icon: Fish,
    color: "#10B981",
  },
  {
    id: "u3",
    label: "Estimasi panen — Tambak C3",
    date: "28 Jun 2025",
    icon: Calendar,
    color: "#F97316",
  },
];

const kpis = [
  {
    label: "Siklus Aktif",
    value: "3",
    unit: "tambak",
    icon: Fish,
    trend: "+1 bulan ini",
    up: true,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    label: "Est. Keuntungan",
    value: "Rp 48.000.000",
    unit: "siklus ini",
    icon: TrendingUp,
    trend: "+12% vs siklus lalu",
    up: true,
    color: "#10B981",
    bg: "#F0FDF4",
  },
  {
    label: "Survival Rate",
    value: "92,4%",
    unit: "rata-rata",
    icon: Leaf,
    trend: "-1.2% vs minggu lalu",
    up: false,
    color: "#F97316",
    bg: "#FFF7ED",
  },
  {
    label: "Feed Conv. Ratio",
    value: "1.41",
    unit: "FCR avg",
    icon: Zap,
    trend: "Dalam batas ideal",
    up: true,
    color: "#0EA5E9",
    bg: "#F0F9FF",
  },
];

function StatCard({ kpi }: { kpi: (typeof kpis)[0] }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      whileHover={{
        y: -2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
      className="bg-card rounded-2xl p-5 border border-border transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: kpi.bg }}
        >
          <Icon size={20} style={{ color: kpi.color }} />
        </div>
        <AreaChart width={60} height={32} data={sparklineData}>
          <defs>
            <linearGradient
              id={`sg-${kpi.label}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={kpi.color}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={kpi.color}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={kpi.color}
            fill={`url(#sg-${kpi.label})`}
            strokeWidth={1.5}
            dot={false}
          />
        </AreaChart>
      </div>
      <p className="text-muted-foreground text-xs mb-1">
        {kpi.label}
      </p>
      <p
        className="text-foreground text-xl font-semibold"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {kpi.value}
      </p>
      <p className="text-muted-foreground text-xs mt-0.5">
        {kpi.unit}
      </p>
      <div
        className={`flex items-center gap-1 mt-3 text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-orange-500"}`}
      >
        {kpi.up ? (
          <TrendingUp size={12} />
        ) : (
          <TrendingDown size={12} />
        )}
        {kpi.trend}
      </div>
    </motion.div>
  );
}

function CultivationCard({
  c,
  onNavigate,
}: {
  c: (typeof cultivations)[0];
  onNavigate: () => void;
}) {
  const pct = Math.round((c.day / c.totalDays) * 100);
  const statusColor =
    c.status === "excellent"
      ? "#10B981"
      : c.status === "healthy"
        ? "#2563EB"
        : "#F97316";
  const statusBg =
    c.status === "excellent"
      ? "#F0FDF4"
      : c.status === "healthy"
        ? "#EFF6FF"
        : "#FFF7ED";
  const statusLabel =
    c.status === "excellent"
      ? "Excellent"
      : c.status === "healthy"
        ? "Sehat"
        : "Perlu Perhatian";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onNavigate}
      className="bg-card rounded-2xl p-5 border border-border cursor-pointer transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4
            className="text-foreground font-semibold text-sm"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {c.name}
          </h4>
          <p className="text-muted-foreground text-xs mt-0.5">
            {c.commodity}
          </p>
        </div>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            color: statusColor,
            backgroundColor: statusBg,
          }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">
            Hari ke-{c.day} dari {c.totalDays}
          </span>
          <span className="text-xs font-semibold text-primary">
            {pct}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #2563EB, #0EA5E9)`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded-xl p-2">
          <p className="text-[10px] text-muted-foreground">
            SR
          </p>
          <p className="text-xs font-semibold text-foreground">
            {c.sr}%
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-2">
          <p className="text-[10px] text-muted-foreground">
            FCR
          </p>
          <p className="text-xs font-semibold text-foreground">
            {c.fcr}
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-2">
          <p className="text-[10px] text-muted-foreground">
            Biomassa
          </p>
          <p className="text-xs font-semibold text-foreground">
            {c.biomass}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
        <Calendar size={11} />
        <span>
          Est. panen:{" "}
          {new Date(c.harvest).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </motion.div>
  );
}

function NotifIcon({ type }: { type: string }) {
  if (type === "critical")
    return <AlertTriangle size={16} className="text-red-500" />;
  if (type === "success")
    return (
      <CheckCircle2 size={16} className="text-emerald-500" />
    );
  return <Bell size={16} className="text-blue-500" />;
}

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "critical"
  >("all");
  const [newCycleOpen, setNewCycleOpen] = useState(false);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1
              className="text-foreground text-2xl lg:text-3xl"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
              }}
            >
              Selamat Pagi, Ahmad 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Berikut ringkasan kondisi tambak Anda hari ini.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setNewCycleOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <Plus size={16} />
              Siklus Baru
            </button>
            <button
              onClick={() => onNavigate("cultivation")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <Fish size={16} className="text-primary" />
              Monitoring
            </button>
            <button
              onClick={() => onNavigate("harvest")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <BarChart3
                size={16}
                className="text-emerald-500"
              />
              Analisis Panen
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <StatCard kpi={kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bento Grid: Cultivations + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Cultivations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-foreground font-semibold"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Siklus Budidaya Aktif
            </h2>
            <button
              onClick={() => onNavigate("cultivation")}
              className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
            >
              Lihat semua <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {cultivations.map((c) => (
              <CultivationCard
                key={c.id}
                c={c}
                onNavigate={() => onNavigate("cultivation")}
              />
            ))}
            {/* Add new card */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => setNewCycleOpen(true)}
              className="rounded-2xl border-2 border-dashed border-border p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium">
                Mulai Siklus Baru
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Activities */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-card rounded-2xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-foreground font-semibold text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Aktivitas Mendatang
              </h3>
              <Clock
                size={16}
                className="text-muted-foreground"
              />
            </div>
            <div className="flex flex-col gap-3">
              {upcoming.map((u) => {
                const Icon = u.icon;
                return (
                  <div
                    key={u.id}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: u.color + "20",
                      }}
                    >
                      <Icon
                        size={15}
                        style={{ color: u.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs font-medium leading-snug">
                        {u.label}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">
                        {u.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Notification Center */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-5 flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-foreground font-semibold text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Notifikasi
              </h3>
              <div className="flex gap-2">
                {(["all", "critical"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tab === "all" ? "Semua" : "Kritis"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {notifications
                .filter(
                  (n) =>
                    activeTab === "all" ||
                    n.type === "critical",
                )
                .map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <NotifIcon type={n.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs font-medium">
                        {n.title}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                        {n.desc}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-1">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      <NewCycleModal
        open={newCycleOpen}
        onClose={() => setNewCycleOpen(false)}
        onSave={() => {
          setNewCycleOpen(false);
          onNavigate("cultivation");
        }}
      />
    </div>
  );
}