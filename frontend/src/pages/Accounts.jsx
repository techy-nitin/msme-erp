import React, { useEffect, useState } from "react";
import { IndianRupee, TrendingDown, TrendingUp, Receipt, MoreHorizontal, Plus, X } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import StatCard from "../components/StatCard";
import PanelHeader from "../components/PanelHeader";
import { 
  colors, 
  panel, 
  pageWrap, 
  pageTitle, 
  statsRow, 
  table, 
  th, 
  td, 
  tdBold, 
  tdMuted, 
  tableWrap 
} from "../styles/theme";
import api, { createExpense } from "../services/Api"; // Importing api instance and createExpense service

const styles = {
  headerRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 24 
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  chartsRow: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 },
  legendRow: { display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: colors.textMuted },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
  dot: (c) => ({ width: 8, height: 8, borderRadius: "50%", background: c }),
  plList: { display: "flex", flexDirection: "column", gap: 10 },
  plRow: { display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.textSecondary },
  plRowBold: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: 15, 
    fontWeight: 700, 
    color: colors.textPrimary, 
    borderTop: `1px solid ${colors.border}`, 
    paddingTop: 10, 
    marginTop: 4 
  },
  loadingText: { fontSize: 14, color: colors.textSecondary, padding: "24px 0" },
  errorText: { color: "#dc2626", fontSize: 14, padding: "24px 0" },

  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: "100%",
    maxWidth: 550,
    padding: 24,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${colors.border}`
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 16,
    marginBottom: 20
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: colors.textPrimary
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: colors.textFaint,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 20
  },
  formGroupFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textSecondary
  },
  input: {
    padding: "8px 12px",
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
    fontSize: 14,
    outline: "none",
    color: colors.textPrimary,
    transition: "border-color 0.15s"
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 16
  },
  btnCancel: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  },
  btnSubmit: {
    backgroundColor: "#2563eb",
    border: "none",
    color: "#ffffff",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default function Accounts() {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    gstPayable: 0,
    monthlySummary: [],
    gstSummary: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Expense Form State representing ExpenseEntity
  const [form, setForm] = useState({
    expenseNumber: "",
    expenseName: "",
    expenseDate: new Date().toISOString().split("T")[0],
    category: "",
    vendor: "",
    description: "",
    amount: "",
    gstAmount: "",
    paymentMethod: "CASH",
    status: "PAID"
  });

  const loadAccounts = async () => {
    try {
      const res = await api.get("/accounts/dashboard");
      setData(res.data || {});
    } catch (err) {
      console.error("Error loading accounts data:", err);
      setError("Failed to load financial records. Please check your backend connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpenseClick = () => {
    // Auto-generate a helper default expense ID number upon opening
    const generatedNo = `EXP-${Date.now().toString().slice(-6)}`;
    setForm({
      expenseNumber: generatedNo,
      expenseName: "",
      expenseDate: new Date().toISOString().split("T")[0],
      category: "Operations",
      vendor: "",
      description: "",
      amount: "",
      gstAmount: "",
      paymentMethod: "CASH",
      status: "PAID"
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build request body mapping perfectly to your JPA entity
      const expenseData = {
        expenseNumber: form.expenseNumber,
        expenseName: form.expenseName,
        expenseDate: form.expenseDate,
        category: form.category,
        vendor: form.vendor || null,
        description: form.description || null,
        amount: parseFloat(form.amount),
        gstAmount: form.gstAmount ? parseFloat(form.gstAmount) : 0,
        paymentMethod: form.paymentMethod,
        status: form.status
      };

      await createExpense(expenseData);
      setShowModal(false);
      
      // Instantly reload accounts dashboard data metrics to reflect new changes
      setLoading(true);
      await loadAccounts();
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Error adding expense record. Please verify all fields are populated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={pageWrap}>
        <h1 style={pageTitle}>Accounts</h1>
        <p style={styles.loadingText}>Fetching accounts overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageWrap}>
        <h1 style={pageTitle}>Accounts</h1>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  // Safe destructuring with fallback variables
  const totalRevenue = Number(data?.totalRevenue ?? 0);
  const totalExpense = Number(data?.totalExpense ?? 0);
  const netProfit = Number(data?.netProfit ?? 0);
  const gstPayable = Number(data?.gstPayable ?? 0);

  const monthlySummary = Array.isArray(data?.monthlySummary) ? data.monthlySummary : [];
  const gstSummary = Array.isArray(data?.gstSummary) ? data.gstSummary : [];

  return (
    <div style={pageWrap}>
      {/* Dynamic Header with Action Button */}
      <div style={styles.headerRow}>
        <h1 style={{ ...pageTitle, margin: 0 }}>Accounts</h1>
        <button style={styles.btnPrimary} onClick={handleAddExpenseClick}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div style={statsRow}>
        <StatCard 
          label="Total Revenue" 
          value={`₹${(totalRevenue || 0).toLocaleString("en-IN")}`} 
          badge="+9%" 
          icon={IndianRupee} 
        />
        <StatCard 
          label="Total Expenses" 
          value={`₹${(totalExpense || 0).toLocaleString("en-IN")}`} 
          icon={TrendingDown} 
        />
        <StatCard 
          label="Net Profit" 
          value={`₹${(netProfit || 0).toLocaleString("en-IN")}`} 
          badge="+14%" 
          icon={TrendingUp} 
        />
        <StatCard 
          label="GST Payable (This Month)" 
          value={`₹${(gstPayable || 0).toLocaleString("en-IN")}`} 
          icon={Receipt} 
        />
      </div>

      <div style={styles.chartsRow}>
        <div style={panel}>
          <PanelHeader 
            title="Monthly Revenue vs Expense" 
            action={<MoreHorizontal size={16} color={colors.textFaint} />} 
          />
          <div style={{ height: 240 }}>
            {monthlySummary.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySummary}>
                  <CartesianGrid vertical={false} stroke={colors.border} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11, fill: colors.textFaint }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="expense" fill="#bfdbfe" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={styles.loadingText}>No monthly summary data available.</p>
            )}
          </div>
          <div style={styles.legendRow}>
            <span style={styles.legendItem}>
              <span style={styles.dot("#2563eb")} /> Revenue
            </span>
            <span style={styles.legendItem}>
              <span style={styles.dot("#bfdbfe")} /> Expense
            </span>
          </div>
        </div>

        <div style={panel}>
          <PanelHeader title="Profit & Loss Summary" />
          <div style={styles.plList}>
            <div style={styles.plRow}>
              <span>Total Revenue</span>
              <span>₹{(totalRevenue || 0).toLocaleString("en-IN")}</span>
            </div>
            <div style={styles.plRow}>
              <span>Total Expenses</span>
              <span>- ₹{(totalExpense || 0).toLocaleString("en-IN")}</span>
            </div>
            <div style={styles.plRow}>
              <span>GST Payable</span>
              <span>- ₹{(gstPayable || 0).toLocaleString("en-IN")}</span>
            </div>
            <div style={styles.plRowBold}>
              <span>Net Profit</span>
              <span>₹{(netProfit - gstPayable).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={panel}>
        <PanelHeader 
          title="GST Summary" 
          action={<MoreHorizontal size={16} color={colors.textFaint} />} 
        />
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Period</th>
                <th style={th}>Output GST</th>
                <th style={th}>Input GST</th>
                <th style={th}>Net Payable</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {gstSummary.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.loadingText}>No GST statements found.</td>
                </tr>
              ) : (
                gstSummary.map((g, idx) => (
                  <tr key={g.period || idx}>
                    <td style={tdBold}>{g.period || "N/A"}</td>
                    <td style={td}>₹{(g.outputGst || 0).toLocaleString("en-IN")}</td>
                    <td style={td}>₹{(g.inputGst || 0).toLocaleString("en-IN")}</td>
                    <td style={tdBold}>₹{(g.netPayable || 0).toLocaleString("en-IN")}</td>
                    <td style={tdMuted}>{g.status || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================ */}
      {/* Add Expense Dialog Modal                     */}
      {/* ============================================ */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Record New Expense</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGrid}>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Expense Name *</label>
                  <input
                    type="text"
                    name="expenseName"
                    required
                    placeholder="e.g. Office Rent, AWS Bill"
                    style={styles.input}
                    value={form.expenseName}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Expense Reference # *</label>
                  <input
                    type="text"
                    name="expenseNumber"
                    required
                    style={styles.input}
                    value={form.expenseNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Date *</label>
                  <input
                    type="date"
                    name="expenseDate"
                    required
                    style={styles.input}
                    value={form.expenseDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <input
                    type="text"
                    name="category"
                    required
                    placeholder="e.g. Utilities, Logistics"
                    style={styles.input}
                    value={form.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Vendor Name</label>
                  <input
                    type="text"
                    name="vendor"
                    placeholder="e.g. AWS, Private Ltd"
                    style={styles.input}
                    value={form.vendor}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Expense Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="0.00"
                    style={styles.input}
                    value={form.amount}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Input GST Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="gstAmount"
                    placeholder="0.00"
                    style={styles.input}
                    value={form.gstAmount}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Payment Method</label>
                  <select
                    name="paymentMethod"
                    style={styles.input}
                    value={form.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Payment Status</label>
                  <select
                    name="status"
                    style={styles.input}
                    value={form.status}
                    onChange={handleInputChange}
                  >
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    placeholder="Add brief details regarding this transaction..."
                    style={{ ...styles.input, fontFamily: "inherit", resize: "none" }}
                    value={form.description}
                    onChange={handleInputChange}
                  />
                </div>

              </div>

              <div style={styles.actionsRow}>
                <button 
                  type="button" 
                  style={styles.btnCancel} 
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.btnSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}