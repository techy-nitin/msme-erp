import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";
import PanelHeader from "../PanelHeader";
import { panel, colors } from "../../styles/theme";

const paymentStatusData = [
  { name: "Paid", value: 58, color: "#2563eb" },
  { name: "Pending", value: 27, color: "#93c5fd" },
  { name: "Overdue", value: 15, color: "#f87171" },
];

const styles = {
  legendList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 8,
    fontSize: 12,
    color: colors.textMuted,
  },
  legendItemRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendLabel: { display: "flex", alignItems: "center", gap: 6 },
  legendDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
  }),
  legendValue: { fontWeight: 500, color: colors.textSecondary },
};

/**
 * Payment Status donut chart (Paid / Pending / Overdue) + legend with %.
 */
export default function PaymentPieChart() {
  return (
    <div style={panel}>
      <PanelHeader
        title="Payment Status"
        action={<MoreHorizontal size={16} color={colors.textFaint} />}
      />
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={paymentStatusData}
              dataKey="value"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
            >
              {paymentStatusData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={styles.legendList}>
        {paymentStatusData.map((d) => (
          <div key={d.name} style={styles.legendItemRow}>
            <span style={styles.legendLabel}>
              <span style={styles.legendDot(d.color)} />
              {d.name}
            </span>
            <span style={styles.legendValue}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
