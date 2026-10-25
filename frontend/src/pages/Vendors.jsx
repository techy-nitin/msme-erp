import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { getVendors, createVendor, updateVendor, deleteVendor } from "../Services/Api";
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
  formGrid,
  formGroup,
  formLabel,
  formInput,
} from "../styles/theme";

const PAGE_SIZE = 5;

const emptyForm = {
  vendorName: "",
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
    gridColumn: "1 / -1",
    margin: "8px 0 0",
  },
};

const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  pincode: /^\d{6}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
};

function validateVendor(form) {
  const errors = {};
  if (!form.vendorName.trim()) errors.vendorName = "Vendor name is required";
  if (form.email && !PATTERNS.email.test(form.email)) errors.email = "Enter a valid email address";
  if (form.phone && !PATTERNS.phone.test(form.phone)) errors.phone = "Enter a valid 10-digit phone number";
  if (form.pincode && !PATTERNS.pincode.test(form.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
  if (form.gstNumber && !PATTERNS.gst.test(form.gstNumber)) errors.gstNumber = "Enter a valid GST number";
  return errors;
}

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
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
        const res = await getVendors();
        if (mounted) setVendors(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load vendors.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const haystack = `${v.vendorName || ""} ${v.companyName || ""} ${v.gstNumber || ""}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [vendors, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEditModal(v) {
    setEditingId(v.id);
    setForm({ ...emptyForm, ...v });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await deleteVendor(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to delete vendor.");
    }
  }

  async function handleSave() {
    const errors = validateVendor(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      if (editingId) {
        const res = await updateVendor(editingId, payload);
        setVendors((prev) => prev.map((v) => (v.id === editingId ? res.data : v)));
      } else {
        const res = await createVendor(payload);
        setVendors((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && typeof err.response?.data === "object") {
        setFieldErrors(err.response.data);
      } else {
        alert(err.response?.data?.message || err.response?.data || "Failed to save vendor.");
      }
    } finally {
      setSaving(false);
    }
  }

  const field = (label, key, type = "text") => (
    <div style={formGroup} key={key}>
      <label style={formLabel}>{label}</label>
      <input
        type={type}
        style={fieldErrors[key] ? { ...formInput, ...styles.inputError } : formInput}
        value={form[key] ?? ""}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value });
          if (fieldErrors[key])
            setFieldErrors((p) => {
              const n = { ...p };
              delete n[key];
              return n;
            });
        }}
      />
      {fieldErrors[key] && <span style={styles.fieldError}>{fieldErrors[key]}</span>}
    </div>
  );

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Vendors</h1>

      <div style={panel}>
        <PanelHeader title={`All Vendors (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search vendors, company, GST number"
              style={searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div style={toolbarRight}>
            <button type="button" style={primaryButton} onClick={openAddModal}>
              <Plus size={16} /> Add Vendor
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {loading ? (
          <p style={styles.statusText}>Loading vendors...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Vendor Name</th>
                    <th style={th}>Company</th>
                    <th style={th}>Contact</th>
                    <th style={th}>GST Number</th>
                    <th style={th}>Location</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((v) => (
                    <tr key={v.id}>
                      <td style={tdBold}>{v.vendorName}</td>
                      <td style={td}>{v.companyName || "—"}</td>
                      <td style={tdMuted}>
                        {v.phone || "—"}
                        {v.email ? ` · ${v.email}` : ""}
                      </td>
                      <td style={tdMuted}>{v.gstNumber || "—"}</td>
                      <td style={tdMuted}>
                        {[v.city, v.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td style={td}>
                        <div style={actionCell}>
                          <button type="button" style={iconButton} title="Edit" onClick={() => openEditModal(v)}>
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            style={{ ...iconButton, color: colors.danger }}
                            title="Delete"
                            onClick={() => handleDelete(v.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td style={td} colSpan={6}>
                        No vendors found.
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
        title={editingId ? "Edit Vendor" : "Add Vendor"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Vendor"}
            </button>
          </>
        }
      >
        <div style={formGrid}>
          <h4 style={styles.sectionTitle}>Basic Details</h4>
          {field("Vendor Name", "vendorName")}
          {field("Company Name", "companyName")}
          {field("Email", "email")}
          {field("Phone", "phone")}
          {field("GST Number", "gstNumber")}

          <h4 style={styles.sectionTitle}>Address</h4>
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