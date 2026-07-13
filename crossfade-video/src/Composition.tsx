import {
  Composition,
  Sequence,
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Video } from "@remotion/media";

const FPS = 30;
const CLIP_A_FRAMES = Math.round(4 * FPS);      // 120 frames
const CLIP_B_FRAMES = Math.round(4 * FPS);      // 120 frames
const CROSSFADE_FRAMES = Math.round(0.3 * FPS); // 9 frames
const TOTAL_FRAMES = CLIP_A_FRAMES + CLIP_B_FRAMES - CROSSFADE_FRAMES; // 231
const TRANSITION_START = CLIP_A_FRAMES - CROSSFADE_FRAMES; // 111

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

const ClipA: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [TRANSITION_START, CLIP_A_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Video
      src={staticFile("audio_a.mp4")}
      style={{ width: "100%", height: "100%", opacity }}
      volume={(f) =>
        interpolate(f, [TRANSITION_START, CLIP_A_FRAMES], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

const ClipB: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Video
      src={staticFile("audio_b.mp4")}
      style={{ width: "100%", height: "100%", opacity }}
      volume={(f) =>
        interpolate(f, [0, CROSSFADE_FRAMES], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

const AudioCrossfadeVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={CLIP_A_FRAMES}>
        <ClipA />
      </Sequence>
      <Sequence from={TRANSITION_START} durationInFrames={CLIP_B_FRAMES}>
        <ClipB />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <>
      <Composition
        id="CrossfadeVideo"
        component={CrossfadeVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="AudioCrossfadeVideo"
        component={AudioCrossfadeVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
