import React, { useId } from "react";
import { interpolate, useCurrentFrame } from "remotion";

// Cheap RGB-channel-split glitch flicker for the first ~9 frames of a
// scene, layered under the pushCut transition for an extra "digital
// disruption" beat on hard accented cuts.
export const RGBGlitchOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const filterId = `rgb-split-${useId()}`;
  const active = frame >= 0 && frame < 9;

  if (!active) return <>{children}</>;

  const offset = interpolate(frame, [0, 9], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="rc"
            />
            <feOffset in="rc" dx={offset} dy="0" result="rOff" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="gc"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="bc"
            />
            <feOffset in="bc" dx={-offset} dy="0" result="bOff" />
            <feBlend in="rOff" in2="gc" mode="screen" result="rg" />
            <feBlend in="rg" in2="bOff" mode="screen" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: `url(#${filterId})` }}>{children}</div>
    </>
  );
};
