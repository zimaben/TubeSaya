// SidebarItem.jsx
export default function SidebarItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
        ${active
          ? "bg-[#F5E0E5]/60 font-medium text-[#1E1E24]"
          : "hover:bg-[#F5E0E5]/40 text-[#2E2E38]"}`}
    >
      <div
        className={`w-4 h-4 rounded ${
          active ? "bg-[#4A7A47]/40" : "bg-[#4A7A47]/30"
        }`}
      ></div>
      <span className="text-sm">{label}</span>
    </div>
  );
}



// export default function SidebarItem({ label, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F5E0E5]/40 cursor-pointer"
//     >
//       <div className="w-4 h-4 rounded bg-[#4A7A47]/30"></div>
//       <span className="text-sm text-[#2E2E38]">{label}</span>
//     </div>
//   );
// }