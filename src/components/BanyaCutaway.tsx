import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { theme } from "../theme";

const FADE = 8;

const Inner: React.FC<{ src: string; durationInFrames: number; fontFamily: string }> = ({
  src,
  durationInFrames,
  fontFamily,
}) => {
  const frame = useCurrentFrame(); // local, 0-based within the Sequence — matches the video's own timeline
  const end = durationInFrames;

  const opacity = interpolate(frame, [0, FADE, end - FADE, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [FADE + 6, FADE + 16, end - FADE - 4, end - FADE], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Video src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 35%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
        <div
          style={{
            opacity: labelOpacity,
            fontFamily,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(11,13,18,0.72)",
            border: `1px solid ${theme.border}`,
            borderRadius: 999,
            padding: "10px 22px",
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ fontSize: 20 }}>♨️</span>
          <span style={{ color: theme.text, fontWeight: 700, fontSize: 22 }}>
            Банный комплекс «Берлога» · Астана
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BanyaCutaway: React.FC<{
  src: string;
  start: number;
  end: number;
  fontFamily: string;
}> = ({ src, start, end, fontFamily }) => {
  const durationInFrames = end - start;
  return (
    <Sequence from={start} durationInFrames={durationInFrames} layout="none">
      <Inner src={src} durationInFrames={durationInFrames} fontFamily={fontFamily} />
    </Sequence>
  );
};
