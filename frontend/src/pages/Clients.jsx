import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { getClients, createClient, updateClient, deleteClient } from "../Services/Api";

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
  iconButton,
  table,
  th,
  td,
  tdBold,
  tdMuted,
  tableWrap,
  actionCell,
  formGrid,
  formGroup,
  formLabel,
  formInput,
  secondaryButton,
} from "../styles/theme";

const PAGE_SIZE = 5;

const statusFilterOptions = ["All", "Active", "Inactive"];

const emptyForm = {
  customerName: "",
  companyName: "",
  email: "",
  phone: "",
  gstNumber: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
};

const styles = {
  fieldError: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  inputError: { borderColor: "#dc2626" },
  errorText: { fontSize: 13, color: "#dc2626" },
  statusText: { fontSize: 13, color: colors.textSecondary },
};

// backend has no `status` field yet — kept client-side only, see note below.
const STATUS_KEY = "clientStatuses";
function loadStatuses() {
  try { return JSON.parse(localStorage.getItem(STATUS_KEY)) || {}; }
  catch { return {}; }
}
function saveStatuses(map) {
  localStorage.setItem(STATUS_KEY, JSON.stringify(map));
}

const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  gstNumber: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  pincode: /^\d{6}$/,
};

function validateClient(form) {
  const errors = {};
  if (!form.customerName.trim()) errors.customerName = "Customer name is required";
  if (form.email && !PATTERNS.email.test(form.email)) errors.email = "Enter a valid email address";
  if (form.phone && !PATTERNS.phone.test(form.phone)) errors.phone = "Enter a valid 10-digit phone number";
  if (form.gstNumber && !PATTERNS.gstNumber.test(form.gstNumber)) errors.gstNumber = "Enter a valid GST number";
  if (form.pincode && !PATTERNS.pincode.test(form.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState(loadStatuses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getClients();
        if (mounted) setClients(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load clients.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const withStatus = (c) => ({ ...c, status: statuses[c.id] || "Active" });

  const filtered = useMemo(() => {
    return clients.map(withStatus).filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (c.customerName || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.gstNumber || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, statuses, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEditModal(client) {
    setEditingId(client.id);
    setForm({ ...emptyForm, ...client });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this client?")) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to delete client.");
    }
  }

  async function handleSave() {
    const errors = validateClient(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id;
      delete payload.status;
      delete payload.createdAt;
      delete payload.updatedAt;

      if (editingId) {
        const res = await updateClient(editingId, payload);
        setClients((prev) => prev.map((c) => (c.id === editingId ? res.data : c)));
      } else {
        const res = await createClient(payload);
        setClients((prev) => [...prev, res.data]);
        // new clients default to Active in local status map
        const next = { ...statuses, [res.data.id]: "Active" };
        setStatuses(next);
        saveStatuses(next);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && typeof err.response?.data === "object") {
        setFieldErrors(err.response.data);
      } else {
        alert(err.response?.data?.message || err.response?.data || "Failed to save client.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleStatusToggle(client) {
    const next = { ...statuses, [client.id]: client.status === "Active" ? "Inactive" : "Active" };
    setStatuses(next);
    saveStatuses(next);
  }

  const field = (label, key, placeholder) => (
    <div style={formGroup} key={key}>
      <label style={formLabel}>{label}</label>
      <input
        style={fieldErrors[key] ? { ...formInput, ...styles.inputError } : formInput}
        placeholder={placeholder}
        value={form[key] ?? ""}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value });
          if (fieldErrors[key]) setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
        }}
      />
      {fieldErrors[key] && <span style={styles.fieldError}>{fieldErrors[key]}</span>}
    </div>
  );

  return (
    <div style={pageWrap}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={pageTitle}>Clients</h1>
      </div>

      <div style={panel}>
        <PanelHeader title={`All Clients (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email or GST"
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
            <button type="button" style={primaryButton} onClick={openAddModal}>
              <Plus size={16} /> Add Client
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {loading ? (
          <p style={styles.statusText}>Loading clients...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Client Name</th>
                    <th style={th}>GST Number</th>
                    <th style={th}>Mobile</th>
                    <th style={th}>Email</th>
                    <th style={th}>Address</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((c) => (
                    <tr key={c.id}>
                      <td style={tdBold}>{c.customerName}</td>
                      <td style={tdMuted}>{c.gstNumber}</td>
                      <td style={td}>{c.phone}</td>
                      <td style={td}>{c.email}</td>
                      <td style={tdMuted}>{[c.address, c.city, c.state].filter(Boolean).join(", ")}</td>
                      <td style={td}>
                        <span style={{ cursor: "pointer" }} onClick={() => handleStatusToggle(c)} title="Click to toggle (stored locally only)">
                          <Badge status={c.status} />
                        </span>
                      </td>
                      <td style={td}>
                        <div style={actionCell}>
                          <button type="button" style={iconButton} title="View" onClick={() => alert(JSON.stringify(c, null, 2))}>
                            <Eye size={14} />
                          </button>
                          <button type="button" style={iconButton} title="Edit" onClick={() => openEditModal(c)}>
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            style={{ ...iconButton, color: colors.danger }}
                            title="Delete"
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td style={td} colSpan={7}>
                        No clients found.
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
        title={editingId ? "Edit Client" : "Add Client"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Client"}
            </button>
          </>
        }
      >
        <div style={formGrid}>
          {field("Customer Name", "customerName")}
          {field("Company Name", "companyName")}
          {field("GST Number", "gstNumber")}
          {field("Phone", "phone")}
          {field("Email", "email")}
          <div style={{ ...formGroup, gridColumn: "1 / -1" }}>
            <label style={formLabel}>Address</label>
            <input
              style={fieldErrors.address ? { ...formInput, ...styles.inputError } : formInput}
              value={form.address ?? ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          {field("City", "city")}
          {field("State", "state")}
          {field("Country", "country")}
          {field("Pincode", "pincode")}
        </div>
      </Modal>
    </div>
  );
}