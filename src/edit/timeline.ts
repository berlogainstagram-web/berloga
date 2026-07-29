import {
  CTA_DURATION_SEC,
  CTA_TRANSITION,
  SCENES,
  TRANSITION_DEFAULT_SEC,
  sceneDurationFrames,
  toFrames,
  transitionFrames,
} from "./editPlan";

// Mirrors how <TransitionSeries> lays out Sequence/Transition/Sequence...
// internally: each transition shortens the total timeline by its own
// duration, overlapping the tail of the previous scene with the head of
// the next. We recompute the same offsets here (not inside a
// TransitionSeries) so a parallel, non-overlapping audio track can hard-cut
// exactly where the visual crossfade begins — see AudioTrack.tsx.
export type CompiledScene = {
  sceneIndex: number;
  start: number;
  durationInFrames: number;
};

export const ctaDurationInFrames = toFrames(CTA_DURATION_SEC);
export const ctaTransitionFrames = toFrames(TRANSITION_DEFAULT_SEC[CTA_TRANSITION]);

export const compileTimeline = () => {
  const compiled: CompiledScene[] = [];
  let cursor = 0;

  SCENES.forEach((scene, i) => {
    const dur = sceneDurationFrames(scene);
    compiled.push({ sceneIndex: i, start: cursor, durationInFrames: dur });
    // The transition after the last scene is the CTA's fade-in, not 0 —
    // omitting it here previously left the <Composition> ~ctaTransitionFrames
    // longer than what <TransitionSeries> actually renders, producing a
    // black tail after the real content ended.
    const nextTransitionFrames =
      i + 1 < SCENES.length ? transitionFrames(SCENES[i + 1]) : ctaTransitionFrames;
    cursor += dur - nextTransitionFrames;
  });

  const ctaStart = cursor;

  return {
    scenes: compiled,
    ctaStart,
    totalDurationInFrames: ctaStart + ctaDurationInFrames,
  };
};

export const TIMELINE = compileTimeline();
