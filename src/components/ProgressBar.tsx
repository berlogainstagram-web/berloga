import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const ProgressBar: React.FC<{ totalDurationInFrames: number }> = ({
  totalDurationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, frame / totalDurationInFrames));

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        background: "rgba(255,255,255,0.14)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: theme.accent2,
          boxShadow: `0 0 10px ${theme.accent2}aa`,
        }}
      />
    </div>
  );
};
