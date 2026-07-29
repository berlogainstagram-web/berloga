import React from "react";
import { AbsoluteFill } from "remotion";

// Single LUT-ish grade applied to the whole edit: teal into the shadows,
// warm orange on the highlights/skin tones, plus a contrast/saturation
// lift. `bias` nudges the balance per-scene (a "warm" scene like the sauna
// leans further into orange, "cool" like the pool leans into teal) without
// changing the overall look.
export const ColorGrade: React.FC<{
  children: React.ReactNode;
  bias?: "warm" | "cool" | "neutral";
}> = ({ children, bias = "neutral" }) => {
  const tealOpacity = bias === "cool" ? 0.42 : bias === "warm" ? 0.22 : 0.3;
  const orangeOpacity = bias === "warm" ? 0.24 : bias === "cool" ? 0.1 : 0.16;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "contrast(1.13) saturate(1.12) brightness(1.02)" }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "multiply",
          opacity: tealOpacity,
          background:
            "linear-gradient(180deg, rgba(10,26,32,0.9) 0%, rgba(10,20,28,0) 34%, rgba(10,20,28,0) 66%, rgba(8,22,30,0.9) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "soft-light",
          opacity: orangeOpacity,
          background: "radial-gradient(ellipse at 50% 45%, rgba(255,176,102,0.95) 0%, rgba(255,176,102,0) 62%)",
        }}
      />
    </AbsoluteFill>
  );
};
