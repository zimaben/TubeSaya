import logo from "../../assets/imgs/logo.png";
import SidebarNav from "./comp/SidebarNav";
import SidebarFooter from "./comp/SidebarFooter";

export default function Sidebar({
  macros,
  activeMacro,
  setActiveMacro,
}) {
  return (
    <div className="w-56 flex-shrink-0 bg-[#FFFFFF] rounded-2xl flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[#F5E0E5]">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto object-contain"
          />
        </div>

        <h2 className="mt-1 text-[15px] font-semibold text-[#1E1E24]">
          Presets
        </h2>
      </div>

      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarNav
            macros={macros}
            activeMacro={activeMacro}
            setActiveMacro={setActiveMacro}
        />
      </div>

      <SidebarFooter />
    </div>
  );
}