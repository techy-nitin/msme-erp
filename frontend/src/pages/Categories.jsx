import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../Services/Api";
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
} from "../styles/theme";

const PAGE_SIZE = 5;
const emptyForm = { categoryName: "", description: "" };

const styles = {
  fieldError: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  inputError: { borderColor: "#dc2626" },
  errorText: { fontSize: 13, color: "#dc2626" },
  statusText: { fontSize: 13, color: colors.textSecondary },
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({}); // Unified validation error tracking
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCategories();
        if (mounted) setCategories(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load categories.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(
    () => categories.filter((c) => c.categoryName.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(c) {
    setEditingId(c.id);
    setForm({
      categoryName: c.categoryName,
      description: c.description || "",
    });
    setErrors({});
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to delete category. It may still have products linked to it.");
    }
  }

  function validateForm() {
    const newErrors = {};

    // Category Name validation
    if (!form.categoryName.trim()) {
      newErrors.categoryName = "Category name is required.";
    } else if (form.categoryName.trim().length < 3) {
      newErrors.categoryName = "Category name must be at least 3 characters.";
    } else if (form.categoryName.trim().length > 50) {
      newErrors.categoryName = "Category name cannot exceed 50 characters.";
    }

    // Description validation
    if (form.description.trim().length > 200) {
      newErrors.description = "Description cannot exceed 200 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    // 1. Run local input validation checking first
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingId) {
        const res = await updateCategory(editingId, form);
        setCategories((prev) => prev.map((c) => (c.id === editingId ? res.data : c)));
      } else {
        const res = await createCategory(form);
        setCategories((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.categoryName || err.response?.data?.message || err.response?.data || "Failed to save category.";
      setErrors({ apiError: typeof msg === "string" ? msg : "Failed to save category." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Categories</h1>

      <div style={panel}>
        <PanelHeader title={`All Categories (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search categories"
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
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {loading ? (
          <p style={styles.statusText}>Loading categories...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Category Name</th>
                    <th style={th}>Description</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((c) => (
                    <tr key={c.id}>
                      <td style={tdBold}>{c.categoryName}</td>
                      <td style={tdMuted}>{c.description}</td>
                      <td style={td}>
                        <div style={actionCell}>
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
                      <td style={td} colSpan={3}>
                        No categories found.
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
        title={editingId ? "Edit Category" : "Add Category"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Category"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {errors.apiError && <p style={styles.errorText}>{errors.apiError}</p>}
          
          <div style={formGroup}>
            <label style={formLabel}>Category Name</label>
            <input
              style={errors.categoryName ? { ...formInput, ...styles.inputError } : formInput}
              value={form.categoryName}
              onChange={(e) => { 
                setForm({ ...form, categoryName: e.target.value }); 
                setErrors((prev) => ({ ...prev, categoryName: "" })); 
              }}
            />
            {errors.categoryName && <span style={styles.fieldError}>{errors.categoryName}</span>}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Description</label>
            <input
              style={errors.description ? { ...formInput, ...styles.inputError } : formInput}
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
            />
            {errors.description && <span style={styles.fieldError}>{errors.description}</span>}
          </div>
        </div>
      </Modal>
    </div>
  );
}