import { useState } from "react";
import {
  LayoutDashboard, Fish, BarChart3, History, User, Settings,
  ChevronLeft, ChevronRight, TrendingUp, Moon, Sun, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import aqubizaLogo from "../../imports/WhatsApp_Image_2026-05-21_at_19.27.30.jpeg";

type Screen = "dashboard" | "cultivation" | "harvest" | "analytics" | "history" | "profile" | "settings";

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "cultivation", label: "Budidaya", icon: Fish },
  { id: "harvest", label: "Panen", icon: TrendingUp },
  { id: "analytics", label: "Analisis", icon: BarChart3 },
  { id: "history", label: "Riwayat", icon: History },
  { id: "profile", label: "Profil", icon: User },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

const BOTTOM_NAV: NavItem[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "cultivation", label: "Budidaya", icon: Fish },
  { id: "analytics", label: "Analisis", icon: BarChart3 },
  { id: "history", label: "Riwayat", icon: History },
  { id: "profile", label: "Profil", icon: User },
];

interface LayoutProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  children: React.ReactNode;
}

export function Layout({ activeScreen, onNavigate, darkMode, onToggleDark, children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out relative z-20 flex-shrink-0"
        style={{ width: collapsed ? 72 : 240 }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-primary/20 border border-border bg-white">
            <img src={aqubizaLogo} alt="AQUBIZA" className="w-full h-full object-contain p-0.5" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <span className="text-sidebar-foreground font-semibold text-base whitespace-nowrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  AQUIBIZA
                </span>
                <p className="text-muted-foreground text-[10px] whitespace-nowrap">Aquaculture Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left w-full group relative
                  ${active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={20} className={active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[9px] rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-sidebar-border flex flex-col gap-1">
          <button
            onClick={onToggleDark}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-muted transition-all duration-200 w-full"
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? <Sun size={20} className="text-muted-foreground flex-shrink-0" /> : <Moon size={20} className="text-muted-foreground flex-shrink-0" />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm whitespace-nowrap"
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} className="text-muted-foreground" /> : <ChevronLeft size={12} className="text-muted-foreground" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center h-14 px-4 bg-card border-b border-border gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-primary/20 border border-border bg-white">
            <img src={aqubizaLogo} alt="AQUBIZA" className="w-full h-full object-contain p-0.5" />
          </div>
          <span className="text-foreground font-semibold flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>AQUBIZA</span>
          <button onClick={onToggleDark} className="p-2 rounded-lg hover:bg-muted transition-colors">
            {darkMode ? <Sun size={18} className="text-muted-foreground" /> : <Moon size={18} className="text-muted-foreground" />}
          </button>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu size={18} className="text-muted-foreground" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden flex items-center bg-card border-t border-border px-2 h-16 flex-shrink-0 safe-area-pb">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex-1 flex flex-col items-center gap-1 py-2 relative"
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  />
                )}
                <Icon size={22} className={active ? "text-primary" : "text-muted-foreground"} />
                <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Slide-over Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-sidebar z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
                <span className="font-semibold text-sidebar-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full transition-all
                        ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted"}`}
                    >
                      <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
