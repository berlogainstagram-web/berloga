import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { MontageScene } from "./components/MontageScene";

const fontFamily = "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif";
const TRANSITION = 12; // 0.4s @ 30fps

const scenes = [
  { src: staticFile("video/montage/pool.mp4"), duration: 212, label: "Купель с горным видом" },
  { src: staticFile("video/montage/hall.mp4"), duration: 359, label: "Интерьер бани" },
  { src: staticFile("video/montage/samovar.mp4"), duration: 140, label: "Чаепитие у самовара" },
  { src: staticFile("video/montage/oven.mp4"), duration: 272, label: "Очаг и терраса" },
];

export const montageDurationInFrames =
  scenes.reduce((sum, s) => sum + s.duration, 0) - TRANSITION * (scenes.length - 1);

export const BanyaMontage: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {scenes.map((scene, i) => (
          <React.Fragment key={scene.src}>
            <TransitionSeries.Sequence durationInFrames={scene.duration}>
              <MontageScene src={scene.src} label={scene.label} fontFamily={fontFamily} />
            </TransitionSeries.Sequence>
            {i < scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Audio
        src={staticFile("audio/ambient-pad.m4a")}
        volume={0.4}
        trimAfter={montageDurationInFrames}
      />
    </AbsoluteFill>
  );
};
