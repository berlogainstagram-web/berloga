import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

// Hand-rolled zoom-punch cut (see whipPan.tsx for why this is CSS-only
// rather than @remotion/transitions' zoomBlur shader): the outgoing scene
// punches outward and fades, the incoming scene snaps in from oversize to
// normal.
export type PunchZoomProps = Record<string, unknown>;

const PunchZoomPresentation: React.FC<TransitionPresentationComponentProps<PunchZoomProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;
  const scale = isEntering
    ? interpolate(p, [0, 1], [1.32, 1])
    : interpolate(p, [0, 1], [1, 1.14]);
  const opacity = isEntering ? 1 : interpolate(p, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>{children}</AbsoluteFill>
  );
};

export const punchZoom = (): TransitionPresentation<PunchZoomProps> => ({
  component: PunchZoomPresentation,
  props: {},
});
