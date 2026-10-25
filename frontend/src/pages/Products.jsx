import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../Services/Api";
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
  categoryId: "",
  productName: "",
  description: "",
  hsnCode: "",
  unit: "",
  price: "",
  gstPercentage: "18",
  stockQuantity: "",
};

const styles = {
  fieldError: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  inputError: { borderColor: "#dc2626" },
  errorText: { fontSize: 13, color: "#dc2626" },
  statusText: { fontSize: 13, color: colors.textSecondary },
};

function stockStatus(stock) {
  if (stock === 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
}

function validateProduct(form) {
  const errors = {};
  if (!form.categoryId) errors.categoryId = "Category is required";
  if (!form.productName.trim()) errors.productName = "Product name is required";
  if (form.price === "" || Number(form.price) < 0) errors.price = "Enter a valid price";
  if (form.gstPercentage !== "" && Number(form.gstPercentage) < 0) errors.gstPercentage = "GST % must be positive";
  if (form.stockQuantity !== "" && Number(form.stockQuantity) < 0) errors.stockQuantity = "Stock cannot be negative";
  return errors;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
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
        const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
        if (mounted) {
          setProducts(prodRes.data);
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load products.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const categoryOptions = ["All", ...categories.map((c) => c.categoryName)];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.productName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.categoryName === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEditModal(p) {
    setEditingId(p.id);
    setForm({
      categoryId: p.categoryId ?? "",
      productName: p.productName ?? "",
      description: p.description ?? "",
      hsnCode: p.hsnCode ?? "",
      unit: p.unit ?? "",
      price: p.price ?? "",
      gstPercentage: p.gstPercentage ?? "",
      stockQuantity: p.stockQuantity ?? "",
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to delete product.");
    }
  }

  async function handleSave() {
    const errors = validateProduct(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        categoryId: Number(form.categoryId),
        productName: form.productName,
        description: form.description,
        hsnCode: form.hsnCode,
        unit: form.unit,
        price: Number(form.price) || 0,
        gstPercentage: Number(form.gstPercentage) || 0,
        stockQuantity: Number(form.stockQuantity) || 0,
      };

      if (editingId) {
        const res = await updateProduct(editingId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
      } else {
        const res = await createProduct(payload);
        setProducts((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && typeof err.response?.data === "object") {
        setFieldErrors(err.response.data);
      } else {
        alert(err.response?.data?.message || err.response?.data || "Failed to save product.");
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
          if (fieldErrors[key]) setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
        }}
      />
      {fieldErrors[key] && <span style={styles.fieldError}>{fieldErrors[key]}</span>}
    </div>
  );

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Products</h1>

      <div style={panel}>
        <PanelHeader title={`All Products (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search products"
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
              label="Category"
              value={categoryFilter}
              options={categoryOptions}
              onChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
            />
            <button type="button" style={primaryButton} onClick={openAddModal} disabled={categories.length === 0}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {categories.length === 0 && !loading && (
          <p style={styles.statusText}>Add a category first before creating products.</p>
        )}
        {loading ? (
          <p style={styles.statusText}>Loading products...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Product Name</th>
                    <th style={th}>Category</th>
                    <th style={th}>Price</th>
                    <th style={th}>GST %</th>
                    <th style={th}>Stock</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p) => (
                    <tr key={p.id}>
                      <td style={tdBold}>{p.productName}</td>
                      <td style={td}>{p.categoryName}</td>
                      <td style={td}>₹{Number(p.price || 0).toLocaleString("en-IN")}</td>
                      <td style={tdMuted}>{p.gstPercentage}%</td>
                      <td style={td}>{p.stockQuantity}</td>
                      <td style={td}>
                        <Badge status={stockStatus(p.stockQuantity)} />
                      </td>
                      <td style={td}>
                        <div style={actionCell}>
                          <button type="button" style={iconButton} title="Edit" onClick={() => openEditModal(p)}>
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            style={{ ...iconButton, color: colors.danger }}
                            title="Delete"
                            onClick={() => handleDelete(p.id)}
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
                        No products found.
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
        title={editingId ? "Edit Product" : "Add Product"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Product"}
            </button>
          </>
        }
      >
        <div style={formGrid}>
          <div style={{ ...formGroup, gridColumn: "1 / -1" }}>
            <label style={formLabel}>Product Name</label>
            <input
              style={fieldErrors.productName ? { ...formInput, ...styles.inputError } : formInput}
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
            />
            {fieldErrors.productName && <span style={styles.fieldError}>{fieldErrors.productName}</span>}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Category</label>
            <select
              style={fieldErrors.categoryId ? { ...formInput, ...styles.inputError } : formInput}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.categoryName}</option>
              ))}
            </select>
            {fieldErrors.categoryId && <span style={styles.fieldError}>{fieldErrors.categoryId}</span>}
          </div>

          {field("Price (₹)", "price", "number")}
          {field("GST %", "gstPercentage", "number")}
          {field("Stock Quantity", "stockQuantity", "number")}
          {field("HSN Code", "hsnCode")}
          {field("Unit", "unit")}

          <div style={{ ...formGroup, gridColumn: "1 / -1" }}>
            <label style={formLabel}>Description</label>
            <input
              style={formInput}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}