import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../Services/Api";
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

const departmentOptions = ["All", "Sales", "Accounts", "Warehouse", "Admin"];
const statusFilterOptions = ["All", "Active", "Inactive"];
const genderOptions = ["Male", "Female", "Other"];

const emptyForm = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "Sales",
  designation: "",
  salary: "",
  joiningDate: "",
  gender: "Male",
  dob: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  status: "ACTIVE",
  emergencyContact: "",
  emergencyPerson: "",
};

const styles = {
  fieldError: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  inputError: { borderColor: "#dc2626" },
  errorText: { fontSize: 13, color: "#dc2626" },
  statusText: { fontSize: 13, color: colors.textSecondary },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: colors.textPrimary, gridColumn: "1 / -1", margin: "8px 0 0" },
};

const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  pincode: /^\d{6}$/,
};

function validateEmployee(form) {
  const errors = {};
  if (!form.employeeCode.trim()) errors.employeeCode = "Employee code is required";
  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!PATTERNS.email.test(form.email)) errors.email = "Enter a valid email address";
  if (form.phone && !PATTERNS.phone.test(form.phone)) errors.phone = "Enter a valid 10-digit phone number";
  if (!form.department.trim()) errors.department = "Department is required";
  if (form.salary === "" || form.salary === null || Number(form.salary) < 0) errors.salary = "Enter a valid salary";
  if (form.pincode && !PATTERNS.pincode.test(form.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
  if (form.emergencyContact && !PATTERNS.phone.test(form.emergencyContact)) errors.emergencyContact = "Enter a valid 10-digit number";
  return errors;
}

const toDisplayStatus = (s) => (s === "ACTIVE" ? "Active" : s === "INACTIVE" ? "Inactive" : s || "Active");
const toBackendStatus = (s) => (s === "Active" ? "ACTIVE" : "INACTIVE");

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
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
        const res = await getEmployees();
        if (mounted) setEmployees(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load employees.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const displayName = (e) => [e.firstName, e.lastName].filter(Boolean).join(" ");

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch = displayName(e).toLowerCase().includes(search.toLowerCase());
      const matchesDept = departmentFilter === "All" || e.department === departmentFilter;
      const matchesStatus = statusFilter === "All" || toDisplayStatus(e.status) === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, search, departmentFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEditModal(e) {
    setEditingId(e.id);
    setForm({
      ...emptyForm,
      ...e,
      salary: e.salary ?? "",
      status: e.status || "ACTIVE",
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to delete employee.");
    }
  }

  async function handleSave() {
    const errors = validateEmployee(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        salary: Number(form.salary) || 0,
        joiningDate: form.joiningDate || null,
        dob: form.dob || null,
      };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      if (editingId) {
        const res = await updateEmployee(editingId, payload);
        setEmployees((prev) => prev.map((e) => (e.id === editingId ? res.data : e)));
      } else {
        const res = await createEmployee(payload);
        setEmployees((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && typeof err.response?.data === "object") {
        setFieldErrors(err.response.data);
      } else {
        alert(err.response?.data?.message || err.response?.data || "Failed to save employee.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function adjustSalary(emp, delta) {
    const newSalary = Math.max(0, Number(emp.salary || 0) + delta);
    try {
      const payload = { ...emp, salary: newSalary };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      const res = await updateEmployee(emp.id, payload);
      setEmployees((prev) => prev.map((e) => (e.id === emp.id ? res.data : e)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to update salary.");
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
          if (fieldErrors[key]) setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
        }}
      />
      {fieldErrors[key] && <span style={styles.fieldError}>{fieldErrors[key]}</span>}
    </div>
  );

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Employees</h1>

      <div style={panel}>
        <PanelHeader title={`All Employees (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search employees"
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
              label="Department"
              value={departmentFilter}
              options={departmentOptions}
              onChange={(v) => {
                setDepartmentFilter(v);
                setPage(1);
              }}
            />
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
              <Plus size={16} /> Add Employee
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {loading ? (
          <p style={styles.statusText}>Loading employees...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Employee Name</th>
                    <th style={th}>Department</th>
                    <th style={th}>Salary</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((e) => (
                    <tr key={e.id}>
                      <td style={tdBold}>{displayName(e)}</td>
                      <td style={td}>{e.department}</td>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          ₹{Number(e.salary || 0).toLocaleString("en-IN")}
                          <button
                            type="button"
                            style={{ ...iconButton, width: 24, height: 24, color: colors.success }}
                            title="Increment"
                            onClick={() => adjustSalary(e, 1000)}
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            style={{ ...iconButton, width: 24, height: 24, color: colors.danger }}
                            title="Decrement"
                            onClick={() => adjustSalary(e, -1000)}
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </td>
                      <td style={td}>
                        <Badge status={toDisplayStatus(e.status)} />
                      </td>
                      <td style={td}>
                        <div style={actionCell}>
                          <button type="button" style={iconButton} title="Edit" onClick={() => openEditModal(e)}>
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            style={{ ...iconButton, color: colors.danger }}
                            title="Delete"
                            onClick={() => handleDelete(e.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td style={td} colSpan={5}>
                        No employees found.
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
        title={editingId ? "Edit Employee" : "Add Employee"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Employee"}
            </button>
          </>
        }
      >
        <div style={formGrid}>
          <h4 style={styles.sectionTitle}>Basic Details</h4>
          {field("Employee Code", "employeeCode")}
          {field("First Name", "firstName")}
          {field("Last Name", "lastName")}
          {field("Email", "email")}
          {field("Phone", "phone")}

          <div style={formGroup}>
            <label style={formLabel}>Department</label>
            <select style={formInput} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              {departmentOptions.filter((d) => d !== "All").map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {field("Designation", "designation")}
          {field("Salary (₹)", "salary", "number")}
          {field("Joining Date", "joiningDate", "date")}

          <div style={formGroup}>
            <label style={formLabel}>Gender</label>
            <select style={formInput} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              {genderOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          {field("Date of Birth", "dob", "date")}

          <div style={formGroup}>
            <label style={formLabel}>Status</label>
            <select
              style={formInput}
              value={toDisplayStatus(form.status)}
              onChange={(e) => setForm({ ...form, status: toBackendStatus(e.target.value) })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

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

          <h4 style={styles.sectionTitle}>Emergency Contact</h4>
          {field("Emergency Contact Number", "emergencyContact")}
          {field("Emergency Contact Person", "emergencyPerson")}
        </div>
      </Modal>
    </div>
  );
}