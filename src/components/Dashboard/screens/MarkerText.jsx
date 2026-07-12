export default function MarkerText({ macro, updateMacro }) {

  const colorPalette = {
    hotpink: "#F7567C",
    watermelon: "#EE4266",
    skyaqua: "#56CBF9",
    freshsky: "#09ACEC",
    black: "#1A181B",
    beige: "#F2F3D9",
    bronze: "#DC9E82",
  };

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
            Marker Text
            </h3>
        </div>

        <div className="p-6 space-y-5">

            {/* Text */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Text
                </label>

                <textarea
                    value={macro.text ?? ""}
                    onChange={(e) => updateField("text", e.target.value)}
                    placeholder="Enter text to circle and write in..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC] resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Font Size */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Font Size
                    </label>

                    <input
                        type="number"
                        value={macro.fontSize ?? 120}
                        onChange={(e) => updateField("fontSize", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>

                {/* Skew */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Skew (deg)
                    </label>

                    <input
                        type="number"
                        value={macro.skew ?? -6}
                        onChange={(e) => updateField("skew", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>
            </div>

            {/* Color — drives both the circle and the text */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Color
                </label>

                <div className="flex gap-1.5 flex-wrap">
                {Object.entries(colorPalette).map(([name, color]) => (
                    <button
                    key={name}
                    type="button"
                    onClick={() => updateField("color", color)}
                    className={`w-5 h-5 rounded-full border-2 transition ${
                        macro.color === color ? "border-black" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                    />
                ))}
                </div>
            </div>

            {/* Duration */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Duration (seconds)
                </label>

                <input
                    type="number"
                    min="1"
                    max="100"
                    value={macro.duration ?? 4}
                    onChange={(e) => updateField("duration", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                />
            </div>

            {/* Circle controls */}
            <div className="pt-2 border-t border-[#CBE9F2]">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-3">
                    Circle
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[#6B6258] mb-1">
                            Draw Duration (seconds)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={macro.circleDuration ?? 1.2}
                            onChange={(e) => updateField("circleDuration", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-[#6B6258] mb-1">
                            Size (fraction of frame)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.05"
                            max="1"
                            value={macro.circleSize ?? 0.38}
                            onChange={(e) => updateField("circleSize", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-[#6B6258] mb-1">
                            Top (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={macro.circleTop ?? 58}
                            onChange={(e) => updateField("circleTop", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-[#6B6258] mb-1">
                            Left (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={macro.circleLeft ?? 50}
                            onChange={(e) => updateField("circleLeft", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
