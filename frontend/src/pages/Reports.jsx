import React, { useState, useEffect, useMemo } from "react";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Search, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";

// Importing your authenticated API service layers
import {
  getInvoices,
  getPayments,
  getExpenses,
  getClients,
  getVendors,
  getEmployees,
  getAccountsDashboard,
  exportReportPdf,
  exportReportExcel,
  exportReportCsv
} from "../services/Api";

// Retaining existing structural UI themes from design system
import {
  colors,
  panel,
  pageWrap,
  pageTitle,
  table,
  th,
  td,
  tdBold,
  tdMuted,
  tableWrap,
  secondaryButton,
} from "../styles/theme";

const reportTypeOptions = [
  "Sales Report", 
  "Expense Report", 
  "GST Report", 
  "Client Report", 
  "Vendor Report", 
  "Outstanding Report", 
  "Profit & Loss Report", 
  "Employee Salary Report"
];

const rangeOptions = [
  "Today", 
  "This Week", 
  "This Month", 
  "Last Month", 
  "This Quarter", 
  "This Year", 
  "Custom Range"
];

// Inline presentation layouts matching layout definitions precisely
const styles = {
  metricsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  metricCard: {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  metricLabel: {
    fontSize: "13px",
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  metricValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  filters: { 
    display: "flex", 
    gap: "12px", 
    flexWrap: "wrap",
    alignItems: "center"
  },
  dateInputsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dateInput: {
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
    color: "#374151",
    backgroundColor: "#FFFFFF",
  },
  exportRow: { 
    display: "flex", 
    gap: "10px", 
    flexWrap: "wrap" 
  },
  primaryBlueButton: {
    backgroundColor: "#1E40AF", 
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  subHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px"
  },
  recordCount: {
    fontSize: "14px",
    color: "#4B5563",
    fontWeight: "500"
  },
  searchWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "280px"
  },
  searchInput: {
    width: "100%",
    padding: "8px 12px 8px 36px",
    fontSize: "14px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    outline: "none",
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9CA3AF"
  },
  actionButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    color: "#6B7280",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionDropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "6px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    minWidth: "120px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  actionItem: {
    padding: "8px 12px",
    fontSize: "13px",
    textAlign: "left",
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "100%",
    color: "#374151",
    transition: "background-color 0.1s ease",
  },
  paginationWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    flexWrap: "wrap",
    gap: "12px"
  },
  paginationBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    backgroundColor: "#FFFFFF",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  pageNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    backgroundColor: "#FFFFFF",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  activePageNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    border: "1px solid #1E40AF",
    borderRadius: "6px",
    backgroundColor: "#EFF6FF",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1E40AF",
    cursor: "pointer",
  },
  stateWrapper: {
    padding: "40px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
  }
};

// ============================================
// CURRENCY FORMATTER UTILITY
// ============================================
const formatCurrency = (value) => {
  if (value === undefined || value === null) return "₹0";
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  if (isNaN(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
};

// ============================================
// BLOB DOWNLOAD UTILITY
// Triggers a browser download for a blob response returned by axios
// ============================================
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default function Reports() {
  const [reportType, setReportType] = useState(reportTypeOptions[0]);
  const [range, setRange] = useState(rangeOptions[2]); // Default: This Month
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-16");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [exporting, setExporting] = useState(null); // "pdf" | "excel" | "csv" | null

  // Core backend database entities states
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    gstPayable: 0,
    monthlySummary: []
  });

  // App global execution handling states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ============================================
  // PARALLEL SERVICE FETCH DATA PIPELINE
  // ============================================
  useEffect(() => {
    async function fetchAllReportData() {
      try {
        setLoading(true);
        setError(false);

        const [
          resInvoices,
          resExpenses,
          resClients,
          resVendors,
          resEmployees,
          resDashboard
        ] = await Promise.all([
          getInvoices(),
          getExpenses(),
          getClients(),
          getVendors(),
          getEmployees(),
          getAccountsDashboard()
        ]);

        setInvoices(resInvoices?.data || []);
        setExpenses(resExpenses?.data || []);
        setClients(resClients?.data || []);
        setVendors(resVendors?.data || []);
        setEmployees(resEmployees?.data || []);
        
        if (resDashboard?.data) {
          setDashboardMetrics({
            totalRevenue: resDashboard.data.totalRevenue || 0,
            totalExpense: resDashboard.data.totalExpense || 0,
            netProfit: resDashboard.data.netProfit || 0,
            gstPayable: resDashboard.data.gstPayable || 0,
            monthlySummary: resDashboard.data.monthlySummary || []
          });
        }
      } catch (err) {
        console.error("Backend Reports Pipeline Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAllReportData();
  }, []);

  // ============================================
  // COLUMN SCHEMAS ARCHITECTURE
  // ============================================
  const columnsConfig = useMemo(() => {
    return {
      "Sales Report": [
        { key: "invoiceNumber", label: "Invoice Number" },
        { key: "invoiceDate", label: "Invoice Date" },
        { key: "customer", label: "Customer" },
        { key: "totalAmount", label: "Total Amount" },
        { key: "gstAmount", label: "GST Amount" },
        { key: "status", label: "Status" },
        { key: "dueDate", label: "Due Date" }
      ],
      "Expense Report": [
        { key: "expenseNumber", label: "Expense Number" },
        { key: "expenseName", label: "Expense Name" },
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "vendor", label: "Vendor" },
        { key: "amount", label: "Amount" },
        { key: "gstAmount", label: "GST Amount" },
        { key: "paymentMethod", label: "Payment Method" },
        { key: "status", label: "Status" }
      ],
      "GST Report": [
        { key: "invoiceNumber", label: "Invoice Number" },
        { key: "invoiceDate", label: "Invoice Date" },
        { key: "gstAmount", label: "GST Amount" },
        { key: "totalAmount", label: "Total Amount" },
        { key: "status", label: "Status" }
      ],
      "Client Report": [
        { key: "clientName", label: "Client Name" },
        { key: "company", label: "Company" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "gstNumber", label: "GST Number" },
        { key: "city", label: "City" }
      ],
      "Vendor Report": [
        { key: "vendorName", label: "Vendor Name" },
        { key: "company", label: "Company" },
        { key: "phone", label: "Phone" },
        { key: "gstNumber", label: "GST Number" },
        { key: "paymentTerms", label: "Payment Terms" }
      ],
      "Outstanding Report": [
        { key: "invoiceNumber", label: "Invoice Number" },
        { key: "customer", label: "Customer" },
        { key: "dueDate", label: "Due Date" },
        { key: "totalAmount", label: "Total Amount" },
        { key: "status", label: "Status" }
      ],
      "Profit & Loss Report": [
        { key: "month", label: "Month" },
        { key: "revenue", label: "Revenue" },
        { key: "expenses", label: "Expenses" },
        { key: "netProfit", label: "Net Profit" }
      ],
      "Employee Salary Report": [
        { key: "employeeName", label: "Employee Name" },
        { key: "department", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "salary", label: "Salary" },
        { key: "status", label: "Status" }
      ]
    };
  }, []);

  // ============================================
  // MAPPING API RESPONSES INTO DYNAMIC ROWS
  // ============================================
  const parsedRows = useMemo(() => {
    switch (reportType) {
      case "Sales Report":
        return invoices.map(inv => ({
          invoiceNumber: inv.invoiceNumber || inv.id || "N/A",
          invoiceDate: inv.invoiceDate || inv.date || "N/A",
          customer: inv.client?.name || inv.customerName || inv.clientId || "N/A",
          totalAmount: formatCurrency(inv.totalAmount || inv.amount),
          gstAmount: formatCurrency(inv.gstAmount || inv.taxAmount),
          status: inv.status || "N/A",
          dueDate: inv.dueDate || "N/A",
          raw: inv
        }));

      case "Expense Report":
        return expenses.map(exp => ({
          expenseNumber: exp.expenseNumber || exp.id || "N/A",
          expenseName: exp.expenseName || exp.title || "N/A",
          date: exp.date || exp.expenseDate || "N/A",
          category: exp.category?.name || exp.category || "N/A",
          vendor: exp.vendor?.name || exp.vendorName || "N/A",
          amount: formatCurrency(exp.amount),
          gstAmount: formatCurrency(exp.gstAmount),
          paymentMethod: exp.paymentMethod || "N/A",
          status: exp.status || "N/A",
          raw: exp
        }));

      case "GST Report":
        return invoices.map(inv => ({
          invoiceNumber: inv.invoiceNumber || inv.id || "N/A",
          invoiceDate: inv.invoiceDate || inv.date || "N/A",
          gstAmount: formatCurrency(inv.gstAmount || inv.taxAmount),
          totalAmount: formatCurrency(inv.totalAmount || inv.amount),
          status: inv.status || "N/A",
          raw: inv
        }));

      case "Client Report":
        return clients.map(c => ({
          clientName: c.name || c.clientName || "N/A",
          company: c.company || c.companyName || "N/A",
          email: c.email || "N/A",
          phone: c.phone || "N/A",
          gstNumber: c.gstNumber || c.gstin || "N/A",
          city: c.city || "N/A",
          raw: c
        }));

      case "Vendor Report":
        return vendors.map(v => ({
          vendorName: v.name || v.vendorName || "N/A",
          company: v.company || v.companyName || "N/A",
          phone: v.phone || "N/A",
          gstNumber: v.gstNumber || v.gstin || "N/A",
          paymentTerms: v.paymentTerms || "N/A",
          raw: v
        }));

      case "Outstanding Report":
        return invoices
          .filter(inv => String(inv.status).toUpperCase() !== "PAID")
          .map(inv => ({
            invoiceNumber: inv.invoiceNumber || inv.id || "N/A",
            customer: inv.client?.name || inv.customerName || "N/A",
            dueDate: inv.dueDate || "N/A",
            totalAmount: formatCurrency(inv.totalAmount || inv.amount),
            status: inv.status || "Pending",
            raw: inv
          }));

      case "Profit & Loss Report":
        return (dashboardMetrics.monthlySummary || []).map((m, index) => ({
          month: m.month || `Period ${index + 1}`,
          revenue: formatCurrency(m.revenue || m.totalRevenue),
          expenses: formatCurrency(m.expenses || m.totalExpense),
          netProfit: formatCurrency(m.netProfit),
          raw: m
        }));

      case "Employee Salary Report":
        return employees.map(emp => ({
          employeeName: emp.name || emp.employeeName || "N/A",
          department: emp.department || "N/A",
          designation: emp.designation || "N/A",
          salary: formatCurrency(emp.salary),
          status: emp.status || "Active",
          raw: emp
        }));

      default:
        return [];
    }
  }, [reportType, invoices, expenses, clients, vendors, employees, dashboardMetrics]);

  // ============================================
  // CLIENT-SIDE SEARCH FILTER COMPUTATION
  // ============================================
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return parsedRows;

    const lowerQuery = searchQuery.toLowerCase();
    return parsedRows.filter(row => 
      Object.keys(row).some(key => {
        if (key === "raw") return false;
        return String(row[key]).toLowerCase().includes(lowerQuery);
      })
    );
  }, [parsedRows, searchQuery]);

  const currentColumns = columnsConfig[reportType] || [];

  const handleActionClick = (action, rowData) => {
    alert(`${action} triggered for dataset entry:\n${JSON.stringify(rowData.raw || rowData, null, 2)}`);
    setActiveDropdownIndex(null);
  };

  // ============================================
  // EXPORT HANDLERS
  // Calls the backend /reports/export/{pdf|excel|csv} endpoints
  // and triggers a browser download of the returned file.
  // ============================================
  const handleExport = async (format) => {
    if (exporting) return;

    const exporters = {
      pdf: { fn: exportReportPdf, ext: "pdf" },
      excel: { fn: exportReportExcel, ext: "xlsx" },
      csv: { fn: exportReportCsv, ext: "csv" },
    };

    const config = exporters[format];
    if (!config) return;

    setExporting(format);

    try {
      const response = await config.fn(reportType);
      const blob = new Blob([response.data]);
      const safeName = reportType.replace(/\s+/g, "_");
      downloadBlob(blob, `${safeName}.${config.ext}`);
    } catch (err) {
      console.error(`Export (${format}) failed:`, err);
      alert(`Could not export "${reportType}" as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Condition State Visual Handling Breaks
  if (loading) {
    return (
      <div style={pageWrap}>
        <h1 style={pageTitle}>Reports</h1>
        <div style={{ ...panel, ...styles.stateWrapper, color: colors?.textMuted || "#4B5563" }}>
          Loading reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageWrap}>
        <h1 style={pageTitle}>Reports</h1>
        <div style={{ ...panel, ...styles.stateWrapper, color: "#DC2626" }}>
          Unable to load reports. Please verify your connection status or server credentials.
        </div>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Reports</h1>

      {/* ============================================
          DYNAMIC LIVE DASHBOARD SUMMARY CARDS
          ============================================ */}
      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Total Revenue</div>
          <div style={styles.metricValue}>{formatCurrency(dashboardMetrics.totalRevenue)}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Total Expenses</div>
          <div style={styles.metricValue}>{formatCurrency(dashboardMetrics.totalExpense)}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Net Profit</div>
          <div style={styles.metricValue}>{formatCurrency(dashboardMetrics.netProfit)}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>GST Payable</div>
          <div style={styles.metricValue}>{formatCurrency(dashboardMetrics.gstPayable)}</div>
        </div>
      </div>

      {/* ============================================
          FILTERS & EXPORTS PANEL CONTROL LAYER
          ============================================ */}
      <div style={panel}>
        <PanelHeader title={reportType} />

        <div style={styles.toolbar}>
          <div style={styles.filters}>
            <Dropdown 
              label="Report Type" 
              value={reportType} 
              options={reportTypeOptions} 
              onChange={(val) => {
                setReportType(val);
                setSearchQuery("");
                setActiveDropdownIndex(null);
              }} 
            />
            <Dropdown 
              label="Date Range" 
              value={range} 
              options={rangeOptions} 
              onChange={setRange} 
            />

            {range === "Custom Range" && (
              <div style={styles.dateInputsContainer}>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  style={styles.dateInput}
                />
                <span style={{ color: "#4B5563" }}>to</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  style={styles.dateInput}
                />
              </div>
            )}
          </div>

          <div style={styles.exportRow}>
            <button 
              type="button" 
              style={{
                ...styles.primaryBlueButton,
                ...(exporting === "pdf" ? styles.disabledButton : {}),
              }}
              disabled={exporting === "pdf"}
              onClick={() => handleExport("pdf")}
            >
              <FileText size={16} /> {exporting === "pdf" ? "Exporting..." : "Export PDF"}
            </button>
            <button 
              type="button" 
              style={{
                ...secondaryButton,
                ...(exporting === "csv" ? styles.disabledButton : {}),
              }}
              disabled={exporting === "csv"}
              onClick={() => handleExport("csv")}
            >
              <FileSpreadsheet size={16} /> {exporting === "csv" ? "Exporting..." : "Export CSV"}
            </button>
            <button 
              type="button" 
              style={{
                ...secondaryButton,
                ...(exporting === "excel" ? styles.disabledButton : {}),
              }}
              disabled={exporting === "excel"}
              onClick={() => handleExport("excel")}
            >
              <Download size={16} /> {exporting === "excel" ? "Exporting..." : "Export Excel"}
            </button>
            <button 
              type="button" 
              style={secondaryButton} 
              onClick={handlePrint}
            >
              <Printer size={16} /> Print Report
            </button>
          </div>
        </div>

        {/* ============================================
            METRICS & LIVE RUNTIME SEARCH FILTER
            ============================================ */}
        <div style={styles.subHeader}>
          <div style={styles.recordCount}>
            Showing {filteredRows.length} records
          </div>
          <div style={styles.searchWrapper}>
            <Search size={16} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search data fields..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* ============================================
            REUSABLE DYNAMIC TABLE STRUCTURE
            ============================================ */}
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                {currentColumns.map((col) => (
                  <th key={col.key} style={th}>
                    {col.label}
                  </th>
                ))}
                <th style={{ ...th, textAlign: "right", width: "80px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={currentColumns.length + 1} style={{ ...td, textAlign: "center", color: "#9CA3AF", padding: "32px" }}>
                    No matching backend telemetry details found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr 
                    key={idx} 
                    style={{ transition: "background-color 0.15s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {currentColumns.map((col, cIdx) => {
                      const value = row[col.key];
                      const isFirstCol = cIdx === 0;
                      const isLastCol = cIdx === currentColumns.length - 1;
                      
                      return (
                        <td key={col.key} style={isFirstCol || isLastCol ? tdBold : tdMuted}>
                          {value}
                        </td>
                      );
                    })}

                    <td style={{ ...td, textAlign: "right", position: "relative" }}>
                      <button 
                        type="button" 
                        style={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownIndex(activeDropdownIndex === idx ? null : idx);
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeDropdownIndex === idx && (
                        <div style={styles.actionDropdown}>
                          <button 
                            type="button" 
                            style={styles.actionItem} 
                            onClick={() => handleActionClick("View", row)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#F3F4F6"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                          >
                            View
                          </button>
                          <button 
                            type="button" 
                            style={styles.actionItem} 
                            onClick={() => handleActionClick("Print", row)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#F3F4F6"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                          >
                            Print
                          </button>
                          <button 
                            type="button" 
                            style={styles.actionItem} 
                            onClick={() => handleActionClick("Export Row", row)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#F3F4F6"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                          >
                            Export Row
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ============================================
            FRONTEND CLIENT PAGINATION BLOCK
            ============================================ */}
        <div style={styles.paginationWrapper}>
          <div style={{ fontSize: "14px", color: "#6B7280" }}>
            Showing page 1 of 1
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button 
              type="button" 
              style={styles.paginationBtn} 
              onClick={() => alert("Pagination operational (Currently on first structural database index page)")}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button type="button" style={styles.activePageNumber}>1</button>
            <button type="button" style={styles.pageNumber} onClick={() => alert("Pagination page 2 placeholder interaction link")}>2</button>
            <button type="button" style={styles.pageNumber} onClick={() => alert("Pagination page 3 placeholder interaction link")}>3</button>
            <button 
              type="button" 
              style={styles.paginationBtn} 
              onClick={() => alert("Pagination operational (Currently on first structural database index page)")}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}