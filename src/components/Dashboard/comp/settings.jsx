import { useState, useEffect } from "react";

export default function Settings({
  settings,
  updateSettings,
}) {
  const [isActive, setIsActive] = useState(false);
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateField = (section, field, value) => {
    setForm((current) => ({
        ...current,
        [section]: {
        ...current[section],
        [field]: value,
        },
    }));
  };

  const save = () => {
    updateSettings(form);
    setIsActive(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsActive(true)}
        style={{
          width: "24px",
          height: "24px",
          cursor: "pointer",
        }}
      >
                <svg 
                    style={{objectFit:"contain"}}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512"
                    fill="#F7567C"
                >
                    <path d="M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"/>
                </svg>
      </button>

    {isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="px-5 py-3 border-b border-[#56CBF9] flex items-center justify-between">
                <div>
                <h2 className="text-lg font-semibold text-[#1A181B]">
                    Project Settings
                </h2>

                <p className="text-xs text-[#1A181B]/60">
                    {form.video.width} × {form.video.height}
                    {" • "}
                    {form.video.fps}fps
                    {" • "}
                    {form.render.codec.toUpperCase()}
                </p>
                </div>

                <button
                onClick={() => setIsActive(false)}
                className="text-[#EE4266] hover:text-[#F7567C]"
                >
                ✕
                </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">

                {/* Video */}
                <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#09ACEC] mb-2">
                    Video
                </h3>

                <div className="grid grid-cols-3 gap-3">

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Resolution
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={`${form.video.width}x${form.video.height}`}
                        onChange={(e) => {
                            const [width, height] = e.target.value.split("x");

                            setForm((current) => ({
                            ...current,
                            video: {
                                ...current.video,
                                width: Number(width),
                                height: Number(height),
                            },
                            }));
                        }}
                    >
                        <option value="1920x1080">1920 × 1080 (1080HD)</option>
                        <option value="1280x720">1280 × 720 (720HD)</option>
                        <option value="2560x1440">2560 × 1440 (QHD)</option>
                        <option value="3840x2160">3840 × 2160 (4K)</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Frame Rate
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={form.video.fps}
                        onChange={(e) =>
                            updateField(
                            "video",
                            "fps",
                            Number(e.target.value)
                            )
                        }
                    >
                        <option value={24}>24 FPS</option>
                        <option value={30}>30 FPS</option>
                        <option value={60}>60 FPS</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Aspect Ratio
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={form.video.pixelAspectRatio}
                    >
                        <option value={1}>Square Pixels</option>
                    </select>
                    </div>

                </div>
                </section>

                {/* Audio */}
                <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#09ACEC] mb-2">
                    Audio
                </h3>

                <div className="grid grid-cols-2 gap-3">

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Sample Rate
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={form.audio.sampleRate}
                        onChange={(e) =>
                            updateField(
                            "audio",
                            "sampleRate",
                            Number(e.target.value)
                            )
                        }
                    >
                        <option value={44100}>44.1 kHz</option>
                        <option value={48000}>48 kHz</option>
                        <option value={96000}>96 kHz</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Channels
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={form.audio.channels}
                        onChange={(e) => updateField(
                            "audio", "channels", Number(e.target.value)
                        )}  
                    >
                        <option value={1}>Mono</option>
                        <option value={2}>Stereo</option>
                    </select>
                    </div>

                </div>
                </section>

                {/* Render */}
                <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#09ACEC] mb-2">
                    Render
                </h3>

                <div className="grid grid-cols-2 gap-3">

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Codec
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={form.render.codec}
                        onChange={(e)=> updateField(
                            "render", "codec", e.target.value
                        )}
                    >
                        <option value="h264">H.264</option>
                        <option value="h265">H.265 / HEVC</option>
                        <option value="vp9">VP9</option>
                        <option value="prores">ProRes</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-xs mb-1 text-[#1A181B]">
                        Quality (CRF)
                    </label>

                    <select
                        className="w-full border border-[#56CBF9] rounded-lg px-3 py-1.5 text-sm"
                        value={form.render.crf}
                        onChange={(e)=> updateField(
                            "render", "crf", Number(e.target.value)
                        )}
                    >
                        <option value={18}>18 · High Quality</option>
                        <option value={23}>23 · Balanced</option>
                        <option value={28}>28 · Small File</option>
                    </select>
                    </div>

                </div>
                </section>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#56CBF9] flex justify-end gap-2">
                <button
                onClick={() => {
                    setForm(settings);
                    setIsActive(false);
                }}
                className="px-3 py-1.5 text-sm rounded-lg border border-[#56CBF9] text-[#1A181B]"
                >
                Cancel
                </button>

                <button
                onClick={save}
                className="px-3 py-1.5 text-sm rounded-lg bg-[#F7567C] text-white hover:bg-[#EE4266]"
                >
                Save Settings
                </button>
            </div>

            </div>
        </div>
        )}
    </>
  );
}
