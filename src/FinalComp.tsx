import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { IntroComp } from "./IntroComp";
import { BanyaMontage, montageDurationInFrames } from "./BanyaMontage";

const TRANSITION = 12; // 0.4s @ 30fps
export const introDurationInFrames = 814;

export const finalDurationInFrames =
  introDurationInFrames + montageDurationInFrames - TRANSITION;

export const FinalComp: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={introDurationInFrames}>
          <IntroComp videoSrc={videoSrc} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={montageDurationInFrames}>
          <BanyaMontage />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
