import { Composition, staticFile } from "remotion";
import { IntroComp } from "./IntroComp";
import { FinalComp, finalDurationInFrames } from "./FinalComp";
import { VerticalReel } from "./VerticalReel";
import { WIDTH, HEIGHT, FPS } from "./edit/editPlan";
import { TIMELINE } from "./edit/timeline";

// Duration measured with ffprobe (27.133s @ 30fps).
export const MyComposition = () => {
  return (
    <>
      <Composition
        id="Final"
        component={FinalComp}
        durationInFrames={finalDurationInFrames}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{ videoSrc: staticFile("video/intro-full.mp4") }}
      />
      <Composition
        id="Intro"
        component={IntroComp}
        durationInFrames={814}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{ videoSrc: staticFile("video/intro-full.mp4") }}
      />
      <Composition
        id="VerticalReel"
        component={VerticalReel}
        durationInFrames={TIMELINE.totalDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
