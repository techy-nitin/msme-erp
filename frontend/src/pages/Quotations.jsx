import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  X,
  Mail,
  MessageCircle,
  Loader2,
} from "lucide-react";
import PanelHeader from "../components/PanelHeader";
import Dropdown from "../components/Dropdown";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";

import {
  getQuotations,
  createQuotation,
  deleteQuotation,
  getQuotation,
  getClients,
  getProducts,
  sendQuotationEmail,
  sendQuotationWhatsapp,
  downloadQuotationPdf,
} from "../services/Api";
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

const statusFilterOptions = ["All", "Draft", "Approved", "Rejected"];

// Backend statuses vs. what the UI shows as filter/badge labels.
const STATUS_TO_UI = { PENDING: "Draft", APPROVED: "Approved", REJECTED: "Rejected" };

// Reads a usable message out of an axios error, calling out auth failures
// specifically since 401/403 are the most common integration snag and the
// raw axios message ("Request failed with status code 403") isn't useful.
function getErrorMessage(err) {
  const status = err?.response?.status;
  if (status === 401) return "You're not logged in (or your session expired). Please log in again.";
  if (status === 403) return "You're logged in, but not authorized to do this. Check your account's role/permissions.";
  return err?.response?.data?.message || err.message || "Something went wrong.";
}

function emptyLineItem(products = []) {
  if (products.length === 0) {
    return { productId: "", product: "", qty: 1, price: 0 };
  }
  const first = products[0];
  return {
    productId: first.id,
    product: first.productName,
    qty: 1,
    price: Number(first.price),
  };
}

// Maps a backend QuotationResponse into the shape the table renders.
function mapQuotationForTable(q, clientsList) {
  const customer = clientsList.find((c) => c.id === q.customerId)?.customerName || "Unknown";

  return {
    id: q.quotationNumber,
    backendId: q.id,
    client: customer,
    date: q.quotationDate
      ? new Date(q.quotationDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
    total: Number(q.totalAmount),
    status: STATUS_TO_UI[q.status] || q.status,
    raw: q,
  };
}

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
const [downloadingId, setDownloadingId] = useState(null);
const [sendingEmailId, setSendingEmailId] = useState(null);
const [sendingWhatsappId, setSendingWhatsappId] = useState(null);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientId, setClientId] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [gstPercent, setGstPercent] = useState(18);

  // Loads quotations against a specific clients list, so callers control
  // exactly which client data was used for the customer-name lookup
  // instead of relying on possibly-stale component state.
  async function loadQuotations(clientsList) {
    const res = await getQuotations();
    setQuotations(res.data.map((q) => mapQuotationForTable(q, clientsList)));
  }

  // Initial load: fetch clients + products first (quotations need client
  // data to resolve customer names), then quotations. Runs once.
  useEffect(() => {
    async function initialize() {
      setLoading(true);
      setError("");
      try {
        const [clientsRes, productsRes] = await Promise.all([getClients(), getProducts()]);

        setClients(clientsRes.data);
        setProducts(productsRes.data);
        if (clientsRes.data.length > 0) setClientId(clientsRes.data[0].id);
        if (productsRes.data.length > 0) setLineItems([emptyLineItem(productsRes.data)]);

        await loadQuotations(clientsRes.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const matchesSearch =
        q.id.toLowerCase().includes(search.toLowerCase()) || q.client.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const subtotal = lineItems.reduce((sum, li) => sum + li.qty * li.price, 0);
  const gstAmount = (subtotal * gstPercent) / 100;
  const grandTotal = Math.max(0, subtotal + gstAmount - Number(discount || 0));

  function updateLineItem(index, field, value) {
    setLineItems((prev) =>
      prev.map((li, i) => {
        if (i !== index) return li;

        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          if (!product) return li; // guard: ignore selection we can't resolve
          return { ...li, productId: product.id, product: product.productName, price: Number(product.price) };
        }

        if (field === "qty") {
          // Fall back to 1 instead of letting an empty/invalid input zero
          // out this line's total.
          const qty = Number(value);
          return { ...li, qty: Number.isFinite(qty) && qty > 0 ? qty : 1 };
        }

        return { ...li, [field]: value };
      })
    );
  }

  function addLineItem() {
    if (products.length === 0) return;
    setLineItems((prev) => [...prev, emptyLineItem(products)]);
  }

  function removeLineItem(index) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  function openCreateModal() {
    if (clients.length === 0 || products.length === 0) {
      setError("Clients and products must load before you can create a quotation.");
      return;
    }
    setClientId(clients[0].id);
    setLineItems([emptyLineItem(products)]);
    setDiscount(0);
    setGstPercent(18);
    setError("");
    setModalOpen(true);
  }

  async function handleCreate() {
    const payload = {
      customerId: Number(clientId),
      quotationDate: new Date().toISOString().slice(0, 10),
      validUntil: null,
      status: "PENDING",
      notes: "",
      items: lineItems.map((li) => ({
        productId: Number(li.productId),
        quantity: Number(li.qty),
        unitPrice: Number(li.price),
        discount: 0,
        gstPercentage: gstPercent,
      })),
    };

    setSaving(true);
    setError("");
    try {
      await createQuotation(payload);
      setModalOpen(false);
      await loadQuotations(clients);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm("Delete this quotation?")) return;
    try {
      await deleteQuotation(row.backendId);
      setQuotations((prev) => prev.filter((q) => q.backendId !== row.backendId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleView(row) {
    try {
      const res = await getQuotation(row.backendId);
      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      alert(`Could not load quotation details: ${getErrorMessage(err)}`);
    }
  }
const handleSendEmail = async (quotation) => {
  try {
    setSendingEmailId(quotation.backendId);

    await sendQuotationEmail(quotation.backendId);

    alert("Quotation emailed successfully.");
  } catch (err) {
    alert(getErrorMessage(err));
  } finally {
    setSendingEmailId(null);
  }
};
const handleSendWhatsapp = async (quotation) => {
  try {
    setSendingWhatsappId(quotation.backendId);

    const res = await sendQuotationWhatsapp(quotation.backendId);

window.open(res.data.whatsappUrl, "_blank");  } catch (err) {
    alert(getErrorMessage(err));
  } finally {
    setSendingWhatsappId(null);
  }
};
async function handleViewPdf(quotation) {
  try {
    setDownloadingId(quotation.backendId);

    const response = await downloadQuotationPdf(quotation.backendId);

    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(file);

    window.open(url, "_blank");
  } catch (err) {
    console.error(err);
    alert("Unable to open quotation PDF.");
  } finally {
    setDownloadingId(null);
  }
}
  const formReady = clients.length > 0 && products.length > 0;

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Quotations</h1>

      <div style={panel}>
        <PanelHeader title={`All Quotations (${filtered.length})`} />

        {error && <div style={{ color: colors.danger, fontSize: 13, padding: "8px 16px" }}>{error}</div>}

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search by quotation # or client"
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
            <button type="button" style={primaryButton} onClick={openCreateModal}>
              <Plus size={16} /> Create Quotation
            </button>
          </div>
        </div>

        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Quotation #</th>
                <th style={th}>Client</th>
                <th style={th}>Date</th>
                <th style={th}>Total</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td style={td} colSpan={6}>
                    Loading quotations...
                  </td>
                </tr>
              )}
              {!loading &&
                paged.map((q) => (
                  <tr key={q.backendId}>
                    <td style={tdBold}>{q.id}</td>
                    <td style={td}>{q.client}</td>
                    <td style={tdMuted}>{q.date}</td>
                    <td style={tdBold}>₹{q.total.toLocaleString("en-IN")}</td>
                    <td style={td}>
                      <Badge status={q.status} />
                    </td>
                    <td style={td}>
                      <div style={actionCell}>
                       <button
  type="button"
  style={iconButton}
  title="View PDF"
  onClick={() => handleViewPdf(q)}
  disabled={downloadingId === q.backendId}
>
  {downloadingId === q.backendId ? (
    <Loader2 size={14} className="animate-spin" />
  ) : (
    <Eye size={14} />
  )}
</button>
                        <button
  type="button"
  style={{
    ...iconButton,
    color: "#2563eb",
  }}
  title="Send Email"
  onClick={() => handleSendEmail(q)}
  disabled={sendingEmailId === q.backendId}
>
  {sendingEmailId === q.backendId ? (
    <Loader2 size={14} className="animate-spin" />
  ) : (
    <Mail size={14} />
  )}
</button>
<button
  type="button"
  style={{
    ...iconButton,
    color: "#25D366",
  }}
  title="Send WhatsApp"
  onClick={() => handleSendWhatsapp(q)}
  disabled={sendingWhatsappId === q.backendId}
>
  {sendingWhatsappId === q.backendId ? (
    <Loader2 size={14} className="animate-spin" />
  ) : (
    <MessageCircle size={14} />
  )}
</button>
                        <button
                          type="button"
                          style={{ ...iconButton, color: colors.danger }}
                          title="Delete"
                          onClick={() => handleDelete(q)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && paged.length === 0 && (
                <tr>
                  <td style={td} colSpan={6}>
                    No quotations found.
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
      </div>

      <Modal
        open={modalOpen}
        title="Create Quotation"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleCreate} disabled={saving || !formReady}>
              {saving ? "Saving..." : "Save as Draft"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={formGroup}>
            <label style={formLabel}>Client</label>
            <select style={formInput} value={clientId} onChange={(e) => setClientId(Number(e.target.value))}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Line Items</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lineItems.map((li, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <select
                    style={{ ...formInput, flex: 2, minWidth: 180 }}
                    value={li.productId}
                    onChange={(e) => updateLineItem(i, "productId", Number(e.target.value))}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.productName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    style={{ ...formInput, width: 70 }}
                    value={li.qty}
                    onChange={(e) => updateLineItem(i, "qty", e.target.value)}
                  />
                  <span style={{ fontSize: 13, color: colors.textMuted, minWidth: 90 }}>
                    ₹{Number(li.qty * li.price).toLocaleString("en-IN")}
                  </span>
                  <button
                    type="button"
                    style={{ ...iconButton, color: colors.danger }}
                    onClick={() => removeLineItem(i)}
                    disabled={lineItems.length === 1}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                style={{ ...secondaryButton, alignSelf: "flex-start", padding: "6px 12px" }}
                onClick={addLineItem}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={formGroup}>
              <label style={formLabel}>GST %</label>
              <input
                type="number"
                style={formInput}
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value) || 0)}
              />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Discount (₹)</label>
              <input
                type="number"
                style={formInput}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${colors.border}`,
              paddingTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: colors.textMuted }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: colors.textMuted }}>
              <span>GST ({gstPercent}%)</span>
              <span>₹{gstAmount.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: colors.textMuted }}>
              <span>Discount</span>
              <span>- ₹{Number(discount || 0).toLocaleString("en-IN")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                color: colors.textPrimary,
                fontSize: 16,
                marginTop: 4,
              }}
            >
              <span>Total</span>
              <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}