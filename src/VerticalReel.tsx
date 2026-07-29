import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { SCENES, transitionFrames } from "./edit/editPlan";
import { TIMELINE, ctaDurationInFrames, ctaTransitionFrames } from "./edit/timeline";
import { SceneVideo } from "./components/SceneVideo";
import { CTAOutro } from "./components/CTAOutro";
import { AudioTrack } from "./components/AudioTrack";
import { AmbientBed } from "./components/AmbientBed";
import { Vignette } from "./components/effects/Vignette";
import { FilmGrain } from "./components/effects/FilmGrain";
import { ProgressBar } from "./components/ProgressBar";
import { SceneTimecode } from "./components/SceneTimecode";
import { presentationFor } from "./components/transitionFor";
import { fade } from "@remotion/transitions/fade";
import { MONTSERRAT } from "./fonts";

// Importing "./fonts" registers the self-hosted Montserrat FontFaces
// (delayRender-gated) as a side effect.
const fontFamily = MONTSERRAT;

const LiveSceneTimecode: React.FC = () => {
  const frame = useCurrentFrame();
  let sceneNumber = TIMELINE.scenes.length;
  for (const compiled of TIMELINE.scenes) {
    if (frame >= compiled.start) sceneNumber = compiled.sceneIndex + 1;
  }
  return (
    <SceneTimecode
      sceneNumber={sceneNumber}
      sceneCount={SCENES.length}
      fontFamily={fontFamily}
    />
  );
};

export const VerticalReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {SCENES.map((scene, i) => (
          <React.Fragment key={scene.id}>
            {i > 0 && scene.transitionIn && (
              <TransitionSeries.Transition
                presentation={presentationFor(scene.transitionIn)}
                timing={linearTiming({ durationInFrames: transitionFrames(scene) })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={TIMELINE.scenes[i].durationInFrames}>
              <SceneVideo scene={scene} fontFamily={fontFamily} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: ctaTransitionFrames })}
        />
        <TransitionSeries.Sequence durationInFrames={ctaDurationInFrames}>
          <CTAOutro fontFamily={fontFamily} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <AudioTrack />
      <AmbientBed />

      <Vignette />
      <FilmGrain />
      <ProgressBar totalDurationInFrames={TIMELINE.totalDurationInFrames} />
      <LiveSceneTimecode />
    </AbsoluteFill>
  );
};
