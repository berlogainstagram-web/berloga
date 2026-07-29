import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export type KenBurnsMode = "in" | "out" | "pan-left" | "pan-right" | "none";

export const KenBurns: React.FC<{
  children: React.ReactNode;
  mode?: KenBurnsMode;
  durationInFrames: number;
}> = ({ children, mode = "none", durationInFrames }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  let scale = 1;
  let x = 0;

  if (mode === "in") {
    scale = interpolate(t, [0, 1], [1.0, 1.1]);
  } else if (mode === "out") {
    scale = interpolate(t, [0, 1], [1.1, 1.0]);
  } else if (mode === "pan-left") {
    scale = 1.1;
    x = interpolate(t, [0, 1], [14, -14]);
  } else if (mode === "pan-right") {
    scale = 1.1;
    x = interpolate(t, [0, 1], [-14, 14]);
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${x}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
