// Data-driven cut list for the "VerticalReel" composition.
//
// The source is a single continuous 73s handheld walkthrough (no in-camera
// cuts). All "editing" happens here: we choose which ranges of that one
// take to show, at what speed, and which transition bridges each pair of
// scenes. Timestamps are against public/video/source.mp4, a constant-30fps
// re-encode of the original (native ~29.26fps VFR) so that trimBefore/
// trimAfter land on exact frames.
//
// Beat timing (scene boundaries, caption entry points) was derived from
// `ffmpeg silencedetect` on the source audio, not from a word-level
// transcript: Whisper transcription was attempted (@remotion/install-whisper-cpp)
// but the model download (huggingface.co) is blocked by this environment's
// network egress policy. Captions below are therefore short authored
// Russian marketing copy synced to the real phrase-pause grid, not a
// verbatim transcript.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const toFrames = (seconds: number) => Math.round(seconds * FPS);

export type Segment = {
  /** Start of this slice in source seconds (source.mp4, 30fps CFR). */
  sourceStartSec: number;
  sourceEndSec: number;
  /** Playback rate for this slice. 1 = normal, <1 = slow-mo, >1 = sped up. */
  speed?: number;
};

export type TransitionKind = "whipPan" | "punchZoom" | "lightLeak" | "pushCut" | "fade";

export type CaptionCue = {
  phrase: string;
  /** Words (must match tokens in `phrase`) to render in the accent color. */
  accent?: string[];
  /** Seconds from scene start when the caption should begin revealing. */
  atSec: number;
  style?: "kinetic" | "titleCard";
};

export type Scene = {
  id: string;
  segments: Segment[];
  /** Transition used to CUT INTO this scene. Omit for the first scene. */
  transitionIn?: TransitionKind;
  transitionDurationSec?: number;
  captions?: CaptionCue[];
  kenBurns?: "in" | "out" | "pan-left" | "pan-right" | "none";
  zoomPunch?: boolean;
  screenShake?: boolean;
  bloom?: boolean;
  grade?: "warm" | "cool" | "neutral";
  /** Duck the source clip's own audio and swell the ambient bed instead. */
  duckSource?: boolean;
};

export const TRANSITION_DEFAULT_SEC: Record<TransitionKind, number> = {
  whipPan: 0.32,
  punchZoom: 0.4,
  lightLeak: 0.5,
  pushCut: 0.24,
  fade: 0.5,
};

export const sceneDurationSec = (scene: Scene) =>
  scene.segments.reduce(
    (sum, seg) => sum + (seg.sourceEndSec - seg.sourceStartSec) / (seg.speed ?? 1),
    0,
  );

// Sums each segment's independently-rounded frame count (rather than
// rounding the scene's total duration once) so this matches exactly what
// renderSegments() (segments.tsx) lays out — otherwise a multi-segment
// scene's TransitionSeries.Sequence container could be a frame longer or
// shorter than its actual rendered content.
export const sceneDurationFrames = (scene: Scene) =>
  scene.segments.reduce(
    (sum, seg) => sum + toFrames((seg.sourceEndSec - seg.sourceStartSec) / (seg.speed ?? 1)),
    0,
  );

export const transitionFrames = (scene: Scene) =>
  scene.transitionIn
    ? toFrames(scene.transitionDurationSec ?? TRANSITION_DEFAULT_SEC[scene.transitionIn])
    : 0;

export const SCENES: Scene[] = [
  {
    id: "hook",
    segments: [{ sourceStartSec: 0.0, sourceEndSec: 3.15 }],
    captions: [
      {
        phrase: "БАНЯ, КОТОРУЮ ТЫ ИСКАЛ",
        accent: ["ИСКАЛ"],
        atSec: 0.12,
        style: "kinetic",
      },
    ],
    kenBurns: "in",
    grade: "neutral",
  },
  {
    id: "entrance",
    segments: [{ sourceStartSec: 3.15, sourceEndSec: 14.7 }],
    transitionIn: "whipPan",
    captions: [
      { phrase: "Банный комплекс «Берлога»", atSec: 0.1, style: "titleCard" },
      {
        phrase: "Зал для чаепития и застолий",
        accent: ["застолий"],
        atSec: 5.6,
        style: "kinetic",
      },
    ],
    kenBurns: "in",
    grade: "warm",
  },
  {
    id: "pool",
    segments: [
      { sourceStartSec: 14.7, sourceEndSec: 17.3 },
      { sourceStartSec: 17.3, sourceEndSec: 18.3, speed: 0.6 },
      { sourceStartSec: 18.3, sourceEndSec: 29.0 },
    ],
    transitionIn: "punchZoom",
    zoomPunch: true,
    bloom: true,
    grade: "cool",
    captions: [
      {
        phrase: "Купель под открытым небом",
        accent: ["Купель"],
        atSec: 2.4,
        style: "kinetic",
      },
    ],
  },
  {
    id: "corridor",
    segments: [{ sourceStartSec: 29.0, sourceEndSec: 33.3, speed: 2.2 }],
    transitionIn: "pushCut",
    duckSource: true,
    grade: "neutral",
  },
  {
    id: "lounge",
    segments: [{ sourceStartSec: 33.3, sourceEndSec: 44.0 }],
    transitionIn: "whipPan",
    zoomPunch: true,
    kenBurns: "pan-left",
    grade: "warm",
    captions: [
      { phrase: "Зона отдыха", atSec: 0.15, style: "titleCard" },
      {
        phrase: "Атмосфера, а не просто баня",
        accent: ["Атмосфера"],
        atSec: 6.2,
        style: "kinetic",
      },
    ],
  },
  {
    id: "shower",
    segments: [{ sourceStartSec: 44.0, sourceEndSec: 53.3 }],
    transitionIn: "lightLeak",
    grade: "neutral",
    captions: [
      {
        phrase: "Комнаты подготовки",
        atSec: 2.6,
        style: "kinetic",
      },
    ],
  },
  {
    id: "sauna",
    segments: [
      { sourceStartSec: 53.3, sourceEndSec: 56.0 },
      { sourceStartSec: 56.0, sourceEndSec: 57.2, speed: 0.55 },
      { sourceStartSec: 57.2, sourceEndSec: 59.3 },
    ],
    transitionIn: "pushCut",
    screenShake: true,
    bloom: true,
    grade: "warm",
    captions: [
      {
        phrase: "Настоящий жар",
        accent: ["жар"],
        atSec: 1.1,
        style: "kinetic",
      },
    ],
  },
  {
    id: "transit",
    segments: [{ sourceStartSec: 59.3, sourceEndSec: 65.3, speed: 1.8 }],
    transitionIn: "whipPan",
    duckSource: true,
    grade: "neutral",
  },
  {
    id: "loft",
    segments: [{ sourceStartSec: 65.3, sourceEndSec: 72.0 }],
    transitionIn: "lightLeak",
    kenBurns: "in",
    grade: "warm",
    captions: [
      {
        phrase: "Мансарда для отдыха",
        accent: ["Мансарда"],
        atSec: 0.9,
        style: "kinetic",
      },
    ],
  },
];

export const CTA_DURATION_SEC = 3.0;
export const CTA_TRANSITION: TransitionKind = "fade";
