export default function AnimateText({ macro, updateMacro, settings }) {

  const colorPalette = {
    hotpink: "#F7567C",
    watermelon: "#EE4266",
    skyaqua: "#56CBF9",
    freshsky: "#09ACEC",
    black: "#1A181B",
    beige: "#F2F3D9",
    bronze: "#DC9E82",
  };

  const animations = [
    "none",
    "fadeIn",
    "slideUp",
    "slideDown",
    "slideLeft",
    "slideRight",
    "pop",
    "typewriter",
    "dance"
  ];

  const DEFAULT_LINE_DURATION = 2; // seconds, used when staging a new sequence line

  const updateField = (key, value) => {
    updateMacro({
      ...macro,
      [key]: value,
    });
  };

  const sequence = macro.sequence ?? [];
  const hasSequence = sequence.length > 0;

  const addToSequence = () => {
    const newLine = {
      text: macro.text ?? "",
      duration: macro.duration ?? DEFAULT_LINE_DURATION,
    };
    updateMacro({
      ...macro,
      sequence: [...sequence, newLine],
      text: "", // clear staging field for the next line
      duration: DEFAULT_LINE_DURATION,
    });
  };

  const updateSequenceItem = (index, key, value) => {
    const next = sequence.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    updateField("sequence", next);
  };

  const removeSequenceItem = (index) => {
    const next = sequence.filter((_, i) => i !== index);
    updateMacro({
      ...macro,
      sequence: next.length > 0 ? next : undefined, // drop the key entirely if empty
    });
  };

  const moveSequenceItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sequence.length) return;
    const next = [...sequence];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    updateField("sequence", next);
  };

  const clearSequence = () => {
    updateMacro({
      ...macro,
      sequence: undefined,
    });
  };

  return (
    <div className="bg-white border border-[#CBE9F2] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#CBE9F2]">
            <h3 className="text-sm font-semibold text-[#2A2118]">
            Animate Text
            </h3>
        </div>

        <div className="p-6 space-y-5">

            {/* Text (staging field for single-shot OR the next sequence line) */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    {hasSequence ? "Next Line" : "Text"}
                </label>

                <textarea
                    value={macro.text ?? ""}
                    onChange={(e) => updateField("text", e.target.value)}
                    placeholder={hasSequence ? "Enter the next line of text..." : "Enter text to animate..."}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC] resize-none"
                />

                {hasSequence && (
                    <p className="mt-2 text-xs text-[#6B6258]">
                        A sequence is active — the lines below are what renders. This field only stages the next line to add.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Font */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Font
                    </label>
                    <select
                        value={macro.font || "Belgrano"}
                        onChange={(e) => updateField("font", e.target.value)}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    >
                    <option value="ABeeZee-Regular">ABeeZee</option>
                    <option value="ABeeZee-Italic">ABeeZee Italic</option>
                    <option value="Belgrano-Regular">Belgrano</option>
                    <option value="Gaegu-Regular">Gaegu</option>
                    <option value="Gaegu-Bold">Gaegu Bold</option>
                    <option value="Gaegu-Light">Gaegu Light</option>
                    <option value="GowunDodum-Regular">Gowun Dodum</option>
                    <option value="Inter_18pt-Regular">Inter</option>
                    <option value="Inter_18pt-Thin">Inter Thin</option>
                    <option value="Inter_18pt-ExtraLight">Inter Extra Light</option>
                    <option value="Inter_18pt-ExtraLightItalic">Inter Extra Light Italic</option>
                    <option value="Inter_18pt-Light">Inter Light</option>
                    <option value="Inter_18pt-Medium">Inter Medium</option>
                    <option value="Inter_18pt-ExtraBold">Inter Extra Bold</option>
                    <option value="Inter_18pt-Black">Inter Black</option>
                    <option value="MarkoOne-Regular">Marko One</option>
                    <option value="MochiyPopOne-Regular">Mochiy Pop One</option>
                    <option value="PermanentMarker-Regular">Permanent Marker</option>
                    <option value="Raleway-Thin">Raleway Thin</option>
                    <option value="Raleway-Medium">Raleway Medium</option>
                    <option value="Raleway-SemiBold">Raleway SemiBold</option>
                    <option value="YujiSyuku-Regular">Yuji Syuku</option>
                    </select>
                </div>

                {/* Font Size */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Font Size
                    </label>

                    <input
                        type="number"
                        value={macro.fontSize || 48}
                        onChange={(e) =>
                        updateField("fontSize", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-6">

                {/* Font Color */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Font Color
                    </label>

                    <div className="flex gap-1.5 flex-wrap">
                    {Object.entries(colorPalette).map(([name, color]) => (
                        <button
                        key={`font-${name}`}
                        type="button"
                        onClick={() => updateField("fontColor", color)}
                        className={`w-5 h-5 rounded-full border-2 transition ${
                            macro.fontColor === color
                            ? "border-black"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        title={name}
                        />
                    ))}
                    </div>
                </div>

                {/* Outline Color */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Outline Color
                    </label>

                    <div className="flex gap-1.5 flex-wrap">
                    {/* None option — sets outlineColor to "transparent", matching what
                        the render components check for when deciding to skip the outline. */}
                    <button
                        type="button"
                        onClick={() => updateField("outlineColor", "transparent")}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        !macro.outlineColor || macro.outlineColor === "transparent"
                            ? "border-black"
                            : "border-[#CBE9F2]"
                        }`}
                        style={{
                        backgroundImage:
                            "linear-gradient(45deg, transparent 45%, #E2564F 45%, #E2564F 55%, transparent 55%)",
                        backgroundColor: "#fff",
                        }}
                        title="None"
                    />

                    {Object.entries(colorPalette).map(([name, color]) => (
                        <button
                        key={`outline-${name}`}
                        type="button"
                        onClick={() => updateField("outlineColor", color)}
                        className={`w-5 h-5 rounded-full border-2 transition ${
                            macro.outlineColor === color
                            ? "border-black"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        title={name}
                        />
                    ))}
                    </div>
                </div>
            </div>
            {/* X/Y Position */}
            <div className="grid grid-cols-2 gap-4">
                {/* X Position */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    X Position
                    </label>

                    <select
                        value={macro.xPosition || "center"}
                        onChange={(e) => updateField("xPosition", e.target.value)}
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="custom">Custom</option>
                    </select>

                    {macro.xPosition === "custom" && (
                    <div className="mt-3">
                        <label className="block text-xs text-[#6B6258] mb-1">
                        Custom X Position (%)
                        </label>

                        <input
                        type="number"
                        min="0"
                        max="100"
                        value={macro.customX ?? 50}
                        onChange={(e) =>
                            updateField("customX", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                        />
                    </div>
                    )}
                </div>

                {/* Y Position */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Y Position
                    </label>

                    <select
                    value={macro.yPosition || "center"}
                    onChange={(e) => updateField("yPosition", e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    >
                    <option value="top">Top</option>
                    <option value="center">Center</option>
                    <option value="bottom">Bottom</option>
                    <option value="custom">Custom</option>
                    </select>

                    {macro.yPosition === "custom" && (
                    <div className="mt-3">
                        <label className="block text-xs text-[#6B6258] mb-1">
                        Custom Y Position (%)
                        </label>

                        <input
                        type="number"
                        min="0"
                        max="100"
                        value={macro.customY ?? 50}
                        onChange={(e) =>
                            updateField("customY", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                        />
                    </div>
                    )}
                </div>

            </div>
            {/* FINAL ROW */}
            <div className="grid grid-cols-2 gap-4">
                {/* Animation */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Animation
                    </label>

                    <select
                        value={macro.animation || "none"}
                        onChange={(e) =>
                        updateField("animation", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    >
                        {animations.map((animation) => (
                        <option key={animation} value={animation}>
                            {animation}
                        </option>
                        ))}
                    </select>
                </div>
                {/* Duration */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        {hasSequence ? "Next Line Duration (seconds)" : "Duration (seconds)"}
                    </label>

                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={macro.duration ?? 5}
                        onChange={(e) =>
                            updateField("duration", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>
            </div>

            {/* Sequence controls */}
            <div className="pt-2 border-t border-[#CBE9F2]">
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A]">
                        Sequence
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={addToSequence}
                            disabled={!macro.text}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#09ACEC] text-[#09ACEC] hover:bg-[#09ACEC] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#09ACEC]"
                        >
                            + Add to Sequence
                        </button>
                        {hasSequence && (
                            <button
                                type="button"
                                onClick={clearSequence}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E2564F] text-[#E2564F] hover:bg-[#E2564F] hover:text-white transition"
                            >
                                Clear Sequence
                            </button>
                        )}
                    </div>
                </div>

                {hasSequence ? (
                    <div className="space-y-2">
                        {sequence.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 border border-[#CBE9F2] rounded-lg p-2"
                            >
                                <span className="text-xs text-[#B07D4A] font-semibold w-5 text-center">
                                    {index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => updateSequenceItem(index, "text", e.target.value)}
                                    className="flex-1 px-2 py-1.5 border border-[#CBE9F2] rounded-md text-sm outline-none focus:border-[#09ACEC]"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={item.duration}
                                    onChange={(e) =>
                                        updateSequenceItem(index, "duration", Number(e.target.value))
                                    }
                                    className="w-16 px-2 py-1.5 border border-[#CBE9F2] rounded-md text-sm outline-none focus:border-[#09ACEC]"
                                    title="Duration (seconds)"
                                />
                                <button
                                    type="button"
                                    onClick={() => moveSequenceItem(index, -1)}
                                    disabled={index === 0}
                                    className="w-6 h-6 flex items-center justify-center text-[#B07D4A] disabled:opacity-30"
                                    title="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveSequenceItem(index, 1)}
                                    disabled={index === sequence.length - 1}
                                    className="w-6 h-6 flex items-center justify-center text-[#B07D4A] disabled:opacity-30"
                                    title="Move down"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeSequenceItem(index)}
                                    className="w-6 h-6 flex items-center justify-center text-[#E2564F]"
                                    title="Remove line"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-[#6B6258]">
                        No sequence yet — this macro will render as a single block of text using the Text/Duration fields above.
                    </p>
                )}
            </div>
        </div>
    </div>
  
  );
}