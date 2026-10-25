import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Eye, Wallet, Banknote, Clock3 } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import { getPayments, createPayment, getInvoices, getClients } from "../Services/Api";
import {
  colors,
  panel,
  pageWrap,
  pageTitle,
  toolbarRow,
  toolbarRight,
  searchWrap,
  searchIcon,
  searchInput,
  primaryButton,
  secondaryButton,
  iconButton,
  table,
  th,
  td,
  tdBold,
  tdMuted,
  tableWrap,
  actionCell,
  formGroup,
  formLabel,
  formInput,
  statsRow,
} from "../styles/theme";

const PAGE_SIZE = 5;

const modeOptions = ["Cash", "UPI", "Bank Transfer", "Cheque", "Card"];
const statusOptions = [
  "SUCCESS",
  "PENDING",
  "FAILED",
  "REFUNDED",
];const statusFilterOptions = ["All", "PAID", "PENDING", "OVERDUE"];

// Helper defined at the module level so emptyForm can safely use it
const today = () => new Date().toISOString().split("T")[0];

const emptyForm = {
  invoiceId: "",
  paymentDate: today(),
  paymentMethod: modeOptions[0],
  amount: "",
  transactionReference: "",
status: "SUCCESS",
  remarks: "",
};

const styles = {
  fieldError: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  inputError: { borderColor: "#dc2626" },
  errorText: { fontSize: 13, color: "#dc2626" },
  statusText: { fontSize: 13, color: colors.textSecondary },
};

function validatePayment(form) {
  const errors = {};
  if (!form.invoiceId) errors.invoiceId = "Invoice is required";
  if (!form.paymentDate) errors.paymentDate = "Payment date is required";
  else if (new Date(form.paymentDate) > new Date()) errors.paymentDate = "Payment date cannot be in the future";
  if (!form.paymentMethod) errors.paymentMethod = "Payment method is required";
  if (form.amount === "" || Number(form.amount) <= 0) errors.amount = "Enter an amount greater than 0";
  return errors;
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      const [paymentsRes, invoicesRes, clientsRes] =
        await Promise.allSettled([
          getPayments(),
          getInvoices(),
          getClients(),
        ]);

      if (!mounted) return;

      if (paymentsRes.status === "fulfilled") {
        setPayments(paymentsRes.value.data);
      } else {
        console.error(paymentsRes.reason);
        setError((prev) => prev + " Failed to load payments.");
      }

      if (invoicesRes.status === "fulfilled") {
        setInvoices(invoicesRes.value.data);
      } else {
        console.error(invoicesRes.reason);
        setError((prev) => prev + " Failed to load invoices.");
      }

      if (clientsRes.status === "fulfilled") {
        setClients(clientsRes.value.data);
      } else {
        console.error(clientsRes.reason);
        setError((prev) => prev + " Failed to load clients.");
      }

      setLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const clientNameById = useMemo(() => {
    const map = {};
    clients.forEach((c) => { map[c.id] = c.customerName; });
    return map;
  }, [clients]);

  const invoiceById = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => { map[inv.id] = inv; });
    return map;
  }, [invoices]);

  const invoiceLabel = (inv) =>
    `${inv.invoiceNumber} — ${clientNameById[inv.customerId] || "Unknown client"} (₹${Number(inv.totalAmount || 0).toLocaleString("en-IN")})`;

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const inv = invoiceById[p.invoiceId];
      const q = search.toLowerCase();
      const matchesSearch =
        (inv?.invoiceNumber || "").toLowerCase().includes(q) ||
        (p.transactionReference || "").toLowerCase().includes(q) ||
        (clientNameById[inv?.customerId] || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, invoiceById, clientNameById, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalCollected = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((s, p) => s + Number(p.amount || 0), 0);
  const pendingCount = payments.filter((p) => p.status !== "SUCCESS").length;

  const totalInvoiced = invoices.reduce((s, inv) => s + Number(inv.totalAmount || 0), 0);
  const outstanding = Math.max(0, totalInvoiced - totalCollected);

  function openRecordModal() {
    setForm({ ...emptyForm, invoiceId: invoices[0]?.id ?? "" });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleRecord() {
    const errors = validatePayment(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        invoiceId: Number(form.invoiceId),
        paymentDate: form.paymentDate,
        paymentMethod: form.paymentMethod,
        amount: Number(form.amount),
        transactionReference: form.transactionReference,
        status: form.status,
        remarks: form.remarks,
      };
      const res = await createPayment(payload);
      setPayments((prev) => [res.data, ...prev]);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && typeof err.response?.data === "object") {
        setFieldErrors(err.response.data);
      } else {
        alert(err.response?.data?.message || err.response?.data || "Failed to record payment.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Payments</h1>

      <div style={statsRow}>
        <StatCard label="Total Collected" value={`₹${totalCollected.toLocaleString("en-IN")}`} icon={Wallet} />
        <StatCard label="Pending / Overdue" value={pendingCount} icon={Clock3} />
        <StatCard label="Outstanding Amount" value={`₹${outstanding.toLocaleString("en-IN")}`} icon={Banknote} />
      </div>

      <div style={panel}>
        <PanelHeader title={`Payment History (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search by invoice, client or reference"
              style={searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div style={toolbarRight}>
            <Dropdown
              label="Status"
              value={statusFilter}
              options={statusFilterOptions}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            />
            <button type="button" style={primaryButton} onClick={openRecordModal} disabled={invoices.length === 0}>
              <Plus size={16} /> Record Payment
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {invoices.length === 0 && !loading && (
          <p style={styles.statusText}>No invoices found — create an invoice before recording a payment.</p>
        )}
        {loading ? (
          <p style={styles.statusText}>Loading payments...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Payment ID</th>
                    <th style={th}>Client</th>
                    <th style={th}>Invoice #</th>
                    <th style={th}>Amount</th>
                    <th style={th}>Mode</th>
                    <th style={th}>Date</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p) => {
                    const inv = invoiceById[p.invoiceId];
                    return (
                      <tr key={p.id}>
                        <td style={tdBold}>{`PAY-${p.id}`}</td>
                        <td style={td}>{clientNameById[inv?.customerId] || "—"}</td>
                        <td style={tdMuted}>{inv?.invoiceNumber || `#${p.invoiceId}`}</td>
                        <td style={tdBold}>₹{Number(p.amount || 0).toLocaleString("en-IN")}</td>
                        <td style={td}>{p.paymentMethod}</td>
                        <td style={tdMuted}>{p.paymentDate}</td>
                        <td style={td}>
                          <Badge status={p.status} />
                        </td>
                        <td style={td}>
                          <div style={actionCell}>
                            <button type="button" style={iconButton} title="View" onClick={() => alert(JSON.stringify(p, null, 2))}>
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paged.length === 0 && (
                    <tr>
                      <td style={td} colSpan={8}>
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        title="Record Payment"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleRecord} disabled={saving}>
              {saving ? "Saving..." : "Record Payment"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={formGroup}>
            <label style={formLabel}>Invoice</label>
            <select
              style={fieldErrors.invoiceId ? { ...formInput, ...styles.inputError } : formInput}
              value={form.invoiceId}
              onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}
            >
              <option value="">Select invoice</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>{invoiceLabel(inv)}</option>
              ))}
            </select>
            {fieldErrors.invoiceId && <span style={styles.fieldError}>{fieldErrors.invoiceId}</span>}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Amount (₹)</label>
            <input
              type="number"
              style={fieldErrors.amount ? { ...formInput, ...styles.inputError } : formInput}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            {fieldErrors.amount && <span style={styles.fieldError}>{fieldErrors.amount}</span>}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Payment Mode</label>
            <select
              style={formInput}
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              {modeOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Date</label>
            <input
              type="date"
              style={fieldErrors.paymentDate ? { ...formInput, ...styles.inputError } : formInput}
              value={form.paymentDate}
              onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
            />
            {fieldErrors.paymentDate && <span style={styles.fieldError}>{fieldErrors.paymentDate}</span>}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Status</label>
            <select style={formInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Transaction Reference</label>
            <input
              style={formInput}
              value={form.transactionReference}
              onChange={(e) => setForm({ ...form, transactionReference: e.target.value })}
              placeholder="UTR / cheque no. / txn ID"
            />
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Remarks</label>
            <input
              style={formInput}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}