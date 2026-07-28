import React from "react";

// Custom pictograms (not brand logos) representing Remotion and Claude Code
// so we don't reproduce trademarked marks.

export const RemotionGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 26,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill={color} />
  </svg>
);

export const ClaudeGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 26,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 4L4 20M15.5 4L20 20M6 14H18"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Generic "video platform" play glyph (not a reproduction of any brand mark).
export const PlayPlatformGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 26,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="5" stroke={color} strokeWidth="2" />
    <path d="M10.5 9L15.5 12L10.5 15V9Z" fill={color} />
  </svg>
);
