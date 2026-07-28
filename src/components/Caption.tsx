import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

const FADE = 10;

export const Caption: React.FC<{
  text: string;
  start: number;
  end: number;
  fontFamily: string;
}> = ({ text, start, end, fontFamily }) => {
  const frame = useCurrentFrame();
  if (frame < start - FADE || frame > end + FADE) return null;

  const opacity = interpolate(
    frame,
    [start - FADE, start, end, end + FADE],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const y = interpolate(frame, [start - FADE, start], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 96,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1.35,
          color: theme.text,
          background: "rgba(11,13,18,0.72)",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          padding: "6px 14px",
          borderRadius: 10,
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
        }}
      >
        {text}
      </span>
    </div>
  );
};
