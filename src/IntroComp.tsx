import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { TopScrim, BottomScrim } from "./components/Scrim";
import { BanyaCutaway } from "./components/BanyaCutaway";

// Local system font (Liberation Sans covers Cyrillic) — avoids network font fetches.
const fontFamily = "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif";

// Beat frame markers (30fps), snapped to the natural speech pauses detected
// in the source audio — the speaker's audio is never interrupted, only the
// visual cuts away to banya B-roll during these windows.
const BEATS = {
  cutawayA: { start: 204, end: 264 }, // clip1/clip2 pause — fire/stove
  cutawayB: { start: 364, end: 424 }, // clip2/clip3 pause — decorated hall
  cutawayC: { start: 550, end: 610 }, // clip3/clip4 pause — mirror room
  cutawayD: { start: 663, end: 723 }, // late pause in clip4 — samovar
};

export const IntroComp: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Video src={videoSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <TopScrim />
      <BottomScrim />

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
