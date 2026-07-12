export default function DashboardScreen({ macro, updateMacro }) {

  const updateField = (key, value) => {
    updateMacro({
      ...macro,
      [key]: value,
    });
  };

  return (
    <div className="bg-white border border-[#CBE9F2] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#CBE9F2]">
            <h3 className="text-sm font-semibold text-[#2A2118]">
            Dashboard
            </h3>
        </div>

        <div className="p-6 space-y-5">

            <div className="grid grid-cols-2 gap-4">
                {/* Graphic Size */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Graphic Size (%)
                    </label>

                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={macro.graphic_size ?? 30}
                        onChange={(e) => updateField("graphic_size", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>

                {/* Placement X */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Placement (X)
                    </label>

                    <select
                        value={macro.graphic_placement_x ?? "right"}
                        onChange={(e) => updateField("graphic_placement_x", e.target.value)}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>

                {/* Placement Y */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Placement (Y)
                    </label>

                    <select
                        value={macro.graphic_placement_y ?? "top"}
                        onChange={(e) => updateField("graphic_placement_y", e.target.value)}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    >
                        <option value="top">Top</option>
                        <option value="center">Center</option>
                        <option value="bottom">Bottom</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#CBE9F2]">
                {/* Budget */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Budget
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={macro.budget ?? 0}
                        onChange={(e) => updateField("budget", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>

                {/* Spent */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Spent
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={macro.spent ?? 0}
                        onChange={(e) => updateField("spent", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>

                {/* Increment */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Increment
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={macro.increment ?? 0}
                        onChange={(e) => updateField("increment", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>
            </div>

        </div>
    </div>
  );
}
