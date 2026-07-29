import React from "react";
import { Sequence, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, toFrames } from "../edit/editPlan";
import { clipSegmentsToFrames, renderSegments } from "../edit/segments";
import { TIMELINE } from "../edit/timeline";

const SOURCE = staticFile("video/source.mp4");
const FADE = 3;

// The narration, laid out as plain (non-overlapping) Sequences that
// hard-cut exactly where the visual TransitionSeries crossfades — see
// timeline.ts for why this has to be a separate track rather than reusing
// the muted <Video> in SceneVideo: two adjacent scenes here are literally
// consecutive seconds of the same continuous recording, so if their audio
// played simultaneously during a crossfade it would sound like the
// narrator's voice doubling/stuttering on itself, not a clean transition.
export const AudioTrack: React.FC = () => {
  return (
    <>
      {TIMELINE.scenes.map(({ sceneIndex, start }, i) => {
        const scene = SCENES[sceneIndex];
        const nextStart =
          i + 1 < TIMELINE.scenes.length ? TIMELINE.scenes[i + 1].start : TIMELINE.ctaStart;
        const audioDurationInFrames = nextStart - start;
        const clipped = clipSegmentsToFrames(scene.segments, audioDurationInFrames);
        const baseVolume = scene.duckSource ? 0.32 : 1;

        return (
          <Sequence
            key={scene.id}
            from={start}
            durationInFrames={audioDurationInFrames}
            layout="none"
          >
            {renderSegments(clipped, (segment, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === clipped.length - 1;
              const localDur = toFrames(
                (segment.sourceEndSec - segment.sourceStartSec) / (segment.speed ?? 1),
              );

              return (
                <Audio
                  key={idx}
                  src={SOURCE}
                  trimBefore={toFrames(segment.sourceStartSec)}
                  trimAfter={toFrames(segment.sourceEndSec)}
                  playbackRate={segment.speed ?? 1}
                  volume={(f: number) => {
                    let env = 1;
                    if (isFirst) {
                      env = Math.min(
                        env,
                        interpolate(f, [0, FADE], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }),
                      );
                    }
                    if (isLast) {
                      env = Math.min(
                        env,
                        interpolate(f, [localDur - FADE, localDur], [1, 0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }),
                      );
                    }
                    return baseVolume * env;
                  }}
                />
              );
            })}
          </Sequence>
        );
      })}
    </>
  );
};
