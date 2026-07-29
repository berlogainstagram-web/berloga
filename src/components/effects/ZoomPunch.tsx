import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// Fast zoom-in-then-settle at the start of whatever local frame range this
// is mounted over — the "punch" feeling of a beat-synced cut landing.
export const ZoomPunch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 9], [1.16, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})` }}>{children}</div>
  );
};
