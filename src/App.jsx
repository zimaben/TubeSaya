import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AppTray from "./components/AppTray/AppTray.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [activeMacro, setActiveMacro] = useState(null);

  const colorPalette = {
    "hotpink": "#F7567C",
    "watermelon":"#EE4266",
    "skyaqua" : "#56CBF9",
    "freshsky": "#09ACEC",
    "black": "#1A181B",
    "beige": "#F2F3D9",
    "bronze": "#DC9E82"
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("http://localhost:3001/app");

        if (!response.ok) {
          throw new Error("Failed to load data");
        }

        const json = await response.json();
        setData(json);

        setActiveMacro(
          json.lastOpenMacro || "DashboardScreen"
        );

      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

    useEffect(() => {
    if (!data) return;
    const saveData = async () => {
      await fetch("http://localhost:3001/app", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    };
    saveData();
  }, [data]);

  const updateSettings = (settings) => {
    setData((current) => ({
      ...current,
      settings,
    }));
  };

  const updateMacro = (macroName, macroData) => {
    setData((current) => ({
      ...current,
      installedMacros: {
        ...current.installedMacros,
        [macroName]: {
          ...current.installedMacros[macroName],
          macro: macroData,
        },
      },
    }));
  };
  const changeActiveMacro = (macroName) => {
    setActiveMacro(macroName);

    setData((current) => ({
      ...current,
      lastOpenMacro: macroName,
    }));
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    const saveData = async () => {
      try {
        await fetch("http://localhost:3001/app", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error(error);
      }
    };

    saveData();
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-3rem)] bg-[#B8E2F2] rounded-3xl shadow-xl overflow-hidden flex gap-4 p-4">
      <Sidebar
        macros={data.installedMacros}
        activeMacro={activeMacro}
        setActiveMacro={changeActiveMacro}
      />

      <Dashboard
        activeMacro={activeMacro}
        settings={data.settings}
        macro={data.installedMacros[activeMacro]?.macro}
        updateSettings={updateSettings}
        updateMacro={updateMacro}
      />

      <AppTray />
    </div>
  );
}