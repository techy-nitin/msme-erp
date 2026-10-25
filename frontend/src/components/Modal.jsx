import React from "react";
import { X } from "lucide-react";
import { colors } from "../styles/theme";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 16,
  },
  dialog: {
    background: colors.white,
    borderRadius: 16,
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 22px",
    borderBottom: `1px solid ${colors.border}`,
  },
  title: { fontSize: 16, fontWeight: 600, color: colors.textPrimary, margin: 0 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "none",
    background: colors.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: colors.textMuted,
  },
  body: { padding: 22 },
};

/**
 * Generic modal dialog. Renders nothing when `open` is false.
 * Props: open, title, onClose, children (form content), footer (buttons row)
 */
export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div style={styles.overlay} onMouseDown={onClose}>
      <div style={styles.dialog} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button type="button" style={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div style={styles.body}>{children}</div>
        {footer && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              padding: "16px 22px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
