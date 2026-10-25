import React, { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, Receipt, Users, Check } from "lucide-react";
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
} from "../styles/theme";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getEmployees,
  getVendors,
} from "../Services/Api";

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  headerActions: { display: "flex", gap: 10 },
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
  },
  btnSecondary: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    color: "#2563eb",
    border: "1px solid #2563eb",
    borderRadius: 6,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  loadingText: { fontSize: 14, color: colors.textSecondary, padding: "24px 0" },
  errorText: { color: "#dc2626", fontSize: 14, padding: "24px 0" },
  badge: (bg, fg) => ({
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: bg,
    color: fg,
  }),
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "inline-flex",
    alignItems: "center",
    color: colors.textFaint,
  },
  actionsCell: { display: "flex", gap: 4 },
  hint: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
    marginTop: 4,
  },

  // Modal
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: "100%",
    maxWidth: 600,
    padding: 24,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${colors.border}`,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalContentWide: {
    maxWidth: 780,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 16,
    marginBottom: 20,
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: colors.textPrimary },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: colors.textFaint,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  formGroupFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: colors.textSecondary },
  input: {
    padding: "8px 12px",
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
    fontSize: 14,
    outline: "none",
    color: colors.textPrimary,
  },
  inputSmall: {
    padding: "6px 8px",
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
    fontSize: 13,
    outline: "none",
    color: colors.textPrimary,
    width: 110,
  },
  inputDisabled: {
    backgroundColor: "#f1f5f9",
    cursor: "not-allowed",
    color: colors.textFaint,
  },
  toggleRow: { display: "flex", gap: 8, marginBottom: 4 },
  toggleBtn: (active) => ({
    flex: 1,
    padding: "8px 12px",
    borderRadius: 6,
    border: `1px solid ${active ? "#2563eb" : colors.border}`,
    backgroundColor: active ? "#eff6ff" : "#ffffff",
    color: active ? "#2563eb" : colors.textSecondary,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }),
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 16,
  },
  actionsRowSpread: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 16,
  },
  btnCancel: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSubmit: {
    backgroundColor: "#2563eb",
    border: "none",
    color: "#ffffff",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  bulkTableWrap: {
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 320,
    overflowY: "auto",
  },
  bulkTable: { width: "100%", borderCollapse: "collapse" },
  bulkTh: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: colors.textSecondary,
    padding: "10px 12px",
    borderBottom: `1px solid ${colors.border}`,
    position: "sticky",
    top: 0,
    backgroundColor: "#f8fafc",
  },
  bulkTd: {
    padding: "8px 12px",
    fontSize: 13,
    color: colors.textPrimary,
    borderBottom: `1px solid ${colors.border}`,
  },
  selectAllRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 600,
    color: colors.textSecondary,
  },
  summaryText: { fontSize: 13, color: colors.textSecondary },
};

const emptyForm = {
  expenseName: "",
  expenseDate: new Date().toISOString().split("T")[0],
  category: "",
  payeeType: "VENDOR", // VENDOR | EMPLOYEE
  vendorId: "",
  vendor: "",
  employeeId: "",
  description: "",
  amount: "",
  gstAmount: "",
  paymentMethod: "CASH",
  status: "PAID",
};

const emptyBulkCommon = {
  expenseDate: new Date().toISOString().split("T")[0],
  category: "Payroll",
  paymentMethod: "BANK_TRANSFER",
  status: "PAID",
};

const employeeName = (emp) =>
  [emp.firstName, emp.lastName].filter(Boolean).join(" ");

const vendorLabel = (v) =>
  v.companyName ? `${v.vendorName} — ${v.companyName}` : v.vendorName;

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Single-expense modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [useCustomVendor, setUseCustomVendor] = useState(false);

  // Bulk payroll modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSelected, setBulkSelected] = useState({});
  const [bulkAmounts, setBulkAmounts] = useState({});
  const [bulkCommon, setBulkCommon] = useState(emptyBulkCommon);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expRes, empRes, venRes] = await Promise.allSettled([
        getExpenses(),
        getEmployees(),
        getVendors(),
      ]);

      if (expRes.status === "fulfilled") {
        setExpenses(Array.isArray(expRes.value.data) ? expRes.value.data : []);
      } else {
        console.error("Error loading expenses:", expRes.reason);
      }

      if (empRes.status === "fulfilled") {
        setEmployees(Array.isArray(empRes.value.data) ? empRes.value.data : []);
      } else {
        console.error("Error loading employees:", empRes.reason);
      }

      if (venRes.status === "fulfilled") {
        setVendors(Array.isArray(venRes.value.data) ? venRes.value.data : []);
      } else {
        console.error("Error loading vendors:", venRes.reason);
      }

      const allFailed =
        expRes.status === "rejected" &&
        empRes.status === "rejected" &&
        venRes.status === "rejected";

      setError(allFailed ? "Failed to load data. Please check your backend connection." : "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================================
  // Single expense form handlers
  // ============================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayeeTypeChange = (type) => {
    setUseCustomVendor(false);
    setForm((prev) => ({
      ...prev,
      payeeType: type,
      vendorId: "",
      vendor: "",
      employeeId: "",
      gstAmount: type === "EMPLOYEE" ? "0" : prev.gstAmount,
    }));
  };

  const handleVendorSelect = (e) => {
    const venId = e.target.value;
    const ven = vendors.find((x) => String(x.id) === String(venId));
    setForm((prev) => ({
      ...prev,
      vendorId: venId,
      vendor: ven ? vendorLabel(ven) : "",
    }));
  };

  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    const emp = employees.find((x) => String(x.id) === String(empId));
    setForm((prev) => ({
      ...prev,
      employeeId: empId,
      vendor: emp
        ? `Employee: ${employeeName(emp)}${emp.employeeCode ? ` (${emp.employeeCode})` : ""}`
        : "",
      amount: emp?.salary != null ? String(emp.salary) : prev.amount,
      gstAmount: "0",
      category: prev.category || (emp ? "Payroll" : prev.category),
    }));
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setUseCustomVendor(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    const isEmployee = (expense.vendor || "").startsWith("Employee: ");
    setForm({
      expenseName: expense.expenseName || "",
      expenseDate: expense.expenseDate || new Date().toISOString().split("T")[0],
      category: expense.category || "",
      payeeType: isEmployee ? "EMPLOYEE" : "VENDOR",
      vendorId: "",
      vendor: expense.vendor || "",
      employeeId: "",
      description: expense.description || "",
      amount: expense.amount ?? "",
      gstAmount: isEmployee ? "0" : expense.gstAmount ?? "",
      paymentMethod: expense.paymentMethod || "CASH",
      status: expense.status || "PAID",
    });
    // If the stored vendor text doesn't match any known vendor, fall back to custom text mode
    const matchesKnownVendor = vendors.some((v) => vendorLabel(v) === expense.vendor);
    setUseCustomVendor(!isEmployee && !matchesKnownVendor);
    setEditingId(expense.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
      alert("Error deleting expense. Please try again.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const expenseData = {
        expenseName: form.expenseName,
        expenseDate: form.expenseDate,
        category: form.category,
        vendor: form.vendor || null,
        description: form.description || null,
        amount: parseFloat(form.amount),
        gstAmount:
          form.payeeType === "EMPLOYEE"
            ? 0
            : form.gstAmount
            ? parseFloat(form.gstAmount)
            : 0,
        paymentMethod: form.paymentMethod,
        status: form.status,
      };

      if (editingId) {
        const res = await updateExpense(editingId, expenseData);
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === editingId ? res.data : exp))
        );
      } else {
        const res = await createExpense(expenseData);
        setExpenses((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Failed to save expense:", err);
      alert("Error saving expense record. Please verify all fields are populated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // Bulk payroll handlers
  // ============================================

  const openBulkModal = () => {
    const initialSelected = {};
    const initialAmounts = {};
    employees.forEach((emp) => {
      initialSelected[emp.id] = false;
      initialAmounts[emp.id] = emp.salary != null ? String(emp.salary) : "";
    });
    setBulkSelected(initialSelected);
    setBulkAmounts(initialAmounts);
    setBulkCommon(emptyBulkCommon);
    setShowBulkModal(true);
  };

  const toggleBulkSelect = (empId) => {
    setBulkSelected((prev) => ({ ...prev, [empId]: !prev[empId] }));
  };

  const toggleSelectAll = () => {
    const allSelected = employees.every((emp) => bulkSelected[emp.id]);
    const next = {};
    employees.forEach((emp) => {
      next[emp.id] = !allSelected;
    });
    setBulkSelected(next);
  };

  const handleBulkAmountChange = (empId, value) => {
    setBulkAmounts((prev) => ({ ...prev, [empId]: value }));
  };

  const handleBulkCommonChange = (e) => {
    const { name, value } = e.target;
    setBulkCommon((prev) => ({ ...prev, [name]: value }));
  };

  const selectedCount = Object.values(bulkSelected).filter(Boolean).length;

  const handleBulkSubmit = async () => {
    const selectedIds = Object.keys(bulkSelected).filter((id) => bulkSelected[id]);

    if (selectedIds.length === 0) {
      alert("Select at least one employee.");
      return;
    }

    setBulkSubmitting(true);
    const created = [];
    const failed = [];

    for (const empId of selectedIds) {
      const emp = employees.find((x) => String(x.id) === String(empId));
      if (!emp) continue;

      const amount = parseFloat(bulkAmounts[empId]);
      if (!amount || amount <= 0) {
        failed.push(`${employeeName(emp)} (invalid amount)`);
        continue;
      }

      const expenseData = {
        expenseName: `Salary - ${employeeName(emp)}`,
        expenseDate: bulkCommon.expenseDate,
        category: bulkCommon.category,
        vendor: `Employee: ${employeeName(emp)}${emp.employeeCode ? ` (${emp.employeeCode})` : ""}`,
        description: null,
        amount,
        gstAmount: 0,
        paymentMethod: bulkCommon.paymentMethod,
        status: bulkCommon.status,
      };

      try {
        const res = await createExpense(expenseData);
        created.push(res.data);
      } catch (err) {
        console.error(`Failed to create expense for ${employeeName(emp)}:`, err);
        failed.push(employeeName(emp));
      }
    }

    if (created.length > 0) {
      setExpenses((prev) => [...created, ...prev]);
    }

    setBulkSubmitting(false);

    if (failed.length > 0) {
      alert(`Created ${created.length} expense(s). Failed for: ${failed.join(", ")}.`);
    } else {
      setShowBulkModal(false);
    }
  };

  // ============================================
  // Render
  // ============================================

  const statusBadge = (status) => {
    if (status === "PAID") return styles.badge("#dcfce7", "#166534");
    if (status === "PENDING") return styles.badge("#fef9c3", "#854d0e");
    return styles.badge("#f1f5f9", colors.textSecondary);
  };

  if (loading) {
    return (
      <div style={pageWrap}>
        <h1 style={pageTitle}>Expenses</h1>
        <p style={styles.loadingText}>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <div style={styles.headerRow}>
        <h1 style={{ ...pageTitle, margin: 0 }}>Expenses</h1>
        <div style={styles.headerActions}>
          <button style={styles.btnSecondary} onClick={openBulkModal}>
            <Users size={16} /> Bulk Payroll Expense
          </button>
          <button style={styles.btnPrimary} onClick={openCreateModal}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}

      <div style={panel}>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Expense</th>
                <th style={th}>Category</th>
                <th style={th}>Paid To</th>
                <th style={th}>Date</th>
                <th style={th}>Amount</th>
                <th style={th}>GST</th>
                <th style={th}>Payment</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={9} style={styles.loadingText}>
                    <Receipt size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={tdBold}>{exp.expenseName || "—"}</td>
                    <td style={td}>{exp.category || "—"}</td>
                    <td style={tdMuted}>{exp.vendor || "—"}</td>
                    <td style={tdMuted}>{exp.expenseDate || "—"}</td>
                    <td style={tdBold}>
                      ₹{Number(exp.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td style={td}>₹{Number(exp.gstAmount || 0).toLocaleString("en-IN")}</td>
                    <td style={tdMuted}>{exp.paymentMethod || "—"}</td>
                    <td style={td}>
                      <span style={statusBadge(exp.status)}>{exp.status || "—"}</span>
                    </td>
                    <td style={td}>
                      <div style={styles.actionsCell}>
                        <button
                          style={styles.actionBtn}
                          onClick={() => openEditModal(exp)}
                          title="Edit expense"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          style={styles.actionBtn}
                          onClick={() => handleDelete(exp.id)}
                          title="Delete expense"
                        >
                          <Trash2 size={15} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================ */}
      {/* Single Add/Edit Expense Modal                 */}
      {/* ============================================ */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingId ? "Edit Expense" : "Record New Expense"}
              </h3>
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
                    placeholder="e.g. Office Rent, AWS Bill, Salary Advance"
                    style={styles.input}
                    value={form.expenseName}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <input
                    type="text"
                    name="category"
                    required
                    placeholder="e.g. Utilities, Payroll, Logistics"
                    style={styles.input}
                    value={form.category}
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

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Paid To</label>
                  <div style={styles.toggleRow}>
                    <button
                      type="button"
                      style={styles.toggleBtn(form.payeeType === "VENDOR")}
                      onClick={() => handlePayeeTypeChange("VENDOR")}
                    >
                      Vendor
                    </button>
                    <button
                      type="button"
                      style={styles.toggleBtn(form.payeeType === "EMPLOYEE")}
                      onClick={() => handlePayeeTypeChange("EMPLOYEE")}
                    >
                      Employee
                    </button>
                  </div>

                  {form.payeeType === "VENDOR" ? (
                    useCustomVendor ? (
                      <>
                        <input
                          type="text"
                          name="vendor"
                          placeholder="e.g. AWS, Private Ltd"
                          style={styles.input}
                          value={form.vendor}
                          onChange={handleInputChange}
                        />
                        {vendors.length > 0 && (
                          <button
                            type="button"
                            style={styles.linkBtn}
                            onClick={() => {
                              setUseCustomVendor(false);
                              setForm((prev) => ({ ...prev, vendor: "", vendorId: "" }));
                            }}
                          >
                            Choose from registered vendors instead
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <select
                          name="vendorId"
                          style={styles.input}
                          value={form.vendorId}
                          onChange={handleVendorSelect}
                        >
                          <option value="">Select vendor...</option>
                          {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                              {vendorLabel(v)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          style={styles.linkBtn}
                          onClick={() => {
                            setUseCustomVendor(true);
                            setForm((prev) => ({ ...prev, vendorId: "", vendor: "" }));
                          }}
                        >
                          + Vendor not in list? Enter manually
                        </button>
                      </>
                    )
                  ) : (
                    <>
                      <select
                        name="employeeId"
                        style={styles.input}
                        value={form.employeeId}
                        onChange={handleEmployeeSelect}
                      >
                        <option value="">Select employee...</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {employeeName(emp)}
                            {emp.department ? ` — ${emp.department}` : ""}
                          </option>
                        ))}
                      </select>
                      <span style={styles.hint}>
                        Paying more than one employee? Use "Bulk Payroll Expense" instead — it's faster.
                      </span>
                    </>
                  )}
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
                    style={
                      form.payeeType === "EMPLOYEE"
                        ? { ...styles.input, ...styles.inputDisabled }
                        : styles.input
                    }
                    value={form.payeeType === "EMPLOYEE" ? "0" : form.gstAmount}
                    onChange={handleInputChange}
                    disabled={form.payeeType === "EMPLOYEE"}
                  />
                  {form.payeeType === "EMPLOYEE" && (
                    <span style={styles.hint}>GST doesn't apply to employee payments</span>
                  )}
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
                <button type="submit" style={styles.btnSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update Expense" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* Bulk Payroll Expense Modal                    */}
      {/* ============================================ */}
      {showBulkModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, ...styles.modalContentWide }}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Bulk Payroll Expense</h3>
              <button style={styles.closeBtn} onClick={() => setShowBulkModal(false)}>
                <X size={18} />
              </button>
            </div>

            {employees.length === 0 ? (
              <p style={styles.loadingText}>No employees found. Add employees first.</p>
            ) : (
              <>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Expense Date *</label>
                    <input
                      type="date"
                      name="expenseDate"
                      style={styles.input}
                      value={bulkCommon.expenseDate}
                      onChange={handleBulkCommonChange}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category</label>
                    <input
                      type="text"
                      name="category"
                      style={styles.input}
                      value={bulkCommon.category}
                      onChange={handleBulkCommonChange}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Payment Method</label>
                    <select
                      name="paymentMethod"
                      style={styles.input}
                      value={bulkCommon.paymentMethod}
                      onChange={handleBulkCommonChange}
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
                      value={bulkCommon.status}
                      onChange={handleBulkCommonChange}
                    >
                      <option value="PAID">Paid</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                </div>

                <div style={styles.selectAllRow}>
                  <input
                    type="checkbox"
                    checked={employees.length > 0 && employees.every((emp) => bulkSelected[emp.id])}
                    onChange={toggleSelectAll}
                  />
                  Select all ({employees.length} employees)
                </div>

                <div style={styles.bulkTableWrap}>
                  <table style={styles.bulkTable}>
                    <thead>
                      <tr>
                        <th style={styles.bulkTh}></th>
                        <th style={styles.bulkTh}>Name</th>
                        <th style={styles.bulkTh}>Department</th>
                        <th style={styles.bulkTh}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id}>
                          <td style={styles.bulkTd}>
                            <input
                              type="checkbox"
                              checked={!!bulkSelected[emp.id]}
                              onChange={() => toggleBulkSelect(emp.id)}
                            />
                          </td>
                          <td style={styles.bulkTd}>{employeeName(emp)}</td>
                          <td style={styles.bulkTd}>{emp.department || "—"}</td>
                          <td style={styles.bulkTd}>
                            <input
                              type="number"
                              step="0.01"
                              style={styles.inputSmall}
                              value={bulkAmounts[emp.id] ?? ""}
                              onChange={(e) => handleBulkAmountChange(emp.id, e.target.value)}
                              disabled={!bulkSelected[emp.id]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={styles.actionsRowSpread}>
                  <span style={styles.summaryText}>
                    {selectedCount} employee{selectedCount === 1 ? "" : "s"} selected
                  </span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      style={styles.btnCancel}
                      onClick={() => setShowBulkModal(false)}
                      disabled={bulkSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      style={styles.btnSubmit}
                      onClick={handleBulkSubmit}
                      disabled={bulkSubmitting || selectedCount === 0}
                    >
                      {bulkSubmitting ? (
                        "Creating..."
                      ) : (
                        <>
                          <Check size={14} style={{ marginRight: 6 }} />
                          Create {selectedCount} Expense{selectedCount === 1 ? "" : "s"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}