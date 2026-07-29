# Remotion video

Intro video (`Intro` composition) for the "Remotion + Claude Code" video: the
talking-head footage in `public/video/intro-full.mp4` (concatenated from the 4
uploaded takes) plays full-bleed, with icon/text overlays timed to the natural
speech pauses in the audio (detected via `ffmpeg silencedetect`, no live
transcript — see commit message for details). Render with `npx remotion
render Intro out/intro-final.mp4`.

## VerticalReel

Premium 1080×1920 @30fps beat-cut Reels/TikTok edit (`VerticalReel`
composition) built from a single continuous ~73s handheld walkthrough of the
Берлога bathhouse (`public/video/source.mp4`, re-encoded to constant 30fps
from the original ~29.26fps VFR source for frame-accurate trimming).

- `src/edit/editPlan.ts` — the cut list: which source ranges become which
  scenes, at what speed (including two short slow-mo "punch" moments and two
  sped-up connective sections), which transition cuts into each scene, and
  the authored caption copy.
- `src/edit/timeline.ts` — compiles that plan into frame offsets, mirroring
  how `<TransitionSeries>` overlaps consecutive scenes by each transition's
  duration.
- `src/VerticalReel.tsx` — assembles the `<TransitionSeries>` of scenes +
  CTA, a separate non-overlapping audio track (see below), ambient bed,
  grain/vignette, progress bar and scene timecode.
- `src/components/transitions/` — hand-rolled `whipPan` / `punchZoom` /
  `lightLeak` transition presentations. `@remotion/transitions`' canvas-shader
  presentations (`zoomBlur`, `linearBlur`, `filmBurn`, ...) need an
  experimental "HTML in Canvas" Chrome feature not available in this
  environment's headless Chromium, so those three editorial looks are
  reimplemented in plain CSS transform/filter instead. `pushCut` and `fade`
  are the library's (confirmed CSS-only) presentations.
- `src/components/AudioTrack.tsx` — the narration is laid out as a *separate*
  flat, non-overlapping `<Sequence>` stack (not the muted `<Video>` used for
  the picture) that hard-cuts exactly where the visual crossfade begins.
  Reusing the picture's audio directly would mean two adjacent scenes —
  literally consecutive seconds of the same recording — play simultaneously
  during every crossfade, which sounds like the narrator's voice stuttering
  on itself.
- Fonts: Montserrat is self-hosted from `public/fonts/` (downloaded ahead of
  time) and loaded via `@remotion/fonts`' `loadFont()` against a same-origin
  `staticFile()` URL (`src/fonts.ts`) rather than `@remotion/google-fonts`,
  because this environment's headless Chromium doesn't trust the outbound
  proxy's TLS certificate for arbitrary external hosts.
- Whisper transcription (`@remotion/install-whisper-cpp`) was attempted for
  word-accurate captions but the model download (huggingface.co) is blocked
  by this environment's network egress policy. Captions are therefore short
  authored Russian marketing copy synced to real beat timing (`ffmpeg
  silencedetect` on the source audio), not a verbatim transcript.

Render with `npx remotion render VerticalReel out/berloga-vertical-reel.mp4
--crf=16`.


<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
