import React from "react";
import { colors } from "../styles/theme";

const styles = {
  card: {
    flex: 1,
    minWidth: 170,
    borderRadius: 16,
    background: colors.white,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    padding: "16px 20px",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: colors.primaryLight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  valueRow: { display: "flex", alignItems: "baseline", gap: 8 },
  value: { fontSize: 20, fontWeight: 600, color: colors.textPrimary },
  badge: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.success,
    background: colors.successBg,
    padding: "2px 6px",
    borderRadius: 6,
  },
};

/**
 * KPI card used across Dashboard, Accounts, Reports, etc.
 * Props: label, value, icon (lucide component), badge (optional growth chip)
 */
export default function StatCard({ label, value, icon: Icon, badge }) {
  return (
    <div style={styles.card}>
      <div style={styles.labelRow}>
        <span>{label}</span>
        <div style={styles.iconBox}>
          <Icon size={16} color={colors.primary} />
        </div>
      </div>
      <div style={styles.valueRow}>
        <span style={styles.value}>{value}</span>
        {badge && <span style={styles.badge}>{badge}</span>}
      </div>
    </div>
  );
}
