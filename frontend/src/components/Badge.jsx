import React from "react";
import { badgeStyle, statusColorMap, colors } from "../styles/theme";

/**
 * Small colored status pill. Looks up color by `status` in the shared
 * statusColorMap (theme.js). Falls back to a neutral slate style for any
 * status string not found in the map.
 */
export default function Badge({ status }) {
  const style = statusColorMap[status] || {
    bg: "#f1f5f9",
    color: colors.textMuted,
  };
  return <span style={badgeStyle(style.bg, style.color)}>{status}</span>;
}
