import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  Users,
  Package,
  LayoutList,
  FileText,
  Receipt,
  Wallet,
  BookOpenCheck,
  UserCircle2,
  FileBarChart2,
  Settings,
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  KeyRound,
  LogOut,
  UserPlus,
  FilePlus2,
  ReceiptText,
  CircleDollarSign,
  IndianRupee,
  Banknote,
  ClipboardList,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ============================================================================
// MOCK DATA — swap these for API calls when backend is ready
// ============================================================================

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

const paymentStatusData = [
  { name: "Paid", value: 58, color: "#2563eb" },
  { name: "Pending", value: 27, color: "#93c5fd" },
  { name: "Overdue", value: 15, color: "#f87171" },
];

const pendingPayments = [
  {
    client: "Sharma Traders",
    invoice: "INV-1042",
    amount: "₹28,500",
    due: "Jul 18, 2026",
    status: "Pending",
  },
  {
    client: "Verma Textiles",
    invoice: "INV-1039",
    amount: "₹64,200",
    due: "Jul 10, 2026",
    status: "Overdue",
  },
  {
    client: "Kapoor Enterprises",
    invoice: "INV-1035",
    amount: "₹12,900",
    due: "Jul 22, 2026",
    status: "Pending",
  },
];

const recentInvoices = [
  {
    invoice: "INV-1042",
    client: "Sharma Traders",
    date: "Jul 8, 2026",
    amount: "₹28,500",
    status: "Pending",
    due: "Jul 18, 2026",
  },
  {
    invoice: "INV-1041",
    client: "Ananya Retail Co.",
    date: "Jul 6, 2026",
    amount: "₹52,000",
    status: "Paid",
    due: "Jul 6, 2026",
  },
  {
    invoice: "INV-1039",
    client: "Verma Textiles",
    date: "Jun 28, 2026",
    amount: "₹64,200",
    status: "Overdue",
    due: "Jul 10, 2026",
  },
];

const statusColors = {
  Paid: { bg: "#ecfdf5", color: "#059669" },
  Pending: { bg: "#fffbeb", color: "#d97706" },
  Overdue: { bg: "#fef2f2", color: "#e11d48" },
};

// ============================================================================
// NAVIGATION
// ============================================================================

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: Users, label: "Clients" },
  { icon: Package, label: "Products" },
  { icon: LayoutList, label: "Categories" },
  { icon: FileText, label: "Quotations" },
  { icon: Receipt, label: "Invoices" },
  { icon: Wallet, label: "Payments" },
  { icon: BookOpenCheck, label: "Accounts" },
  { icon: UserCircle2, label: "Employees" },
  { icon: FileBarChart2, label: "Reports" },
   { icon: Wallet, label: "Expenses" },
  { icon: Settings, label: "Company Settings" },
];

// ============================================================================
// STYLE OBJECTS — inline CSS, no Tailwind dependency
// ============================================================================

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#f8fafc",
    display: "flex",
    color: "#334155",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    width: 256,
    flexShrink: 0,
    background: "#ffffff",
    borderRight: "1px solid #f1f5f9",
    padding: "20px 16px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 8px",
    marginBottom: 32,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: { fontWeight: 600, color: "#1e293b", fontSize: 18 },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    overflowY: "auto",
  },
  navButton: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    width: "100%",
    background: active ? "#2563eb" : "transparent",
    color: active ? "#ffffff" : "#64748b",
    boxShadow: active ? "0 1px 3px rgba(37,99,235,0.3)" : "none",
  }),
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    width: "100%",
    background: "transparent",
    color: "#e11d48",
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  main: {
    flex: 1,
    padding: "24px 32px",
    maxWidth: 1400,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
    flexWrap: "wrap",
  },
  pageTitle: { fontSize: 24, fontWeight: 700, color: "#1e293b", margin: 0 },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  searchWrap: { position: "relative", width: "100%", maxWidth: 260 },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 12px 8px 36px",
    borderRadius: 12,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
  },
  bellButton: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    fontSize: 10,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileRow: { display: "flex", alignItems: "center", gap: 8, paddingLeft: 4 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 600,
    color: "#1d4ed8",
  },
  profileName: { fontSize: 14, fontWeight: 500, color: "#334155" },
  overviewRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  overviewTitle: { fontWeight: 600, color: "#1e293b", margin: 0 },
  filterLabelWrap: { display: "flex", alignItems: "center", gap: 8, fontSize: 14 },
  filterLabel: { color: "#94a3b8" },
  dropdownWrap: { position: "relative" },
  dropdownButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#475569",
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    marginTop: 4,
    width: 176,
    background: "#ffffff",
    border: "1px solid #f1f5f9",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
    padding: "4px 0",
    zIndex: 20,
  },
  dropdownItem: (activeItem) => ({
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 500,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: activeItem ? "#2563eb" : "#475569",
  }),
  statsRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 },
  statCard: {
    flex: 1,
    minWidth: 170,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    padding: "16px 20px",
  },
  statLabelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#64748b",
    fontSize: 14,
    marginBottom: 8,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValueRow: { display: "flex", alignItems: "baseline", gap: 8 },
  statValue: { fontSize: 20, fontWeight: 600, color: "#1e293b" },
  statBadge: {
    fontSize: 12,
    fontWeight: 500,
    color: "#10b981",
    background: "#ecfdf5",
    padding: "2px 6px",
    borderRadius: 6,
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginBottom: 24,
  },
  panel: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    padding: 20,
  },
  panelHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  panelTitle: { fontWeight: 600, color: "#1e293b", fontSize: 15, margin: 0 },
  legendList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 8,
    fontSize: 12,
    color: "#64748b",
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
  legendValue: { fontWeight: 500, color: "#475569" },
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginBottom: 24,
  },
  pendingList: { display: "flex", flexDirection: "column" },
  pendingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f8fafc",
    gap: 12,
    flexWrap: "wrap",
  },
  pendingClient: { fontSize: 14, fontWeight: 500, color: "#334155", margin: 0 },
  pendingInvoice: { fontSize: 12, color: "#94a3b8", margin: 0 },
  pendingAmount: {
    fontSize: 14,
    fontWeight: 600,
    color: "#334155",
    minWidth: 90,
  },
  pendingDue: { fontSize: 12, color: "#64748b", minWidth: 110 },
  badge: (bg, color) => ({
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    background: bg,
    color: color,
  }),
  quickActionsList: { display: "flex", flexDirection: "column", gap: 10 },
  primaryActionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 12,
    border: "none",
    padding: "10px 0",
    cursor: "pointer",
    width: "100%",
  },
  secondaryActionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 12,
    border: "none",
    padding: "10px 0",
    cursor: "pointer",
    width: "100%",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", fontSize: 14, borderCollapse: "collapse", minWidth: 700 },
  th: {
    textAlign: "left",
    color: "#94a3b8",
    fontWeight: 500,
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  td: { padding: "12px 0", borderBottom: "1px solid #f8fafc", color: "#334155" },
  tdBold: {
    padding: "12px 0",
    borderBottom: "1px solid #f8fafc",
    fontWeight: 500,
    color: "#334155",
  },
  tdMuted: {
    padding: "12px 0",
    borderBottom: "1px solid #f8fafc",
    color: "#64748b",
  },
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

function StatCard({ label, value, icon: Icon, badge }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabelRow}>
        <span>{label}</span>
        <div style={styles.statIconBox}>
          <Icon size={16} color="#2563eb" />
        </div>
      </div>
      <div style={styles.statValueRow}>
        <span style={styles.statValue}>{value}</span>
        {badge && <span style={styles.statBadge}>{badge}</span>}
      </div>
    </div>
  );
}

function PanelHeader({ title, action }) {
  return (
    <div style={styles.panelHeaderRow}>
      <h3 style={styles.panelTitle}>{title}</h3>
      {action}
    </div>
  );
}

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.dropdownWrap}>
      <button style={styles.dropdownButton} onClick={() => setOpen((o) => !o)}>
        {value}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div style={styles.dropdownMenu}>
          {options.map((opt) => (
            <button
              key={opt}
              style={styles.dropdownItem(opt === value)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function MSMEDashboard() {
  const [dashboardFilter, setDashboardFilter] = useState("Today");
  const [chartFilter, setChartFilter] = useState("Monthly");

  const revenueData = useMemo(
    () => revenueDataByFilter[chartFilter] || revenueDataByFilter.Monthly,
    [chartFilter]
  );

  return (
    <div style={styles.page}>
      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>
            <LayoutGrid size={16} color="#ffffff" />
          </div>
          <span style={styles.logoText}>MSME Suite</span>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ icon: Icon, label, active }) => (
            <button key={label} style={styles.navButton(active)}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.navButton(false)}>
            <UserCircle2 size={17} />
            Profile
          </button>
          <button style={styles.navButton(false)}>
            <KeyRound size={17} />
            Change Password
          </button>
          <button style={styles.logoutButton}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={styles.main}>
        {/* ---- Top bar ---- */}
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Dashboard</h1>

          <div style={styles.topBarRight}>
            <div style={styles.searchWrap}>
              <Search size={16} style={styles.searchIcon} />
              <input type="text" placeholder="Search" style={styles.searchInput} />
            </div>

            <button style={styles.bellButton}>
              <Bell size={16} color="#64748b" />
              <span style={styles.bellBadge}>1</span>
            </button>

            <div style={styles.profileRow}>
              <div style={styles.avatarCircle}>A</div>
              <span style={styles.profileName}>Ananya S. - Admin</span>
              <ChevronDown size={14} color="#94a3b8" />
            </div>
          </div>
        </div>

        {/* ---- Global dashboard filter ---- */}
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

        {/* ---- Stat cards ---- */}
        <div style={styles.statsRow}>
          <StatCard label="Total Clients" value="312" badge="+6%" icon={Users} />
          <StatCard label="Total Employees" value="48" icon={UserCircle2} />
          <StatCard label="Total Revenue" value="₹18,42,600" badge="+11%" icon={IndianRupee} />
          <StatCard label="Outstanding Payments" value="₹1,25,400" icon={Banknote} />
          <StatCard label="Pending Quotations" value="17" icon={ClipboardList} />
          <StatCard label="Total Invoices" value="284" badge="+4%" icon={Receipt} />
        </div>

        {/* ---- Charts row ---- */}
        <div style={{ ...styles.chartsRow }}>
          {/* Revenue Overview */}
          <div style={styles.panel}>
            <PanelHeader
              title="Revenue Overview"
              action={
                <Dropdown
                  value={chartFilter}
                  options={chartFilterOptions}
                  onChange={setChartFilter}
                />
              }
            />
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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

          {/* Payment Status */}
          <div style={styles.panel}>
            <PanelHeader
              title="Payment Status"
              action={<MoreHorizontal size={16} color="#94a3b8" />}
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
        </div>

        {/* ---- Pending Payments + Quick Actions ---- */}
        <div style={styles.bottomRow}>
          {/* Pending Payments */}
          <div style={styles.panel}>
            <PanelHeader
              title="Pending Payments"
              action={<MoreHorizontal size={16} color="#94a3b8" />}
            />
            <div style={styles.pendingList}>
              {pendingPayments.map((p, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.pendingRow,
                    borderBottom: i === pendingPayments.length - 1 ? "none" : styles.pendingRow.borderBottom,
                  }}
                >
                  <div style={{ minWidth: 140 }}>
                    <p style={styles.pendingClient}>{p.client}</p>
                    <p style={styles.pendingInvoice}>{p.invoice}</p>
                  </div>
                  <div style={styles.pendingAmount}>{p.amount}</div>
                  <div style={styles.pendingDue}>Due {p.due}</div>
                  <span style={styles.badge(statusColors[p.status].bg, statusColors[p.status].color)}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.panel}>
            <PanelHeader title="Quick Actions" />
            <div style={styles.quickActionsList}>
              <button style={styles.primaryActionButton}>
                <UserPlus size={16} /> Add Client
              </button>
              <button style={styles.secondaryActionButton}>
                <FilePlus2 size={16} /> Create Quotation
              </button>
              <button style={styles.secondaryActionButton}>
                <ReceiptText size={16} /> Generate Invoice
              </button>
              <button style={styles.secondaryActionButton}>
                <CircleDollarSign size={16} /> Record Payment
              </button>
            </div>
          </div>
        </div>

        {/* ---- Recent Invoices table ---- */}
        <div style={styles.panel}>
          <PanelHeader
            title="Recent Invoices"
            action={<MoreHorizontal size={16} color="#94a3b8" />}
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
                {recentInvoices.map((inv) => (
                  <tr key={inv.invoice}>
                    <td style={styles.tdBold}>{inv.invoice}</td>
                    <td style={styles.td}>{inv.client}</td>
                    <td style={styles.tdMuted}>{inv.date}</td>
                    <td style={styles.tdBold}>{inv.amount}</td>
                    <td style={styles.td}>
                      <span style={styles.badge(statusColors[inv.status].bg, statusColors[inv.status].color)}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={styles.tdMuted}>{inv.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}