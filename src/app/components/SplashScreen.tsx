import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import aqubizaLogo from "../../imports/WhatsApp_Image_2026-05-21_at_19.27.30.jpeg";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 3200;

    const raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      if (pct < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onFinish, 600);
        }, 300);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={() => { setVisible(false); setTimeout(onFinish, 600); }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
          style={{
            background: "linear-gradient(145deg, #0B1F4A 0%, #0F2D6B 40%, #1E3A7A 70%, #0A4B6E 100%)",
          }}
        >
          {/* Background decorative circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #0EA5E9, transparent)" }} />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #2563EB, transparent)" }} />
            <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-5"
              style={{ background: "radial-gradient(circle, #10B981, transparent)" }} />

            {/* Animated water ripple lines */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-white/5"
                initial={{ width: 100, height: 100, opacity: 0.3 }}
                animate={{ width: 800, height: 800, opacity: 0 }}
                transition={{ duration: 4, delay: i * 1.3, repeat: Infinity, ease: "easeOut" }}
                style={{ bottom: "-200px" }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center px-8 max-w-sm text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
                  style={{ background: "linear-gradient(135deg, #2563EB, #0EA5E9)" }} />
                <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  style={{ background: "rgba(255,255,255,0.95)" }}>
                  <img
                    src={aqubizaLogo}
                    alt="AQUBIZA Logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            </motion.div>

            {/* App name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-white text-4xl tracking-tight mb-1"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}>
                AQU<span style={{ color: "#4ADE80" }}>BIZA</span>
              </h1>
              <p className="text-blue-200/80 text-xs tracking-widest uppercase font-medium mb-6">
                Aquaculture Bioeconomic by Riza
              </p>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-10"
            >
              <div className="h-px w-12 mx-auto mb-5 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #0EA5E9, transparent)" }} />
              <p className="text-blue-100/75 text-sm leading-relaxed">
                Aplikasi inovatif berbasis <span className="text-blue-200 font-medium">bioekonomi perikanan budidaya</span> yang
                dirancang untuk membantu pelaku akuakultur dalam menganalisis aspek biologis, teknis, dan ekonomi usaha budidaya
                secara terintegrasi.
              </p>
              <p className="text-blue-100/60 text-xs leading-relaxed mt-3">
                Mendukung pengambilan keputusan melalui perhitungan biaya produksi, keuntungan usaha, efisiensi pakan,
                produktivitas budidaya, hingga analisis kelayakan usaha secara digital dan praktis.
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full"
            >
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #2563EB, #0EA5E9, #10B981)",
                    transition: "width 0.05s linear",
                  }}
                />
              </div>
              <p className="text-blue-200/40 text-[10px]">Ketuk untuk lewati</p>
            </motion.div>
          </div>

          {/* Bottom badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 text-blue-200/30 text-[10px] tracking-wide"
          >
            v1.0 · Aquaculture Bioeconomic Platform
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
