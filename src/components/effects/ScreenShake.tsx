import React from "react";
import { useCurrentFrame } from "remotion";

// Deterministic decaying-oscillation shake (no randomness needed for a
// punchy hit) — active for ~14 frames at the start of whatever local frame
// range it's mounted over, then settles to zero.
export const ScreenShake: React.FC<{ children: React.ReactNode; amplitude?: number }> = ({
  children,
  amplitude = 3.5,
}) => {
  const frame = useCurrentFrame();
  const decay = Math.exp(-frame / 3.2);
  const dx = frame < 16 ? amplitude * decay * Math.sin(frame * 2.4) : 0;
  const dy = frame < 16 ? amplitude * decay * Math.cos(frame * 3.1) : 0;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px)` }}>
      {children}
    </div>
  );
};
