import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, TrendingUp, TrendingDown, Calendar, Fish, ChevronRight } from "lucide-react";

const historyData = [
  { id: "h1", commodity: "Bandeng (Milkfish)", pond: "Tambak 1", start: "2024-10-01", end: "2025-01-28", duration: 119, sr: 91.2, profit: 42800000, status: "success", fcr: 1.44, harvest: "1.82 ton" },
  { id: "h2", commodity: "Udang Vaname", pond: "Tambak 2", start: "2024-09-15", end: "2024-12-20", duration: 96, sr: 85.6, profit: 31200000, status: "success", fcr: 1.71, harvest: "0.94 ton" },
  { id: "h3", commodity: "Lele Dumbo", pond: "Kolam 3", start: "2024-11-01", end: "2025-01-22", duration: 82, sr: 96.1, profit: 18600000, status: "success", fcr: 1.12, harvest: "1.95 ton" },
  { id: "h4", commodity: "Nila Gift", pond: "Kolam 4", start: "2024-07-10", end: "2024-10-25", duration: 107, sr: 78.4, profit: -4200000, status: "loss", fcr: 1.95, harvest: "0.68 ton" },
  { id: "h5", commodity: "Bandeng (Milkfish)", pond: "Tambak 1", start: "2024-05-01", end: "2024-08-31", duration: 122, sr: 93.8, profit: 51400000, status: "success", fcr: 1.38, harvest: "2.14 ton" },
  { id: "h6", commodity: "Gurame", pond: "Kolam 5", start: "2024-01-15", end: "2024-07-05", duration: 172, sr: 87.3, profit: 76900000, status: "success", fcr: 1.55, harvest: "1.42 ton" },
];

const commodities = ["Semua", "Bandeng (Milkfish)", "Udang Vaname", "Lele Dumbo", "Nila Gift", "Gurame"];

function fmt(n: number) {
  const abs = Math.abs(n);
  const prefix = n < 0 ? "-Rp " : "Rp ";
  if (abs >= 1_000_000) return prefix + (abs / 1_000_000).toFixed(1) + " Jt";
  return prefix + abs.toLocaleString("id-ID");
}

export function History() {
  const [search, setSearch] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const filtered = historyData.filter((h) => {
    const matchSearch = h.commodity.toLowerCase().includes(search.toLowerCase()) || h.pond.toLowerCase().includes(search.toLowerCase());
    const matchCommodity = selectedCommodity === "Semua" || h.commodity === selectedCommodity;
    const matchStatus = selectedStatus === "Semua" || h.status === selectedStatus;
    return matchSearch && matchCommodity && matchStatus;
  });

  const totalProfit = filtered.reduce((s, h) => s + h.profit, 0);
  const avgSR = filtered.length ? filtered.reduce((s, h) => s + h.sr, 0) / filtered.length : 0;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-foreground text-2xl lg:text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
          Riwayat Budidaya
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Rekap seluruh siklus budidaya yang telah selesai.</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Siklus", value: filtered.length.toString(), color: "#2563EB" },
          { label: "Total Profit", value: fmt(totalProfit), color: totalProfit >= 0 ? "#10B981" : "#EF4444" },
          { label: "Avg SR", value: `${avgSR.toFixed(1)}%`, color: "#0EA5E9" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-muted-foreground text-[10px] mb-1">{s.label}</p>
            <p className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif', color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari komoditas atau kolam..."
            className="w-full h-10 pl-9 pr-3 bg-input-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <select
          value={selectedCommodity}
          onChange={(e) => setSelectedCommodity(e.target.value)}
          className="h-10 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          {commodities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          <option>Semua</option>
          <option value="success">Profit</option>
          <option value="loss">Rugi</option>
        </select>
      </div>

      {/* History Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Fish size={28} className="text-muted-foreground" />
          </div>
          <h3 className="text-foreground font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Tidak Ada Data</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Tidak ada siklus budidaya yang cocok dengan filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -1 }}
              className="bg-card rounded-2xl border border-border p-5 cursor-pointer hover:border-primary/20 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Fish size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-foreground font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{h.commodity}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        h.status === "success" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {h.status === "success" ? "Profit" : "Rugi"}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">{h.pond} · {h.duration} hari</p>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] mt-1.5">
                      <Calendar size={10} />
                      <span>{new Date(h.start).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} – {new Date(h.end).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`flex items-center gap-1 justify-end font-bold text-base ${h.profit >= 0 ? "text-emerald-600" : "text-red-500"}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {h.profit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {fmt(h.profit)}
                  </div>
                  <p className="text-muted-foreground text-[10px] mt-0.5">Panen: {h.harvest}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                {[
                  { label: "SR", value: `${h.sr}%`, good: h.sr >= 85 },
                  { label: "FCR", value: h.fcr.toString(), good: h.fcr <= 1.6 },
                  { label: "Panen", value: h.harvest, good: true },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-muted-foreground text-[10px]">{m.label}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${m.good ? "text-foreground" : "text-orange-500"}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
