import { RotaryKnob } from "@/design/param-control";

import { useInstrumentsStore } from "@/features/instrument/store/use-instruments-store";
import { DEFAULT_INSTRUMENT_EFFECTS } from "@/features/instrument/types/instrument";
import { historyGestureHandlers } from "@/features/preset/history/history";
import {
  masterCompAttackDescriptor,
  masterCompMixDescriptor,
  masterCompRatioDescriptor,
  masterCompThresholdDescriptor,
  masterPhaserDescriptor,
  masterReverbDescriptor,
  masterSaturationDescriptor,
} from "@/shared/param-control/descriptors/canonical-scalars";

interface InstrumentFxPanelProps {
  index: number;
}

function InstrumentFxPanel({ index }: InstrumentFxPanelProps) {
  const effects =
    useInstrumentsStore((state) => state.instruments[index].params.effects) ??
    DEFAULT_INSTRUMENT_EFFECTS;
  const setInstrumentProperty = useInstrumentsStore(
    (state) => state.setInstrumentProperty,
  );

  const setEffects = (key: keyof typeof effects, value: number) => {
    setInstrumentProperty(index, "effects", { ...effects, [key]: value });
  };

  return (
    <div className="grid grid-cols-4 gap-2 border-t pt-2">
      <RotaryKnob
        {...historyGestureHandlers}
        label="sat"
        descriptor={masterSaturationDescriptor}
        value={effects.saturation}
        onChange={(value) => setEffects("saturation", value)}
      />
      <RotaryKnob
        {...historyGestureHandlers}
        label="reverb"
        descriptor={masterReverbDescriptor}
        value={effects.reverb}
        onChange={(value) => setEffects("reverb", value)}
      />
      <RotaryKnob
        {...historyGestureHandlers}
        label="phaser"
        descriptor={masterPhaserDescriptor}
        value={effects.phaser}
        onChange={(value) => setEffects("phaser", value)}
      />
      <RotaryKnob
        {...historyGestureHandlers}
        label="mix"
        descriptor={masterCompMixDescriptor}
        value={effects.compMix}
        onChange={(value) => setEffects("compMix", value)}
      />
      <RotaryKnob
        {...historyGestureHandlers}
        label="threshold"
        descriptor={masterCompThresholdDescriptor}
        value={effects.compThreshold}
        onChange={(value) => setEffects("compThreshold", value)}
      />
      <RotaryKnob
        {...historyGestureHandlers}
        label="ratio"
        descriptor={masterCompRatioDescriptor}
        value={effects.compRatio}
        onChange={(value) => setEffects("compRatio", value)}
        outerTickCount={8}
      />
      <RotaryKnob
        {...historyGestureHandlers}
        label="punch"
        descriptor={masterCompAttackDescriptor}
        value={effects.compAttack}
        onChange={(value) => setEffects("compAttack", value)}
      />
    </div>
  );
}

export { InstrumentFxPanel };
