import React from "react";
import { Sequence } from "remotion";
import { FPS, Segment, toFrames } from "./editPlan";

// Lays out a scene's speed-stepped segments back to back as local
// <Sequence> children (frame 0 = scene start). Shared by the muted video
// layer and the separate audio layer so both stay frame-identical.
export const renderSegments = (
  segments: Segment[],
  render: (segment: Segment, index: number) => React.ReactNode,
): React.ReactNode[] => {
  let cursor = 0;
  return segments.map((segment, i) => {
    const localDurationInFrames = toFrames(
      (segment.sourceEndSec - segment.sourceStartSec) / (segment.speed ?? 1),
    );
    const node = (
      <Sequence key={i} from={cursor} durationInFrames={localDurationInFrames} layout="none">
        {render(segment, i)}
      </Sequence>
    );
    cursor += localDurationInFrames;
    return node;
  });
};

// Truncates a segment list so its total local duration doesn't exceed
// maxFrames, shrinking (not dropping, unless already exhausted) the
// segment that straddles the cutoff. Used to fit the audio layer's
// non-overlapping scene window (shorter than the visual scene by the
// next scene's transition length — see timeline.ts).
export const clipSegmentsToFrames = (segments: Segment[], maxFrames: number): Segment[] => {
  const result: Segment[] = [];
  let used = 0;

  for (const segment of segments) {
    const speed = segment.speed ?? 1;
    const segmentFrames = toFrames((segment.sourceEndSec - segment.sourceStartSec) / speed);

    if (used + segmentFrames <= maxFrames) {
      result.push(segment);
      used += segmentFrames;
      continue;
    }

    const remaining = maxFrames - used;
    if (remaining > 0) {
      const remainingSourceSeconds = (remaining / FPS) * speed;
      result.push({ ...segment, sourceEndSec: segment.sourceStartSec + remainingSourceSeconds });
    }
    break;
  }

  return result;
};
