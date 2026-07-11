
import DashboardHeader from "./comp/dashheader";
import AnimateImage from "./screens/AnimateImage";
import AnimateMap from "./screens/AnimateMap";
import AnimateText from "./screens/AnimateText";
import DashboardScreen from "./screens/DashboardScreen";
import SyncText from "./screens/SyncText";
import VFX from "./screens/VFX";



export default function Dashboard({ activeMacro, settings, macro, updateSettings, updateMacro }){

  const routeActiveScreen = () => {
    switch(activeMacro){
      case "AnimateText" : return <AnimateText macro={macro} updateMacro={(newMacro) => updateMacro(activeMacro, newMacro) } settings={settings} />
      case "AnimateImage" : return <AnimateImage macro={macro} updateMacro={(newMacro) => updateMacro(activeMacro, newMacro) } />
      case "AnimateMap" : return <AnimateMap macro={macro} updateMacro={(newMacro) => updateMacro(activeMacro, newMacro) } />
      case "Dashboard" : return <DashboardScreen macro={macro} updateMacro={(newMacro) => updateMacro(activeMacro, newMacro) } />
      case "VFX" : return <VFX macro={macro} updateMacro={(newMacro) => updateMacro(activeMacro, newMacro) } />
      case "SyncText" : return <SyncText macro={macro} updateMacro={(newMacro) => updateMacro(activeMacro, newMacro) } />
      default : return null;
    }
  }
  return (
    <div className="flex-1 bg-white rounded-2xl flex flex-col overflow-hidden border border-[#E8E3DC]">
      <DashboardHeader
        activeDash={activeMacro}
        settings={settings}
        updateSettings={updateSettings}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {routeActiveScreen()}
      </div>
    </div>
  );
}