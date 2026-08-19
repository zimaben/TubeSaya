export default function MarkerText({ macro, updateMacro, settings }) {
  const { width: videoWidth, height: videoHeight } = settings?.video ?? {};

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

  const handleBgFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousBgSrc = macro.bgSrc;
    if (previousBgSrc) updateField("bgSrc", "");

    const formData = new FormData();
    formData.append("folder", "markertext");
    formData.append("image", file);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.error || "Upload failed");
      return;
    }

    updateField("bgSrc", result.src);

    if (previousBgSrc && !previousBgSrc.startsWith("data:")) {
      const filename = previousBgSrc.replace(/^uploads\//, "");
      fetch(`http://localhost:3001/upload/${filename}`, { method: "DELETE" }).catch(() => {});
    }
  };

  const handleBgClear = () => {
    const previousBgSrc = macro.bgSrc;
    if (!previousBgSrc) return;

    updateField("bgSrc", "");

    if (!previousBgSrc.startsWith("data:")) {
      const filename = previousBgSrc.replace(/^uploads\//, "");
      fetch(`http://localhost:3001/upload/${filename}`, { method: "DELETE" }).catch(() => {});
    }
  };

  return (
    <div className="bg-white border border-[#CBE9F2] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#CBE9F2]">
            <h3 className="text-sm font-semibold text-[#2A2118]">
            Marker Text
            </h3>
        </div>

        <div className="p-6 space-y-5">

            {/* Background reference photo (preview only, never rendered) */}
            <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B07D4A] cursor-pointer">
                    <input
                        type="checkbox"
                        checked={macro.useRefPhoto ?? false}
                        onChange={(e) => updateField("useRefPhoto", e.target.checked)}
                    />
                    Use reference photo?
                </label>

                {macro.useRefPhoto && (
                    <div className="mt-2">
                        {videoWidth && videoHeight && (
                            <p className="text-xs text-[#6B6258] mb-1">
                                For accurate placement, use a photo that matches the video's dimensions ({videoWidth}×{videoHeight}px).
                            </p>
                        )}
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                            Placement Reference Photo (preview only)
                        </label>

                        <div className="flex items-center gap-4">
                            {macro.bgSrc && (
                                <img
                                    src={macro.bgSrc}
                                    alt="Preview"
                                    className="w-16 h-16 object-cover rounded-lg border border-[#CBE9F2]"
                                />
                            )}

                            <label className="flex-1 cursor-pointer">
                                <div className="px-3 py-2 border border-dashed border-[#CBE9F2] rounded-lg text-sm text-[#6B6258] text-center hover:border-[#09ACEC] transition">
                                    {macro.bgSrc ? "Replace photo..." : "Click to upload a reference photo..."}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBgFileChange}
                                    className="hidden"
                                />
                            </label>

                            {macro.bgSrc && (
                                <button
                                    type="button"
                                    onClick={handleBgClear}
                                    className="px-3 py-2 text-sm text-[#B07D4A] hover:text-[#EE4266] transition"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

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

            {/* Text Position */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Text Position
                </label>

                <select
                    value={macro.textPosition ?? "above"}
                    onChange={(e) => updateField("textPosition", e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                </select>
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

            {/* SFX */}
            <div className="pt-2 border-t border-[#CBE9F2]">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B07D4A] cursor-pointer">
                    <input
                        type="checkbox"
                        checked={macro.includeSfx ?? false}
                        onChange={(e) => updateField("includeSfx", e.target.checked)}
                    />
                    Include SFX?
                </label>

                {macro.includeSfx && (
                    <div className="mt-3 space-y-2">
                        <label className="flex items-center gap-2 text-sm text-[#6B6258] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={macro.sfxMarkerSounds ?? false}
                                onChange={(e) => updateField("sfxMarkerSounds", e.target.checked)}
                            />
                            Marker Sounds
                        </label>

                        <label className="flex items-center gap-2 text-sm text-[#6B6258] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={macro.sfxDing ?? false}
                                onChange={(e) => updateField("sfxDing", e.target.checked)}
                            />
                            Ding
                        </label>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
