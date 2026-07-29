import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const WORD_STAGGER = 4;
const HOLD_AFTER = 46;
const FADE_OUT = 12;

const stripPunctuation = (word: string) => word.replace(/[«»,.!?]/g, "");

export const KineticCaption: React.FC<{
  phrase: string;
  accent?: string[];
  startFrame: number;
  fontFamily: string;
}> = ({ phrase, accent = [], startFrame, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = phrase.split(" ");

  const lastWordStart = startFrame + (words.length - 1) * WORD_STAGGER;
  const endFrame = lastWordStart + HOLD_AFTER;

  if (frame < startFrame - 3 || frame > endFrame + FADE_OUT) return null;

  const groupOpacity = interpolate(frame, [endFrame, endFrame + FADE_OUT], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 360,
        display: "flex",
        justifyContent: "center",
        opacity: groupOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px 18px",
          background: "rgba(9,11,15,0.5)",
          backdropFilter: "blur(14px)",
          borderRadius: 24,
          padding: "18px 34px",
          maxWidth: "100%",
        }}
      >
        {words.map((word, i) => {
          const wordStart = startFrame + i * WORD_STAGGER;
          const local = frame - wordStart;
          const scale = spring({
            frame: local,
            fps,
            config: { damping: 11, mass: 0.5, stiffness: 210 },
          });
          const opacity = interpolate(local, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isAccent = accent.includes(stripPunctuation(word));

          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                transform: `scale(${local < 0 ? 0 : scale})`,
                opacity: local < 0 ? 0 : opacity,
                fontFamily,
                fontWeight: 800,
                fontSize: 68,
                lineHeight: 1.05,
                color: isAccent ? theme.accent2 : theme.text,
                textShadow:
                  "0 2px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(0,0,0,0.6), 2px 0 0 rgba(0,0,0,0.6), -2px 0 0 rgba(0,0,0,0.6), 0 8px 26px rgba(0,0,0,0.55)",
                letterSpacing: -0.5,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
