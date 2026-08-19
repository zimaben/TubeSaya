import { useRef, useState } from "react";
import { Player } from "@remotion/player";
import { COMPONENT_MAP, resolveProps, getDurationInFrames } from "../../../../remotion/resolveComposition";

const clampPercent = (value) => Math.min(100, Math.max(0, value));

export default function PreviewPlayer({ activeMacro, rawMacro, settings, updateMacro }) {
    const ActiveComponent = COMPONENT_MAP[activeMacro];
    const containerRef = useRef(null);
    // % position while actively dragging the circle handle; null when not dragging
    // (falls back to the macro's own circleTop/circleLeft).
    const [dragPos, setDragPos] = useState(null);

    if (!ActiveComponent) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-[#1A181B]/50">
                No preview available for this macro yet.
            </div>
        );
    }

    const { width, height, fps } = settings.video;
    const props = resolveProps(rawMacro);

    // Only MarkerText's circle has a draggable position today — its
    // top/left contract (% of video, anchored at center) matches MarkerCircle.jsx.
    const isDraggableCircle = activeMacro === "MarkerText";
    const circleTop = dragPos?.top ?? props.circleTop ?? 58;
    const circleLeft = dragPos?.left ?? props.circleLeft ?? 50;

    const handlePointerMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        setDragPos({
            left: clampPercent(((e.clientX - rect.left) / rect.width) * 100),
            top: clampPercent(((e.clientY - rect.top) / rect.height) * 100),
        });
    };

    const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        setDragPos((current) => {
            if (current) {
                updateMacro(activeMacro, { ...rawMacro, circleTop: current.top, circleLeft: current.left });
            }
            return null;
        });
    };

    const handlePointerDown = (e) => {
        e.preventDefault();
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    return (
        <div className="player-container flex-1 min-h-0 flex items-center justify-center">
            <div
                ref={containerRef}
                style={{ position: "relative", width: "100%", maxHeight: "100%", aspectRatio: `${width} / ${height}` }}
            >
                <Player
                    component={ActiveComponent}
                    inputProps={isDraggableCircle ? { ...props, circleTop, circleLeft } : props}
                    durationInFrames={getDurationInFrames(activeMacro, rawMacro, fps)}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={fps}
                    controls
                    loop
                    autoPlay
                    style={{ width: "100%", height: "100%" }}
                />

                {isDraggableCircle && (
                    <div
                        onPointerDown={handlePointerDown}
                        title="Drag to reposition the circle"
                        style={{
                            position: "absolute",
                            top: `${circleTop}%`,
                            left: `${circleLeft}%`,
                            transform: "translate(-50%, -50%)",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: "2px solid #EF3E36",
                            backgroundColor: "rgba(239, 62, 54, 0.25)",
                            cursor: "grab",
                            touchAction: "none",
                        }}
                    />
                )}
            </div>
        </div>
    );
}
