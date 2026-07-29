import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

// A fixed SVG fractal-noise tile, jittered in position + opacity per frame
// (deterministic, via @remotion/noise) instead of regenerating the
// feTurbulence filter every frame — much cheaper to render at 1080x1920
// while still reading as organic, moving grain. Rendered via <Img> (not a
// CSS background-image) so Remotion's headless renderer can track its load.
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='2100'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7' stitchTiles='stitch' />
      <feColorMatrix type='saturate' values='0' />
    </filter>
    <rect width='100%' height='100%' filter='url(#n)' />
  </svg>`,
);
const GRAIN_SRC = `data:image/svg+xml,${GRAIN_SVG}`;

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const jitterX = noise2D("grain-x", frame, 0) * 50;
  const jitterY = noise2D("grain-y", frame, 0) * 50;
  const flicker = opacity + noise2D("grain-o", frame, 0) * 0.018;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <Img
        src={GRAIN_SRC}
        style={{
          position: "absolute",
          left: -60 + jitterX,
          top: -90 + jitterY,
          width: 1200,
          height: 2100,
          opacity: Math.max(0, flicker),
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
