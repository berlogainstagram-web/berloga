import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { theme } from "../theme";

export const MontageScene: React.FC<{
  src: string;
  label: string;
  fontFamily: string;
}> = ({ src, label, fontFamily }) => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [10, 22], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
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
          <span style={{ color: theme.text, fontWeight: 700, fontSize: 22 }}>{label}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
