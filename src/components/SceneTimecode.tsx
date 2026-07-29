import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const formatTime = (frame: number, fps: number) => {
  const totalSeconds = frame / fps;
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const SceneTimecode: React.FC<{
  sceneNumber: number;
  sceneCount: number;
  fontFamily: string;
}> = ({ sceneNumber, sceneCount, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 28,
        bottom: 20,
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        fontFamily,
        color: "rgba(255,255,255,0.55)",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: 0.5,
        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
      }}
    >
      <span style={{ color: theme.accent2 }}>
        {String(sceneNumber).padStart(2, "0")}/{String(sceneCount).padStart(2, "0")}
      </span>
      <span>{formatTime(frame, fps)}</span>
    </div>
  );
};
