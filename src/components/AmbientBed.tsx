import React from "react";
import { Sequence, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, FPS } from "../edit/editPlan";
import { TIMELINE } from "../edit/timeline";

const BASE = 0.1;
const SWELL = 0.32;
const RAMP = 10;
const PAD_DURATION_SEC = 34;
const PAD_FRAMES = PAD_DURATION_SEC * FPS;

// Ambient pad, tiled back-to-back under the whole edit (rather than using
// the `loop` prop — looping a Html5Audio-fallback element triggered a
// hard MediaError in this environment's headless Chromium, while several
// independent non-looping <Audio> instances back to back render fine).
// Ducked low while the narrator is talking, swelled up during the two
// sped-up connective scenes (and the CTA) so those beats still feel scored
// instead of going quiet.
const swellRanges = [
  ...TIMELINE.scenes
    .filter(({ sceneIndex }) => SCENES[sceneIndex].duckSource)
    .map(({ start, durationInFrames }) => ({ start, end: start + durationInFrames })),
  { start: TIMELINE.ctaStart, end: TIMELINE.totalDurationInFrames },
];

const volumeAt = (frame: number) => {
  for (const range of swellRanges) {
    if (frame >= range.start - RAMP && frame <= range.end + RAMP) {
      return interpolate(
        frame,
        [range.start - RAMP, range.start, range.end, range.end + RAMP],
        [BASE, SWELL, SWELL, BASE],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
    }
  }
  return BASE;
};

export const AmbientBed: React.FC = () => {
  const tiles = Math.ceil(TIMELINE.totalDurationInFrames / PAD_FRAMES);

  return (
    <>
      {Array.from({ length: tiles }, (_, i) => {
        const from = i * PAD_FRAMES;
        const durationInFrames = Math.min(PAD_FRAMES, TIMELINE.totalDurationInFrames - from);
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames} layout="none">
            <Audio
              src={staticFile("audio/ambient-pad.m4a")}
              volume={(f: number) => volumeAt(from + f)}
            />
          </Sequence>
        );
      })}
    </>
  );
};
