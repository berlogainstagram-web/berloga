import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const HOLD_AFTER = 52;
const FADE_OUT = 14;

export const TitleCard: React.FC<{
  text: string;
  startFrame: number;
  fontFamily: string;
}> = ({ text, startFrame, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  const endFrame = startFrame + HOLD_AFTER;

  if (frame < startFrame - 2 || frame > endFrame + FADE_OUT) return null;

  const scale = spring({ frame: local, fps, config: { damping: 13, mass: 0.7, stiffness: 175 } });
  const blur = interpolate(local, [0, 14], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [endFrame, endFrame + FADE_OUT], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.15) 100%)",
        }}
      />
      <div
        style={{
          transform: `scale(${local < 0 ? 0.7 : scale})`,
          filter: `blur(${Math.max(0, blur)}px)`,
          textAlign: "center",
          padding: "0 90px",
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 96,
            color: theme.text,
            letterSpacing: -1.5,
            lineHeight: 1.05,
            textShadow: "0 14px 50px rgba(0,0,0,0.65)",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
