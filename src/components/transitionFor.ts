import type { TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { pushCut } from "@remotion/transitions/push-cut";
import { whipPan } from "./transitions/whipPan";
import { punchZoom } from "./transitions/punchZoom";
import { lightLeak } from "./transitions/lightLeak";
import { TransitionKind } from "../edit/editPlan";
import { theme } from "../theme";

// Maps our editorial transition names to their presentations. fade and
// pushCut come from @remotion/transitions (confirmed CSS-only, no canvas
// dependency); whipPan/punchZoom/lightLeak are hand-rolled (see
// transitions/whipPan.tsx) because @remotion/transitions' shader
// presentations (zoomBlur, linearBlur, filmBurn, ...) need an experimental
// Chrome "HTML in Canvas" feature this environment's headless Chromium
// doesn't have.
export const presentationFor = (
  kind: TransitionKind,
): TransitionPresentation<Record<string, unknown>> => {
  switch (kind) {
    case "whipPan":
      return whipPan({ direction: "left" });
    case "punchZoom":
      return punchZoom();
    case "lightLeak":
      return lightLeak();
    case "pushCut":
      return pushCut({ flashColor: theme.text, flashOpacity: 0.45, flashFrames: 3 });
    case "fade":
    default:
      return fade();
  }
};
