import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Soft screen-blend glow that breathes in over a scene's first ~20 frames,
// used on scenes with bright highlights (water reflections, embers) to
// sell a bloomed-highlight look without a real HDR pass.
export const Bloom: React.FC<{ strength?: number }> = ({ strength = 0.22 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, strength], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity,
        background:
          "radial-gradient(ellipse at 52% 38%, rgba(255,244,214,0.9) 0%, rgba(255,220,160,0.35) 30%, rgba(255,220,160,0) 60%)",
      }}
    />
  );
};
