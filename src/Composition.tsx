import { Composition, staticFile } from "remotion";
import { IntroComp } from "./IntroComp";
import { FinalComp, finalDurationInFrames } from "./FinalComp";

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
    </>
  );
};
