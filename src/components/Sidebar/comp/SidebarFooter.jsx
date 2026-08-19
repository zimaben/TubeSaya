import { useState, lazy, Suspense } from "react";

const PreviewPlayer = lazy(() => import("./PreviewPlayer"));

export default function SidebarFooter({ activeMacro, macros, settings, updateMacro }) {
    const rawMacro = macros?.[activeMacro]?.macro;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [renderStatus, setRenderStatus] = useState("idle"); // idle | rendering | done | error
    const [renderError, setRenderError] = useState(null); // throwaway: full last error message, for debugging only
    const [renderOutput, setRenderOutput] = useState(null); // resolved output path from the last successful render
    const [filename, setFilename] = useState(activeMacro);

    const openPreview = () => {
        setFilename(activeMacro); // fresh, predictable default every time the modal opens
        setRenderStatus("idle");
        setRenderError(null);
        setRenderOutput(null);
        setPreviewOpen(true);
    };

    const handleRender = async () => {
        setRenderStatus("rendering");
        setRenderError(null);
        try {
            const res = await fetch("http://localhost:3001/render", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `HTTP ${res.status}`);
            }
            const body = await res.json();
            setRenderOutput(body.output);
            setRenderStatus("done");
        } catch (err) {
            console.error("Render failed:", err);
            setRenderStatus("error");
            setRenderError(err.message);
        }
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setRenderStatus("idle");
        setRenderError(null);
    };

    return(
        <div className="p-4 border-t border-[#F5E0E5] flex justify-center">
            <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-[#17BEBB] rounded-md hover:bg-[#17BEBB]/10 transition-colors cursor-pointer"
                onClick={openPreview}
            >

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            className="w-6 h-6 fill-[#EF3E36] flex-shrink-0"
                        ><path d="M64 48l112 0 0 88c0 39.8 32.2 72 72 72l88 0 0 240c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16zM224 67.9l92.1 92.1-68.1 0c-13.3 0-24-10.7-24-24l0-68.1zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-261.5c0-17-6.7-33.3-18.7-45.3L242.7 18.7C230.7 6.7 214.5 0 197.5 0L64 0zM80 288l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-24 35 35c3.2 3.2 7.5 5 12 5 9.4 0 17-7.6 17-17l0-94.1c0-9.4-7.6-17-17-17-4.5 0-8.8 1.8-12 5l-35 35 0-24c0-17.7-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32z"/></svg>

                    <span className="text-[#EF3E36]">Render</span>

            </button>

            {previewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="px-5 py-3 border-b border-[#56CBF9] flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1A181B]">Preview</h2>
                            <button
                                type="button"
                                onClick={closePreview}
                                className="text-[#EF3E36] hover:text-[#F7567C]"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="px-5 py-3 border-b border-[#56CBF9] flex items-center gap-3">
                            <label htmlFor="render-filename" className="text-sm text-[#1A181B]/70 whitespace-nowrap">
                                File name
                            </label>
                            <input
                                id="render-filename"
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                disabled={renderStatus === "rendering"}
                                placeholder={activeMacro}
                                className="flex-1 min-w-0 px-2 py-1 text-sm border border-[#F5E0E5] rounded-md focus:outline-none focus:border-[#17BEBB] disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={handleRender}
                                disabled={renderStatus === "rendering"}
                                className="px-3 py-1 text-sm border border-[#17BEBB] rounded-md text-[#17BEBB] hover:bg-[#17BEBB]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                            >
                                {renderStatus === "rendering" ? "Rendering…" : "Render Video"}
                            </button>
                        </div>

                        {renderStatus === "done" && renderOutput && (
                            <div className="px-5 pt-2 text-sm text-[#17BEBB]">Rendered to {renderOutput}</div>
                        )}

                        {renderStatus === "error" && renderError && (
                            <pre className="mx-5 mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-md border border-[#EF3E36]/40 bg-[#EF3E36]/5 p-2 text-xs text-[#EF3E36]">
                                {renderError}
                            </pre>
                        )}

                        <Suspense
                            fallback={
                                <div className="flex-1 flex items-center justify-center text-sm text-[#1A181B]/50">
                                    Loading preview…
                                </div>
                            }
                        >
                            <PreviewPlayer activeMacro={activeMacro} rawMacro={rawMacro} settings={settings} updateMacro={updateMacro} />
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
}