import React from "react";

export const TopScrim: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 420,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.0) 100%)",
      pointerEvents: "none",
    }}
  />
);

export const BottomScrim: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 560,
      background:
        "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.0) 100%)",
      pointerEvents: "none",
    }}
  />
);
