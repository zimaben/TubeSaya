// schema allows more later — both entries today are the same Whiteboard/Permanent-Marker
// look, differing only in whether the torn-paper background wraps each checkbox individually
// or the whole list as one card (see Checklist.jsx composition)
const STYLES = ["Whiteboard (boxes only)", "Whiteboard (full background)"];

// Same palette/swatch pattern as AnimateText's Font Color / Outline Color.
const colorPalette = {
  hotpink: "#F7567C",
  watermelon: "#EE4266",
  skyaqua: "#56CBF9",
  freshsky: "#09ACEC",
  black: "#1A181B",
  beige: "#F2F3D9",
  bronze: "#DC9E82",
  white: "#FFFFFF",
};

function ColorSwatches({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
        {label}
      </label>
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(colorPalette).map(([name, color]) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(color)}
            className={`w-5 h-5 rounded-full border-2 transition ${
              value === color
                ? "border-black"
                : color === "#FFFFFF"
                ? "border-[#CBE9F2]"
                : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            title={name}
          />
        ))}
      </div>
    </div>
  );
}

export default function Checklist({ macro, updateMacro }) {

  const updateField = (key, value) => {
    updateMacro({
      ...macro,
      [key]: value,
    });
  };

  const items = macro.checklistItems ?? [];
  const hasItems = items.length > 0;

  const addItem = () => {
    const text = (macro.checklistText ?? "").trim();
    if (!text) return;
    updateMacro({
      ...macro,
      checklistItems: [...items, { text, checked: false, animate: false }],
      checklistText: "",
    });
  };

  const updateItem = (index, key, value) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    updateField("checklistItems", next);
  };

  const removeItem = (index) => {
    const next = items.filter((_, i) => i !== index);
    updateField("checklistItems", next.length > 0 ? next : undefined); // drop the key entirely if empty
  };

  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    updateField("checklistItems", next);
  };

  return (
    <>
        <div className="grid grid-cols-2 gap-4">
            {/* Position */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Position
                </label>

                <select
                    value={macro.checklistPosition ?? "left"}
                    onChange={(e) => updateField("checklistPosition", e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                </select>
            </div>

            {/* Style */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Style
                </label>

                <select
                    value={macro.checklistStyle ?? STYLES[0]}
                    onChange={(e) => updateField("checklistStyle", e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                >
                    {STYLES.map((style) => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Font Size — also drives the checkbox/checkmark size (see Checklist.jsx composition's BOX_SIZE_RATIO) */}
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                Font Size ({macro.checklistFontSize ?? 44}px)
            </label>

            <input
                type="range"
                min="20"
                max="100"
                value={macro.checklistFontSize ?? 44}
                onChange={(e) => updateField("checklistFontSize", Number(e.target.value))}
                className="w-full"
            />
        </div>

        {/* Colors — same swatch pattern as AnimateText's Font/Outline Color */}
        <div className="grid grid-cols-3 gap-6">
            <ColorSwatches
                label="Box Color"
                value={macro.checklistBoxColor}
                onChange={(color) => updateField("checklistBoxColor", color)}
            />
            <ColorSwatches
                label="Check Color"
                value={macro.checklistCheckColor}
                onChange={(color) => updateField("checklistCheckColor", color)}
            />
            <ColorSwatches
                label="Text Color"
                value={macro.checklistTextColor}
                onChange={(color) => updateField("checklistTextColor", color)}
            />
        </div>

        {/* Staging field + Add, same pattern as AnimateText's sequence */}
        <div className="pt-2 border-t border-[#CBE9F2]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                Add Item
            </label>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={macro.checklistText ?? ""}
                    onChange={(e) => updateField("checklistText", e.target.value)}
                    placeholder="Enter checklist item text..."
                    className="flex-1 px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                />
                <button
                    type="button"
                    onClick={addItem}
                    disabled={!macro.checklistText}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#09ACEC] text-[#09ACEC] hover:bg-[#09ACEC] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#09ACEC]"
                >
                    + Add
                </button>
            </div>
        </div>

        {/* Items */}
        <div className="pt-2 border-t border-[#CBE9F2]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-3">
                Items
            </label>

            {hasItems ? (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 border border-[#CBE9F2] rounded-lg p-2"
                        >
                            <label className="flex items-center gap-1 text-xs text-[#6B6258]" title="Checked">
                                <input
                                    type="checkbox"
                                    checked={item.checked ?? false}
                                    onChange={(e) => updateItem(index, "checked", e.target.checked)}
                                />
                                Checked
                            </label>
                            <label className="flex items-center gap-1 text-xs text-[#6B6258]" title="Plays the checked-off draw-on animation">
                                <input
                                    type="checkbox"
                                    checked={item.animate ?? false}
                                    onChange={(e) => updateItem(index, "animate", e.target.checked)}
                                />
                                Animate
                            </label>
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updateItem(index, "text", e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-[#CBE9F2] rounded-md text-sm outline-none focus:border-[#09ACEC]"
                            />
                            <button
                                type="button"
                                onClick={() => moveItem(index, -1)}
                                disabled={index === 0}
                                className="w-6 h-6 flex items-center justify-center text-[#B07D4A] disabled:opacity-30"
                                title="Move up"
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                onClick={() => moveItem(index, 1)}
                                disabled={index === items.length - 1}
                                className="w-6 h-6 flex items-center justify-center text-[#B07D4A] disabled:opacity-30"
                                title="Move down"
                            >
                                ↓
                            </button>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="w-6 h-6 flex items-center justify-center text-[#E2564F]"
                                title="Remove item"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-[#6B6258]">
                    No items yet — add one above.
                </p>
            )}
        </div>
    </>
  );
}
