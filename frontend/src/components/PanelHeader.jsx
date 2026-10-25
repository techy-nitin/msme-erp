import React from "react";
import { colors } from "../styles/theme";

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontWeight: 600,
    color: colors.textPrimary,
    fontSize: 15,
    margin: 0,
  },
};

/**
 * Standard panel/card header: bold title on the left, optional action
 * element (dropdown, icon button, link, etc.) on the right.
 */
export default function PanelHeader({ title, action }) {
  return (
    <div style={styles.row}>
      <h3 style={styles.title}>{title}</h3>
      {action}
    </div>
  );
}
