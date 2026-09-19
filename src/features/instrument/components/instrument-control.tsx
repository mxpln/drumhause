import { useState } from "react";

import { useChannelReady } from "@/core/audio/bridge/use-kit-version";
import { isSameAsSource } from "@/features/sequencer/lib/clipboard";
import { usePatternStore } from "@/features/sequencer/store/use-pattern-store";
import {
  copiedItemHighlight,
  interactableHighlight,
} from "@/shared/lib/interactable-highlight";
import { cn } from "@/shared/lib/utils";
import { useInstrumentsStore } from "../store/use-instruments-store";
import { InstrumentFxPanel } from "./instrument-fx-panel";
import { InstrumentHeader } from "./instrument-header";
import { InstrumentParamsControl } from "./instrument-params-control";

type InstrumentControlParams = {
  color?: string;
  index: number;
  waveformWidth?: number;
};

function InstrumentControl({
  index,
  color = "currentColor",
  waveformWidth,
}: InstrumentControlParams) {
  const [isFxExpanded, setIsFxExpanded] = useState(false);
  const instrumentMeta = useInstrumentsStore(
    (state) => state.instruments[index].meta,
  );

  // Refreshed on every kit load so readiness reflects the active channels
  const isChannelReady = useChannelReady(index);

  const mode = usePatternStore((state) => state.mode);
  const variation = usePatternStore((state) => state.variation);
  const clipboard = usePatternStore((state) => state.clipboard);
  const copySource = usePatternStore((state) => state.copySource);

  const isSelectedAndActive =
    (mode.type === "voice" ||
      mode.type === "ratchet" ||
      mode.type === "flam") &&
    mode.voiceIndex === index;

  const isCopyMode = mode.type === "copy";
  const isPasteMode = mode.type === "paste";
  const isClearMode = mode.type === "clear";

  // Check if this instrument is the copy source (for dimming in paste mode)
  const isSource =
    isPasteMode &&
    copySource !== null &&
    clipboard?.type === "instrument" &&
    isSameAsSource(copySource, "instrument", index, variation);

  // Highlight instruments in copy mode, or in paste mode with instrument clipboard
  const shouldHighlight =
    isCopyMode ||
    isClearMode ||
    (isPasteMode && clipboard?.type === "instrument" && !isSource);

  const shouldShowCopiedHighlight = isSource;
  const disableChildInteractions = shouldHighlight || shouldShowCopiedHighlight;

  // Don't show selected state during copy/paste modes
  const showSelectedState =
    isSelectedAndActive && !isCopyMode && !isPasteMode && !isClearMode;

  return (
    <div
      data-instrument-index={index}
      data-selected={showSelectedState || undefined}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-visible rounded-2xl border border-transparent",
        {
          "cursor-pointer": isChannelReady,
          "cursor-default": !isChannelReady,
        },
        showSelectedState && "border-primary/60 bg-primary/5",
        interactableHighlight(shouldHighlight),
        copiedItemHighlight(shouldShowCopiedHighlight),
        disableChildInteractions && "bg-surface",
      )}
      key={`Instrument-${instrumentMeta.id}-${index}`}
    >
      <div className="mb-2">
        <InstrumentHeader
          index={index}
          color={color}
          waveformWidth={waveformWidth}
        />
      </div>

      <button
        type="button"
        aria-controls={`instrument-fx-panel-${index}`}
        aria-expanded={isFxExpanded}
        className={cn(
          "focus-ring font-pixel mx-1 mb-2 min-h-7 rounded-md border px-2 text-center text-[10px] transition-colors",
          isFxExpanded
            ? "border-primary/60 bg-primary/15 text-foreground-emphasis"
            : "border-border/70 bg-surface/60 text-foreground-emphasis hover:border-primary/50 hover:bg-primary/10",
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => setIsFxExpanded((expanded) => !expanded)}
      >
        {isFxExpanded ? "Hide FX" : "FX"}
      </button>

      {isFxExpanded && (
        <div
          className={cn(
            "absolute top-full z-30 mt-1",
            index >= 6 ? "right-0" : "left-0",
          )}
        >
          <InstrumentFxPanel index={index} />
        </div>
      )}
      <div className="mb-2">
        <InstrumentParamsControl index={index} />
      </div>
    </div>
  );
}

export { InstrumentControl };
