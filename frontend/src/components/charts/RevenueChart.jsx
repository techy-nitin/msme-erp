import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import PanelHeader from "../PanelHeader";
import Dropdown from "../Dropdown";
import { panel } from "../../styles/theme";

const chartFilterOptions = ["Today", "Weekly", "Monthly", "Yearly"];

const revenueDataByFilter = {
  Today: [
    { label: "9AM", value: 8 },
    { label: "11AM", value: 14 },
    { label: "1PM", value: 22 },
    { label: "3PM", value: 18 },
    { label: "5PM", value: 27 },
    { label: "7PM", value: 20 },
  ],
  Weekly: [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 58 },
    { label: "Wed", value: 51 },
    { label: "Thu", value: 67 },
    { label: "Fri", value: 74 },
    { label: "Sat", value: 40 },
    { label: "Sun", value: 22 },
  ],
  Monthly: [
    { label: "Jan", value: 120 },
    { label: "Feb", value: 145 },
    { label: "Mar", value: 165 },
    { label: "Apr", value: 150 },
    { label: "May", value: 190 },
    { label: "Jun", value: 210 },
  ],
  Yearly: [
    { label: "2021", value: 850 },
    { label: "2022", value: 1120 },
    { label: "2023", value: 1430 },
    { label: "2024", value: 1780 },
    { label: "2025", value: 2100 },
  ],
};

/**
 * Revenue Overview panel — area chart + Today/Weekly/Monthly/Yearly filter.
 * Swap `revenueDataByFilter` for an API-backed fetch keyed on the same
 * filter values when the backend is ready.
 */
export default function RevenueChart() {
  const [chartFilter, setChartFilter] = useState("Monthly");

  const data = useMemo(
    () => revenueDataByFilter[chartFilter] || revenueDataByFilter.Monthly,
    [chartFilter]
  );

  return (
    <div style={panel}>
      <PanelHeader
        title="Revenue Overview"
        action={
          <Dropdown value={chartFilter} options={chartFilterOptions} onChange={setChartFilter} />
        }
      />
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
