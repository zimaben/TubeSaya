import { Player } from "@remotion/player";
import { COMPONENT_MAP, resolveProps, getDurationInFrames } from "../../../../remotion/resolveComposition";

export default function PreviewPlayer({ activeMacro, rawMacro, settings }) {
    const ActiveComponent = COMPONENT_MAP[activeMacro];

    if (!ActiveComponent) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-[#1A181B]/50">
                No preview available for this macro yet.
            </div>
        );
    }

    const { width, height, fps } = settings.video;

    return (
        <div className="player-container flex-1 min-h-0 flex items-center justify-center">
            <Player
                component={ActiveComponent}
                inputProps={resolveProps(rawMacro)}
                durationInFrames={getDurationInFrames(activeMacro, rawMacro, fps)}
                compositionWidth={width}
                compositionHeight={height}
                fps={fps}
                controls
                loop
                autoPlay
                style={{ width: "100%", height: "auto", maxHeight: "100%", aspectRatio: `${width} / ${height}` }}
            />
        </div>
    );
}
