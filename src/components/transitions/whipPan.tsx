import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

// Hand-rolled whip-pan / speed-blur: both scenes translate in the same
// direction, with a blur that peaks mid-transition. We don't use
// @remotion/transitions' canvas-shader presentations (zoomBlur, linearBlur,
// filmBurn, ...) because they require an experimental "HTML in Canvas"
// Chrome feature this environment's headless Chromium doesn't have
// (render fails with "HTML in Canvas is not supported"). Plain CSS
// transform+filter gets the same read without that dependency.
export type WhipPanProps = { direction?: "left" | "right" };

const WhipPanPresentation: React.FC<TransitionPresentationComponentProps<WhipPanProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const sign = passedProps.direction === "right" ? 1 : -1;
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;
  const blur = Math.sin(Math.min(1, p) * Math.PI) * 26;
  const translate = isEntering ? (1 - p) * -sign * 100 : p * sign * 100;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translate}%)`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const whipPan = (props: WhipPanProps = {}): TransitionPresentation<WhipPanProps> => ({
  component: WhipPanPresentation,
  props,
});
