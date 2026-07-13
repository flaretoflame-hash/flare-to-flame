import { Composition } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

const FPS = 30;
const CLIP_A_FRAMES = Math.round(4 * FPS);      // 120 frames
const CLIP_B_FRAMES = Math.round(4 * FPS);      // 120 frames
const CROSSFADE_FRAMES = Math.round(0.3 * FPS); // 9 frames
const TOTAL_FRAMES = CLIP_A_FRAMES + CLIP_B_FRAMES - CROSSFADE_FRAMES; // 231

const CrossfadeVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Clip A" durationInFrames={CLIP_A_FRAMES}>
        <Video src={staticFile("prod_a.mp4")} style={{ width: "100%", height: "100%" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: CROSSFADE_FRAMES })}
      />
      <TransitionSeries.Sequence name="Clip B" durationInFrames={CLIP_B_FRAMES}>
        <Video src={staticFile("prod_b.mp4")} style={{ width: "100%", height: "100%" }} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="CrossfadeVideo"
      component={CrossfadeVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
