import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Scene, sceneDurationFrames, toFrames } from "../edit/editPlan";
import { renderSegments } from "../edit/segments";
import { ColorGrade } from "./effects/ColorGrade";
import { KenBurns } from "./effects/KenBurns";
import { ZoomPunch } from "./effects/ZoomPunch";
import { ScreenShake } from "./effects/ScreenShake";
import { Bloom } from "./effects/Bloom";
import { RGBGlitchOverlay } from "./effects/RGBGlitchOverlay";
import { KineticCaption } from "./KineticCaption";
import { TitleCard } from "./TitleCard";

const SOURCE = staticFile("video/source.mp4");

export const SceneVideo: React.FC<{ scene: Scene; fontFamily: string }> = ({
  scene,
  fontFamily,
}) => {
  const durationInFrames = sceneDurationFrames(scene);

  const videoStack = (
    <ColorGrade bias={scene.grade}>
      <KenBurns mode={scene.kenBurns} durationInFrames={durationInFrames}>
        {renderSegments(scene.segments, (segment, i) => (
          <Video
            key={i}
            src={SOURCE}
            muted
            trimBefore={toFrames(segment.sourceStartSec)}
            trimAfter={toFrames(segment.sourceEndSec)}
            playbackRate={segment.speed ?? 1}
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ))}
      </KenBurns>
    </ColorGrade>
  );

  const withShake = scene.screenShake ? <ScreenShake>{videoStack}</ScreenShake> : videoStack;
  const withPunch = scene.zoomPunch ? <ZoomPunch>{withShake}</ZoomPunch> : withShake;
  const withGlitch =
    scene.transitionIn === "pushCut" ? (
      <RGBGlitchOverlay>{withPunch}</RGBGlitchOverlay>
    ) : (
      withPunch
    );

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {withGlitch}
      {scene.bloom && <Bloom />}
      {scene.captions?.map((cue, i) =>
        cue.style === "titleCard" ? (
          <TitleCard
            key={i}
            text={cue.phrase}
            startFrame={toFrames(cue.atSec)}
            fontFamily={fontFamily}
          />
        ) : (
          <KineticCaption
            key={i}
            phrase={cue.phrase}
            accent={cue.accent}
            startFrame={toFrames(cue.atSec)}
            fontFamily={fontFamily}
          />
        ),
      )}
    </AbsoluteFill>
  );
};
