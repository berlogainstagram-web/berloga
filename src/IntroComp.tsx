import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { theme } from "./theme";
import { TopScrim, BottomScrim } from "./components/Scrim";
import { Chip, PopIn } from "./components/Chip";
import { RemotionGlyph, ClaudeGlyph } from "./components/Brands";
import { BanyaCutaway } from "./components/BanyaCutaway";
import { Caption } from "./components/Caption";

// Local system font (Liberation Sans covers Cyrillic) — avoids network font fetches.
const fontFamily = "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif";

// Beat frame markers (30fps). Text beats are snapped to the natural speech
// pauses detected in the source audio; banya cutaways sit inside those same
// pauses so the speaker's audio is never interrupted, only the visual cuts away.
const BEATS = {
  kicker: 0,
  remotionChip: 60,
  claudeChip: 122,
  headerShrinkStart: 184,
  cutawayA: { start: 204, end: 264 }, // clip1/clip2 pause — fire/stove
  skillCard: 264,
  cutawayB: { start: 364, end: 424 }, // clip2/clip3 pause — decorated hall
  cutawayC: { start: 550, end: 610 }, // clip3/clip4 pause — mirror room
  cutawayD: { start: 663, end: 723 }, // late pause in clip4 — samovar
};

const cardBase: React.CSSProperties = {
  fontFamily,
  color: theme.text,
};

export const IntroComp: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header lockup shrinks + moves to corner before the first cutaway.
  const headerShrink = interpolate(frame, [BEATS.headerShrinkStart, BEATS.cutawayA.start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  const kickerOpacity = interpolate(frame, [BEATS.kicker, BEATS.kicker + 15, BEATS.headerShrinkStart - 6, BEATS.headerShrinkStart + 14], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const skillCardOpacity = interpolate(
    frame,
    [BEATS.skillCard, BEATS.skillCard + 15, BEATS.cutawayB.start - 10, BEATS.cutawayB.start],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const skillCardY = spring({ frame: frame - BEATS.skillCard, fps, config: { damping: 16, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Video src={videoSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <TopScrim />
      <BottomScrim />

      {/* Kicker intro card */}
      <AbsoluteFill
        style={{
          ...cardBase,
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 90,
          opacity: kickerOpacity,
        }}
      >
        <PopIn delay={BEATS.kicker + 4}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              color: theme.accent2,
              textTransform: "uppercase",
              textAlign: "center",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            Сегодня в видео
          </div>
        </PopIn>
      </AbsoluteFill>

      {/* Remotion + Claude Code lockup (persists, shrunk, through the whole video) */}
      <AbsoluteFill
        style={{
          ...cardBase,
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 160,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            transform: `scale(${interpolate(headerShrink, [0, 1], [1, 0.56])}) translateY(${interpolate(headerShrink, [0, 1], [0, -40])}px)`,
            opacity: interpolate(frame, [BEATS.remotionChip - 5, BEATS.remotionChip + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <PopIn delay={BEATS.remotionChip}>
            <Chip icon={<RemotionGlyph size={26} />} label="Remotion" accent={theme.accent} />
          </PopIn>
          <PopIn delay={BEATS.claudeChip}>
            <Chip icon={<ClaudeGlyph size={24} />} label="Claude Code" accent={theme.accent3} />
          </PopIn>
        </div>
      </AbsoluteFill>

      {/* "Новый скилл в Claude Remotion" card */}
      <AbsoluteFill
        style={{
          ...cardBase,
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 230,
          opacity: skillCardOpacity,
        }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(skillCardY, [0, 1], [30, 0])}px)`,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.accent2, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            Новый скилл
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.5, textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>
            Claude <span style={{ color: theme.accent }}>Remotion</span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Approximate caption (from the creator's own description — not a word-level transcript) */}
      <Caption
        fontFamily={fontFamily}
        text="Новый скилл — Claude Remotion"
        start={BEATS.skillCard + 10}
        end={BEATS.cutawayB.start - 10}
      />

      {/* Banya B-roll cutaways — voice audio from the talking-head clip keeps playing underneath */}
      <BanyaCutaway
        fontFamily={fontFamily}
        src={staticFile("video/banya-fire.mp4")}
        start={BEATS.cutawayA.start}
        end={BEATS.cutawayA.end}
      />
      <BanyaCutaway
        fontFamily={fontFamily}
        src={staticFile("video/banya-hall.mp4")}
        start={BEATS.cutawayB.start}
        end={BEATS.cutawayB.end}
      />
      <BanyaCutaway
        fontFamily={fontFamily}
        src={staticFile("video/banya-mirror.mp4")}
        start={BEATS.cutawayC.start}
        end={BEATS.cutawayC.end}
      />
      <BanyaCutaway
        fontFamily={fontFamily}
        src={staticFile("video/banya-samovar.mp4")}
        start={BEATS.cutawayD.start}
        end={BEATS.cutawayD.end}
      />
    </AbsoluteFill>
  );
};
