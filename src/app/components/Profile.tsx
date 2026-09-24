import { useState } from "react";
import { motion } from "motion/react";
import { User, Building2, Phone, Mail, Bell, Globe, Shield, Moon, ChevronRight, Camera, CheckCircle2 } from "lucide-react";

interface ToggleProps { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void; }

function Toggle({ label, desc, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div>
        <p className="text-foreground text-sm font-medium">{label}</p>
        {desc && <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? "bg-primary" : "bg-switch-background"}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

interface SectionProps { title: string; icon: React.ElementType; color: string; children: React.ReactNode; }

function Section({ title, icon: Icon, color, children }: SectionProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon size={16} style={{ color }} />
        </div>
        <h3 className="text-foreground font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Profile({ onToggleDark, darkMode }: { onToggleDark: () => void; darkMode: boolean }) {
  const [notifHarvest, setNotifHarvest] = useState(true);
  const [notifMortality, setNotifMortality] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [lang, setLang] = useState("id");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("Ahmad Subagyo");
  const [org, setOrg] = useState("Tambak Sejahtera Group");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [email, setEmail] = useState("ahmad@tambaksejahtera.co.id");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-foreground text-2xl lg:text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
          Profil & Pengaturan
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola informasi akun dan preferensi platform.</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-5 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>AS</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
              <Camera size={12} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-foreground font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>{name}</h2>
            <p className="text-muted-foreground text-sm">{org}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Pembudidaya</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium dark:bg-emerald-900/30 dark:text-emerald-400">Pro Plan</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Nama Lengkap", value: name, onChange: setName, icon: User },
            { label: "Organisasi", value: org, onChange: setOrg, icon: Building2 },
            { label: "No. Telepon", value: phone, onChange: setPhone, icon: Phone },
            { label: "Email", value: email, onChange: setEmail, icon: Mail },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label}>
                <label className="block text-foreground text-xs font-medium mb-1.5">{f.label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-input-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="mt-4 w-full sm:w-auto px-5 h-10 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20"
        >
          {saved ? <><CheckCircle2 size={16} /> Perubahan Tersimpan</> : "Simpan Perubahan"}
        </button>
      </motion.div>

      <div className="space-y-4">
        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Section title="Tampilan" icon={Moon} color="#8B5CF6">
            <Toggle
              label="Mode Gelap"
              desc="Aktifkan tampilan dark mode untuk kenyamanan malam hari"
              value={darkMode}
              onChange={onToggleDark}
            />
            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-foreground text-sm font-medium">Bahasa</p>
                <p className="text-muted-foreground text-xs mt-0.5">Pilih bahasa tampilan aplikasi</p>
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-9 px-3 bg-input-background border border-border rounded-xl text-foreground text-sm focus:outline-none cursor-pointer"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </Section>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Section title="Notifikasi" icon={Bell} color="#F97316">
            <Toggle label="Pengingat Panen" desc="Notifikasi 7 hari sebelum estimasi panen" value={notifHarvest} onChange={setNotifHarvest} />
            <Toggle label="Alert Mortalitas" desc="Notifikasi ketika mortalitas melampaui batas" value={notifMortality} onChange={setNotifMortality} />
            <Toggle label="Jadwal Sampling" desc="Pengingat sampling mingguan rutin" value={notifWeekly} onChange={setNotifWeekly} />
            <Toggle label="Laporan via Email" desc="Kiriman laporan mingguan ke email" value={notifEmail} onChange={setNotifEmail} />
          </Section>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Section title="Keamanan Akun" icon={Shield} color="#10B981">
            <Toggle label="Autentikasi Dua Faktor" desc="Tambahkan lapisan keamanan ekstra" value={twoFactor} onChange={setTwoFactor} />
            <button className="flex items-center justify-between w-full py-3.5 border-b border-border hover:text-primary transition-colors">
              <div>
                <p className="text-foreground text-sm font-medium text-left">Ubah Kata Sandi</p>
                <p className="text-muted-foreground text-xs mt-0.5">Terakhir diubah 3 bulan lalu</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between w-full py-3.5 hover:text-primary transition-colors">
              <div>
                <p className="text-foreground text-sm font-medium text-left">Sesi Aktif</p>
                <p className="text-muted-foreground text-xs mt-0.5">Lihat dan kelola perangkat yang login</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          </Section>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Siklus", value: "14" },
              { label: "Rata-rata SR", value: "91.2%" },
              { label: "Total Panen", value: "18.4 ton" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-4 text-center">
                <p className="text-foreground font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif', color: "#2563EB" }}>{s.value}</p>
                <p className="text-muted-foreground text-[10px] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button className="w-full h-11 rounded-xl border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors">
            Keluar dari Akun
          </button>
        </motion.div>
      </div>
    </div>
  );
}
