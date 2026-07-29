import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const CTAOutro: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.6, stiffness: 190 } });
  const textOpacity = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [10, 24], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillOpacity = interpolate(frame, [20, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillPulse = frame > 32 ? 1 + Math.sin((frame - 32) / 9) * 0.02 : 1;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img
        src={staticFile("video/stills/cta-bg.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(20px) brightness(0.42) saturate(1.15)",
          transform: "scale(1.12)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 26 }}>
          <span
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 84,
              color: theme.text,
              letterSpacing: -1.5,
              textShadow: "0 14px 44px rgba(0,0,0,0.6)",
            }}
          >
            БЕРЛОГА
          </span>
        </div>
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)`, textAlign: "center" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 32,
              color: theme.textDim,
              marginBottom: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <span>♨️</span>
            <span>Банный комплекс · Астана</span>
          </div>
          <div
            style={{
              opacity: pillOpacity,
              transform: `scale(${pillPulse})`,
              display: "inline-block",
              fontFamily,
              fontWeight: 800,
              fontSize: 36,
              color: theme.bg,
              background: theme.accent2,
              borderRadius: 999,
              padding: "22px 48px",
              boxShadow: `0 16px 44px ${theme.accent2}55`,
            }}
          >
            Бронируй свою баню →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
