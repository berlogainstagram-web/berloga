import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Montserrat, downloaded ahead of time into public/fonts (see README /
// commit message) and loaded here via the browser FontFace API against a
// same-origin staticFile() URL. We deliberately don't use
// @remotion/google-fonts: this environment's headless Chromium doesn't
// trust the outbound proxy's TLS certificate for arbitrary external hosts,
// so a live fonts.gstatic.com fetch fails render with
// ERR_CERT_AUTHORITY_INVALID. A same-origin local file has no such issue.
const WEIGHTS = ["700", "800", "900"] as const;
const SUBSETS = ["cyrillic", "latin"] as const;

const CYRILLIC_RANGE = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";
const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+2215";

export const MONTSERRAT = "'Montserrat', 'Liberation Sans', 'DejaVu Sans', Arial, sans-serif";

export const fontsLoaded = Promise.all(
  WEIGHTS.flatMap((weight) =>
    SUBSETS.map((subset) =>
      loadFont({
        family: "Montserrat",
        url: staticFile(`fonts/montserrat-${weight}-${subset}.woff2`),
        weight,
        unicodeRange: subset === "cyrillic" ? CYRILLIC_RANGE : LATIN_RANGE,
        display: "block",
      }),
    ),
  ),
);
