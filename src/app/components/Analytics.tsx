import { useState } from "react";
import { motion } from "motion/react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, Fish, Zap, DollarSign } from "lucide-react";

const growthData = [
  { week: "W1", weight: 5.2, target: 5 },
  { week: "W2", weight: 14.8, target: 14 },
  { week: "W3", weight: 26.1, target: 25 },
  { week: "W4", weight: 38.5, target: 37 },
  { week: "W5", weight: 52.1, target: 50 },
  { week: "W6", weight: 63.8, target: 64 },
  { week: "W7", weight: 74.2, target: 79 },
  { week: "W8", weight: 85.4, target: 95 },
];

const mortalityData = [
  { day: "W1", mortality: 45, sr: 99.7 },
  { day: "W2", mortality: 62, sr: 99.3 },
  { day: "W3", mortality: 38, sr: 98.9 },
  { day: "W4", mortality: 55, sr: 98.6 },
  { day: "W5", mortality: 71, sr: 98.1 },
  { day: "W6", mortality: 43, sr: 97.9 },
  { day: "W7", mortality: 29, sr: 97.7 },
  { day: "W8", mortality: 37, sr: 97.5 },
];

const feedData = [
  { week: "W1", feed: 12.5, fcr: 1.20 },
  { week: "W2", feed: 24.8, fcr: 1.35 },
  { week: "W3", feed: 38.2, fcr: 1.38 },
  { week: "W4", feed: 42.5, fcr: 1.41 },
  { week: "W5", feed: 45.0, fcr: 1.40 },
  { week: "W6", feed: 46.5, fcr: 1.42 },
  { week: "W7", feed: 47.8, fcr: 1.43 },
  { week: "W8", feed: 48.5, fcr: 1.42 },
];

const revenueData = [
  { month: "Feb", revenue: 32500000, cost: 24800000, profit: 7700000 },
  { month: "Mar", revenue: 41200000, cost: 28600000, profit: 12600000 },
  { month: "Apr", revenue: 38900000, cost: 27200000, profit: 11700000 },
  { month: "Mei", revenue: 52100000, cost: 31400000, profit: 20700000 },
  { month: "Jun", revenue: 48200000, cost: 29800000, profit: 18400000 },
];

const costData = [
  { name: "Pakan", value: 52, color: "#2563EB" },
  { name: "Investasi", value: 23, color: "#0EA5E9" },
  { name: "Tenaga Kerja", value: 12, color: "#10B981" },
  { name: "Transportasi", value: 7, color: "#F97316" },
  { name: "Lainnya", value: 6, color: "#8B5CF6" },
];

function formatIDR(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}Rb`;
  return `Rp ${value}`;
}

type TabKey = "biological" | "feed" | "financial";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "biological", label: "Biologis", icon: Fish },
  { key: "feed", label: "Pakan", icon: Zap },
  { key: "financial", label: "Keuangan", icon: DollarSign },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-sm">
      <p className="text-muted-foreground text-xs mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground text-xs">{p.name}:</span>
          <span className="text-foreground text-xs font-semibold">
            {typeof p.value === "number" && p.value > 1_000_000 ? formatIDR(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function GaugeChart({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min(value / max, 1);
  const r = 50;
  const circ = Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="72" viewBox="0 0 120 72">
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="var(--muted)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="60" y="60" textAnchor="middle" fill="var(--foreground)" fontSize="16" fontWeight="700" fontFamily="Poppins, sans-serif">
          {value}%
        </text>
      </svg>
      <p className="text-muted-foreground text-xs mt-1">{label}</p>
    </div>
  );
}

export function Analytics() {
  const [activeTab, setActiveTab] = useState<TabKey>("biological");

  const kpis = [
    { label: "Total Revenue", value: "Rp 213 Jt", icon: DollarSign, color: "#10B981", trend: "+18%" },
    { label: "Avg FCR", value: "1.41", icon: Zap, color: "#0EA5E9", trend: "-0.03" },
    { label: "Avg SR", value: "92.4%", icon: Fish, color: "#2563EB", trend: "+1.2%" },
    { label: "Avg ADG", value: "3.8 g", icon: TrendingUp, color: "#F97316", trend: "+0.3" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-foreground text-2xl lg:text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
          Dashboard Analitik
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Analisis performa budidaya dan keuangan secara mendalam.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: k.color + "18" }}>
                <Icon size={18} style={{ color: k.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] truncate">{k.label}</p>
                <p className="text-foreground font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{k.value}</p>
                <p className="text-emerald-600 text-[10px] font-medium">{k.trend}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6 w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "biological" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
          {/* Growth Curve */}
          <div className="bg-card rounded-2xl border border-border p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Kurva Pertumbuhan</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-primary rounded" />Aktual</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-muted-foreground rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg, #94A3B8 0, #94A3B8 4px, transparent 4px, transparent 8px)" }} />Target</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={growthData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} unit="g" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="weight" name="Aktual" stroke="url(#growthGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mortality Trend */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Tren Mortalitas</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mortalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mortality" name="Mortalitas" fill="#EF4444" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SR Gauges */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Survival Rate per Tambak</h3>
            <div className="grid grid-cols-3 gap-2">
              <GaugeChart value={92} max={100} label="Tambak A1" color="#2563EB" />
              <GaugeChart value={88} max={100} label="Tambak B2" color="#F97316" />
              <GaugeChart value={96} max={100} label="Kolam C3" color="#10B981" />
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "feed" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
          {/* Feed Consumption */}
          <div className="bg-card rounded-2xl border border-border p-5 lg:col-span-2">
            <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Konsumsi Pakan & FCR Mingguan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={feedData}>
                <defs>
                  <linearGradient id="feedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} unit=" kg" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[1, 2]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area yAxisId="left" type="monotone" dataKey="feed" name="Pakan (kg)" stroke="#0EA5E9" fill="url(#feedGrad)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="fcr" name="FCR" stroke="#F97316" strokeWidth={2} dot={{ r: 3, fill: "#F97316" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* FCR Summary */}
          {[
            { label: "FCR Tambak A1", value: 1.42, ideal: 1.5, color: "#10B981" },
            { label: "FCR Tambak B2", value: 1.68, ideal: 1.5, color: "#EF4444" },
            { label: "FCR Kolam C3", value: 1.15, ideal: 1.5, color: "#10B981" },
            { label: "FCR Rata-rata", value: 1.41, ideal: 1.5, color: "#2563EB" },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground text-sm font-semibold">{item.label}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: item.color, backgroundColor: item.color + "18" }}>
                  {item.value <= item.ideal ? "Ideal" : "Di Atas Ideal"}
                </span>
              </div>
              <p className="text-foreground text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: item.color }}>{item.value}</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min((item.value / 2.5) * 100, 100)}%`, backgroundColor: item.color }} />
              </div>
              <p className="text-muted-foreground text-[10px] mt-1.5">Target FCR ≤ {item.ideal}</p>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "financial" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-card rounded-2xl border border-border p-5 lg:col-span-2">
            <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Revenue, Biaya & Profit</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1_000_000}Jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} fillOpacity={0.9} />
                <Bar dataKey="cost" name="Biaya" fill="#EF4444" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} fillOpacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Distribution */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Distribusi Biaya</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={costData} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={3} stroke="none">
                    {costData.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {costData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-muted-foreground text-xs">{c.name}</span>
                    </div>
                    <span className="text-foreground text-xs font-semibold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profit Projection */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-foreground font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Proyeksi Profit</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10B981" fill="url(#profitGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-muted-foreground text-[10px]">Total Profit YTD</p>
                <p className="text-foreground font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: "#10B981" }}>Rp 71,1 Jt</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-[10px]">Profit Margin</p>
                <p className="text-foreground font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>33.4%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
