export default function AnimateImage({ macro, updateMacro, settings }) {

  const animations = [
    { value: "bounceIn", label: "Bounce In" },
    { value: "kenBurns", label: "Ken Burns" },
    { value: "panLR", label: "Slow L/R Pan" },
    { value: "panRL", label: "Slow R/L Pan" },
  ];

  const updateField = (key, value) => {
    updateMacro({
      ...macro,
      [key]: value,
    });
  };

  // Reads the uploaded file into a base64 data URL and stores it directly
  // in macro.src. Self-contained for now — no upload endpoint needed.
  // Upgrade path: swap this for an actual upload call that saves the file
  // to src/assets/imgs/ and stores the relative path string instead.
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateField("src", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-[#CBE9F2] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#CBE9F2]">
            <h3 className="text-sm font-semibold text-[#2A2118]">
            Animate Image
            </h3>
        </div>

        <div className="p-6 space-y-5">

            {/* Image Source */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Image Source
                </label>

                <div className="flex items-center gap-4">
                    {macro.src && (
                        <img
                            src={macro.src}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-[#CBE9F2]"
                        />
                    )}

                    <label className="flex-1 cursor-pointer">
                        <div className="px-3 py-2 border border-dashed border-[#CBE9F2] rounded-lg text-sm text-[#6B6258] text-center hover:border-[#09ACEC] transition">
                            {macro.src ? "Replace image..." : "Click to upload an image..."}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Image Width */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                        Image Width (px)
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={macro.imgWidth ?? 600}
                        onChange={(e) =>
                            updateField("imgWidth", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
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
                        value={macro.duration ?? 3}
                        onChange={(e) =>
                            updateField("duration", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                    />
                </div>
            </div>

            {/* Animation */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B07D4A] mb-2">
                    Animation
                </label>

                <select
                    value={macro.animation || "bounceIn"}
                    onChange={(e) => updateField("animation", e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBE9F2] rounded-lg text-sm outline-none focus:border-[#09ACEC]"
                >
                    {animations.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    </div>
  );
}