import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { HarvestAnalysis } from "./components/HarvestAnalysis";
import { Cultivation } from "./components/Cultivation";
import { Analytics } from "./components/Analytics";
import { History } from "./components/History";
import { Profile } from "./components/Profile";
import { SplashScreen } from "./components/SplashScreen";

type Screen = "dashboard" | "cultivation" | "harvest" | "analytics" | "history" | "profile" | "settings";

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function toggleDark() { setDarkMode((d) => !d); }

  function renderScreen() {
    switch (screen) {
      case "dashboard":   return <Dashboard onNavigate={(s) => setScreen(s as Screen)} />;
      case "cultivation": return <Cultivation />;
      case "harvest":     return <HarvestAnalysis />;
      case "analytics":   return <Analytics />;
      case "history":     return <History />;
      case "profile":
      case "settings":    return <Profile onToggleDark={toggleDark} darkMode={darkMode} />;
      default:            return <Dashboard onNavigate={(s) => setScreen(s as Screen)} />;
    }
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Layout
        activeScreen={screen}
        onNavigate={(s) => setScreen(s as Screen)}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      >
        {renderScreen()}
      </Layout>
    </>
  );
}
