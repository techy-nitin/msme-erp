// ============================================================================
// theme.js — shared design tokens & inline style objects
// Central place for colors, spacing and common component styles so every
// page/component stays visually consistent without duplicating style code.
// ============================================================================

export const colors = {
  bg: "#f8fafc",
  white: "#ffffff",
  border: "#f1f5f9",
  borderStrong: "#e2e8f0",
  textPrimary: "#1e293b",
  textSecondary: "#334155",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primaryLight: "#eff6ff",
  success: "#059669",
  successBg: "#ecfdf5",
  warning: "#d97706",
  warningBg: "#fffbeb",
  danger: "#e11d48",
  dangerBg: "#fef2f2",
};

export const layout = {
  sidebarWidth: 256,
  navbarHeight: 68,
};

export const panel = {
  background: colors.white,
  borderRadius: 16,
  border: `1px solid ${colors.border}`,
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  padding: 20,
};

export const pageWrap = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

export const pageHeaderRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 12,
};

export const pageTitle = {
  fontSize: 22,
  fontWeight: 700,
  color: colors.textPrimary,
  margin: 0,
};

export const toolbarRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 16,
};

export const searchWrap = {
  position: "relative",
  flex: 1,
  minWidth: 220,
  maxWidth: 320,
};

export const searchIcon = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: colors.textFaint,
};

export const searchInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px 9px 36px",
  borderRadius: 12,
  background: colors.white,
  border: `1px solid ${colors.borderStrong}`,
  fontSize: 14,
  outline: "none",
};

export const toolbarRight = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

export const primaryButton = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: colors.primary,
  color: colors.white,
  fontSize: 14,
  fontWeight: 500,
  borderRadius: 10,
  border: "none",
  padding: "9px 16px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export const secondaryButton = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: colors.primaryLight,
  color: colors.primaryDark,
  fontSize: 14,
  fontWeight: 500,
  borderRadius: 10,
  border: "none",
  padding: "9px 16px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export const iconButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  background: colors.white,
  cursor: "pointer",
  color: colors.textMuted,
};

export const table = {
  width: "100%",
  fontSize: 14,
  borderCollapse: "collapse",
  minWidth: 720,
};

export const th = {
  textAlign: "left",
  color: colors.textFaint,
  fontWeight: 500,
  fontSize: 12.5,
  textTransform: "uppercase",
  letterSpacing: 0.3,
  padding: "10px 12px",
  borderBottom: `1px solid ${colors.border}`,
  whiteSpace: "nowrap",
};

export const td = {
  padding: "12px 12px",
  borderBottom: `1px solid ${colors.border}`,
  color: colors.textSecondary,
};

export const tdBold = {
  ...td,
  fontWeight: 600,
  color: colors.textPrimary,
};

export const tdMuted = {
  ...td,
  color: colors.textMuted,
};

export const tableWrap = {
  overflowX: "auto",
};

export const actionCell = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

export const statsRow = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
};

export const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

export const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

export const formLabel = {
  fontSize: 13,
  fontWeight: 500,
  color: colors.textMuted,
};

export const formInput = {
  padding: "9px 12px",
  borderRadius: 10,
  border: `1px solid ${colors.borderStrong}`,
  fontSize: 14,
  outline: "none",
  color: colors.textSecondary,
  background: colors.white,
};

export function badgeStyle(bg, color) {
  return {
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    background: bg,
    color,
    display: "inline-block",
    whiteSpace: "nowrap",
  };
}

// Status → color mapping reused across Clients, Invoices, Payments, Quotations, Employees
export const statusColorMap = {
  Active: { bg: colors.successBg, color: colors.success },
  Inactive: { bg: "#f1f5f9", color: colors.textMuted },
  Paid: { bg: colors.successBg, color: colors.success },
  Pending: { bg: colors.warningBg, color: colors.warning },
  Overdue: { bg: colors.dangerBg, color: colors.danger },
  Approved: { bg: colors.successBg, color: colors.success },
  Draft: { bg: "#f1f5f9", color: colors.textMuted },
  Rejected: { bg: colors.dangerBg, color: colors.danger },
  "In Stock": { bg: colors.successBg, color: colors.success },
  "Low Stock": { bg: colors.warningBg, color: colors.warning },
  "Out of Stock": { bg: colors.dangerBg, color: colors.danger },
};
