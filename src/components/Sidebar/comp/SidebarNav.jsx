import SidebarItem from "./SidebarItem.jsx";

export default function SidebarNav({
  macros,
  activeMacro,
  setActiveMacro,
}) {
  return (
    <>
      {Object.entries(macros).map(([key, macro]) => {

      return (

        macro?.label && ( 
        <SidebarItem
          key={key}
          label={macro.label}
          active={activeMacro === key}
          onClick={() => setActiveMacro(key)}
        />)
        
      )})}
    </>
  );
}