import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

// Hand-rolled warm light-leak sweep (see whipPan.tsx for why this is
// CSS-only rather than @remotion/transitions' filmBurn shader): a soft
// cross-fade with an additive warm gradient sweeping across at the cut.
export type LightLeakProps = Record<string, unknown>;

const LightLeakPresentation: React.FC<TransitionPresentationComponentProps<LightLeakProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;
  const opacity = isEntering ? p : 1 - p;
  const leakOpacity = Math.sin(Math.min(1, p) * Math.PI) * 0.8;
  const sweepX = interpolate(p, [0, 1], isEntering ? [-20, 110] : [10, 130]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: leakOpacity,
          background: `radial-gradient(ellipse 55% 85% at ${sweepX}% 48%, rgba(255,220,165,0.95) 0%, rgba(255,160,90,0.5) 38%, rgba(255,120,40,0) 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const lightLeak = (): TransitionPresentation<LightLeakProps> => ({
  component: LightLeakPresentation,
  props: {},
});
