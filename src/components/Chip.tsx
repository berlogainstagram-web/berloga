import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { theme } from "../theme";

export const PopIn: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const scale = spring({
    frame: local,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 170 },
  });

  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${local < 0 ? 0 : scale}) translateY(${interpolate(
          scale,
          [0, 1],
          [24, 0],
        )}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{
  icon: React.ReactNode;
  label: string;
  accent?: string;
  size?: "lg" | "md";
}> = ({ icon, label, accent = theme.accent, size = "md" }) => {
  const isLg = size === "lg";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: isLg ? 18 : 14,
        background: "rgba(23,27,36,0.86)",
        border: `1px solid ${theme.border}`,
        borderRadius: isLg ? 28 : 22,
        padding: isLg ? "18px 30px 18px 20px" : "12px 22px 12px 14px",
        boxShadow: `0 8px 30px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.02)`,
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        style={{
          width: isLg ? 56 : 40,
          height: isLg ? 56 : 40,
          borderRadius: isLg ? 18 : 14,
          background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 4px 18px ${accent}55`,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif",
          fontWeight: 700,
          fontSize: isLg ? 30 : 24,
          color: theme.text,
          letterSpacing: -0.2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const IconTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  accent?: string;
  active?: boolean;
}> = ({ icon, label, accent = theme.accent, active = false }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: 150,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 26,
          background: active
            ? `linear-gradient(135deg, ${accent}, ${accent}aa)`
            : "rgba(255,255,255,0.06)",
          border: `1px solid ${active ? "transparent" : theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active
            ? `0 10px 34px ${accent}66`
            : "0 4px 14px rgba(0,0,0,0.3)",
          transition: "none",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif",
          fontWeight: 700,
          fontSize: 26,
          color: active ? theme.text : theme.textDim,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
};
