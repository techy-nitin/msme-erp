import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Users,
  UserCircle2,
  IndianRupee,
  Banknote,
  ClipboardList,
  Receipt,
  MoreHorizontal,
  UserPlus,
  FilePlus2,
  ReceiptText,
  CircleDollarSign,
} from "lucide-react";

import StatCard from "../components/StatCard";
import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";
import Badge from "../components/Badge";
import RevenueChart from "../components/charts/RevenueChart";
import PaymentPieChart from "../components/charts/PaymentPieChart";
import { getDashboardData } from "../Services/Api";
import {
  colors,
  panel,
  pageWrap,
  statsRow,
  primaryButton,
  secondaryButton,
} from "../styles/theme";

const dashboardFilterOptions = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "This Year",
  "Custom Range",
];

const styles = {
  overviewRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  overviewTitle: { fontWeight: 600, color: colors.textPrimary, margin: 0 },
  filterLabelWrap: { display: "flex", alignItems: "center", gap: 8, fontSize: 14 },
  filterLabel: { color: colors.textFaint },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  pendingList: { display: "flex", flexDirection: "column" },
  pendingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: `1px solid ${colors.border}`,
    gap: 12,
    flexWrap: "wrap",
  },
  pendingClient: { fontSize: 14, fontWeight: 500, color: colors.textSecondary, margin: 0 },
  pendingInvoice: { fontSize: 12, color: colors.textFaint, margin: 0 },
  pendingAmount: { fontSize: 14, fontWeight: 600, color: colors.textSecondary, minWidth: 90 },
  pendingDue: { fontSize: 12, color: colors.textMuted, minWidth: 110 },
  quickActionsList: { display: "flex", flexDirection: "column", gap: 10 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", fontSize: 14, borderCollapse: "collapse", minWidth: 700 },
  th: {
    textAlign: "left",
    color: colors.textFaint,
    fontWeight: 500,
    padding: "8px 0",
    borderBottom: `1px solid ${colors.border}`,
  },
  td: { padding: "12px 0", borderBottom: `1px solid ${colors.border}`, color: colors.textSecondary },
  tdBold: {
    padding: "12px 0",
    borderBottom: `1px solid ${colors.border}`,
    fontWeight: 500,
    color: colors.textSecondary,
  },
  tdMuted: { padding: "12px 0", borderBottom: `1px solid ${colors.border}`, color: colors.textMuted },
  statusText: { fontSize: 14, color: colors.textSecondary, padding: "16px 0" },
  errorText: { color: "#dc2626", fontSize: 14, padding: "16px 0" },
};

export default function Dashboard() {
  const navigate = useNavigate(); // Hook initialization
  const [dashboardFilter, setDashboardFilter] = useState("Today");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        const response = await getDashboardData(dashboardFilter);
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch dashboard metrics. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [dashboardFilter]);

  if (loading) {
    return (
      <div style={pageWrap}>
        <p style={styles.statusText}>Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageWrap}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  const metrics = data || {};
  const pendingPaymentsList = metrics.pendingPayments || [];
  const recentInvoicesList = metrics.recentInvoices || [];

  return (
    <div style={pageWrap}>
      {/* Global dashboard filter */}
      <div style={styles.overviewRow}>
        <h2 style={styles.overviewTitle}>Overview</h2>
        <div style={styles.filterLabelWrap}>
          <span style={styles.filterLabel}>Show data for</span>
          <Dropdown
            value={dashboardFilter}
            options={dashboardFilterOptions}
            onChange={setDashboardFilter}
          />
        </div>
      </div>

      {/* Stat cards */}
      <div style={statsRow}>
        <StatCard 
          label="Total Clients" 
          value={metrics.totalClients ?? 0} 
          icon={Users} 
        />
        <StatCard 
          label="Total Employees" 
          value={metrics.totalEmployees ?? 0} 
          icon={UserCircle2} 
        />
        <StatCard 
          label="Total Revenue" 
          value={`₹${Number(metrics.totalRevenue || 0).toLocaleString("en-IN")}`} 
          icon={IndianRupee} 
        />
        <StatCard 
          label="Outstanding Payments" 
          value={`₹${Number(metrics.outstandingPayments || 0).toLocaleString("en-IN")}`} 
          icon={Banknote} 
        />
        <StatCard 
          label="Pending Quotations" 
          value={metrics.pendingQuotations ?? 0} 
          icon={ClipboardList} 
        />
        <StatCard 
          label="Total Invoices" 
          value={metrics.totalInvoices ?? 0} 
          icon={Receipt} 
        />
      </div>

      {/* Charts */}
      <div style={styles.chartsRow}>
        <RevenueChart />
        <PaymentPieChart />
      </div>

      {/* Pending Payments + Quick Actions */}
      <div style={styles.bottomRow}>
        <div style={panel}>
          <PanelHeader
            title="Pending Payments"
            action={<MoreHorizontal size={16} color={colors.textFaint} />}
          />
          <div style={styles.pendingList}>
            {pendingPaymentsList.length === 0 ? (
              <p style={styles.statusText}>No pending payments.</p>
            ) : (
              pendingPaymentsList.map((p, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.pendingRow,
                    borderBottom: i === pendingPaymentsList.length - 1 ? "none" : styles.pendingRow.borderBottom,
                  }}
                >
                  <div style={{ minWidth: 140 }}>
                    <p style={styles.pendingClient}>{p.clientName}</p>
                    <p style={styles.pendingInvoice}>{p.invoiceNumber}</p>
                  </div>
                  <div style={styles.pendingAmount}>
                    ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                  </div>
                  <div style={styles.pendingDue}>Due {p.dueDate}</div>
                  <Badge status={p.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Panel with Active Navigation */}
        <div style={panel}>
          <PanelHeader title="Quick Actions" />
          <div style={styles.quickActionsList}>
            <button 
              type="button" 
              style={primaryButton} 
              onClick={() => navigate("/clients")}
            >
              <UserPlus size={16} /> Add Client
            </button>
            <button 
              type="button" 
              style={secondaryButton} 
              onClick={() => navigate("/quotations")}
            >
              <FilePlus2 size={16} /> Create Quotation
            </button>
            <button 
              type="button" 
              style={secondaryButton} 
              onClick={() => navigate("/invoices")}
            >
              <ReceiptText size={16} /> Generate Invoice
            </button>
            <button 
              type="button" 
              style={secondaryButton} 
              onClick={() => navigate("/payments")}
            >
              <CircleDollarSign size={16} /> Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div style={panel}>
        <PanelHeader
          title="Recent Invoices"
          action={<MoreHorizontal size={16} color={colors.textFaint} />}
        />
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice Number</th>
                <th style={styles.th}>Client Name</th>
                <th style={styles.th}>Invoice Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Payment Status</th>
                <th style={styles.th}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoicesList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.statusText}>No recent invoices found.</td>
                </tr>
              ) : (
                recentInvoicesList.map((inv) => (
                  <tr key={inv.invoiceNumber}>
                    <td style={styles.tdBold}>{inv.invoiceNumber}</td>
                    <td style={styles.td}>{inv.customerName}</td>
                    <td style={styles.tdMuted}>{inv.invoiceDate}</td>
                    <td style={styles.tdBold}>
                      ₹{Number(inv.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td style={styles.td}>
                      <Badge status={inv.status} />
                    </td>
                    <td style={styles.tdMuted}>{inv.dueDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}