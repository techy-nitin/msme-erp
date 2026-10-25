import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Eye,
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
  getInvoices,
  createInvoice,
  getClients,
  getProducts,
  sendInvoiceEmail,
  sendInvoiceWhatsapp,
  getInvoiceById,
   downloadInvoicePdf, 
} from "../Services/Api";
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

const statusOptions = ["UNPAID", "PAID", "OVERDUE"];
const statusFilterOptions = ["All", "UNPAID", "PAID", "OVERDUE"];

const emptyItem = { productId: "", quantity: 1, unitPrice: "", discount: "0", gstPercentage: "18" };

const styles = {
  fieldError: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  inputError: { borderColor: "#dc2626" },
  errorText: { fontSize: 13, color: "#dc2626" },
  statusText: { fontSize: 13, color: colors.textSecondary },
  itemsWrap: { display: "flex", flexDirection: "column", gap: 12, marginTop: 8 },
  // Wraps the header + rows in a horizontally-scrollable box so that on a
  // narrow modal, columns (Price, GST%, etc.) can be scrolled to instead of
  // being silently clipped off-screen with no way to reach them.
  itemsScroll: { overflowX: "auto" },
  itemsGridInner: { minWidth: 640 },
  itemRow: { display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 1fr 1fr auto", gap: 8, alignItems: "start" },
  itemHeaderRow: { display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 1fr 1fr auto", gap: 8, fontSize: 12, fontWeight: 600, color: colors.textSecondary },
  addItemBtn: { ...secondaryButton, alignSelf: "flex-start", marginTop: 4 },
  totalsBox: { marginTop: 12, padding: 12, background: colors.bg, borderRadius: 8, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 },
};

function computeItemTotal(item) {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.unitPrice) || 0;
  const discount = Number(item.discount) || 0;
  const gst = Number(item.gstPercentage) || 0;
  const amount = qty * price - discount;
  const gstAmount = (amount * gst) / 100;
  return { amount, gstAmount, total: amount + gstAmount };
}

function validateInvoice(form) {
  const errors = {};
  if (!form.customerId) errors.customerId = "Customer is required";
  if (!form.invoiceDate) errors.invoiceDate = "Invoice date is required";
  if (!form.dueDate) errors.dueDate = "Due date is required";
  if (form.invoiceDate && form.dueDate && form.dueDate < form.invoiceDate) {
    errors.dueDate = "Due date cannot be before invoice date";
  }

  const itemErrors = form.items.map((item) => {
    const e = {};
    if (!item.productId) e.productId = "Required";
    if (!item.quantity || Number(item.quantity) < 1) e.quantity = "Min 1";
    if (item.unitPrice === "" || Number(item.unitPrice) < 0) e.unitPrice = "Invalid";
    return e;
  });
  const hasItemErrors = itemErrors.some((e) => Object.keys(e).length > 0);
  if (hasItemErrors) errors.items = itemErrors;
  if (form.items.length === 0) errors.itemsGeneral = "Add at least one item";

  return errors;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
const [viewModal, setViewModal] = useState(false);
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [downloadingId, setDownloadingId] = useState(null);
const [sendingEmailId, setSendingEmailId] = useState(null);
const [sendingWhatsappId, setSendingWhatsappId] = useState(null);

const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    status: "UNPAID",
    notes: "",
    items: [{ ...emptyItem }],
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [invRes, clientRes, prodRes] = await Promise.all([
          getInvoices(),
          getClients(),
          getProducts(),
        ]);
        if (mounted) {
          setInvoices(invRes.data);
          setClients(clientRes.data);
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load invoices.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const clientNameById = useMemo(() => {
    const map = {};
    clients.forEach((c) => { map[c.id] = c.customerName; });
    return map;
  }, [clients]);

  const productById = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.id] = p; });
    return map;
  }, [products]);

  // Single source of truth for building a line item: always pulls price and
  // GST from the backend product record for the given productId (falling
  // back to sane defaults only if the product can't be resolved). Used on
  // modal open, "Add Item", and whenever the product dropdown changes, so
  // Price/GST% are never left blank just because a product was pre-selected
  // programmatically instead of picked by the user.
  function buildItem(productId) {
    const prod = productById[productId];
    return {
      productId: productId ?? "",
      quantity: 1,
      unitPrice: prod ? String(prod.price ?? "") : "",
      discount: "0",
      gstPercentage: prod ? String(prod.gstPercentage ?? "18") : "18",
    };
  }

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (inv.invoiceNumber || "").toLowerCase().includes(q) ||
        (clientNameById[inv.customerId] || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, clientNameById, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openGenerateModal() {
    setForm({
      customerId: clients[0]?.id ?? "",
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      status: "UNPAID",
      notes: "",
      items: [buildItem(products[0]?.id ?? "")],
    });
    setErrors({});
    setModalOpen(true);
  }

  function updateItem(index, field, value) {
    setForm((prev) => {
      const items = [...prev.items];
      if (field === "productId") {
        // Replace the whole line with a freshly-built one so price/GST
        // always reflect the newly selected product.
        items[index] = buildItem(value);
        return { ...prev, items };
      }
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, buildItem(products[0]?.id ?? "")],
    }));
  }

  function removeItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  const totals = useMemo(() => {
    return form.items.reduce(
      (acc, item) => {
        const { amount, gstAmount, total } = computeItemTotal(item);
        return {
          subtotal: acc.subtotal + amount,
          gst: acc.gst + gstAmount,
          total: acc.total + total,
        };
      },
      { subtotal: 0, gst: 0, total: 0 }
    );
  }, [form.items]);

  async function handleGenerate() {
    const validationErrors = validateInvoice(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        customerId: Number(form.customerId),
        invoiceDate: form.invoiceDate,
        dueDate: form.dueDate,
        status: form.status,
        notes: form.notes,
        items: form.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount) || 0,
          gstPercentage: Number(item.gstPercentage) || 0,
        })),
      };
      const res = await createInvoice(payload);
      setInvoices((prev) => [res.data, ...prev]);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && typeof err.response?.data === "object") {
        alert("Please check invoice details: " + JSON.stringify(err.response.data));
      } else {
        alert(err.response?.data?.message || err.response?.data || "Failed to generate invoice.");
      }
    } finally {
      setSaving(false);
    }
  }
async function handleSendEmail(invoiceId) {
  try {
    setSendingEmailId(invoiceId);

    await sendInvoiceEmail(invoiceId);

    alert("Invoice emailed successfully.");
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Unable to send invoice email."
    );
  } finally {
    setSendingEmailId(null);
  }
}
async function handleSendWhatsapp(invoiceId) {
  try {
    setSendingWhatsappId(invoiceId);

    const res = await sendInvoiceWhatsapp(invoiceId);

    window.open(res.data, "_blank");

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data ||
      "Unable to send WhatsApp."
    );
  } finally {
    setSendingWhatsappId(null);
  }
}
async function handleViewPdf(invoiceId) {
  try {
    setDownloadingId(invoiceId);

    const response = await downloadInvoicePdf(invoiceId);

    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = URL.createObjectURL(file);

    // Opens PDF in browser.
    // Browser provides Download button automatically.
    window.open(fileURL, "_blank");

  } catch (err) {
    console.error(err);
    alert("Unable to open invoice PDF.");
  } finally {
    setDownloadingId(null);
  }
}
  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Invoices</h1>

      <div style={panel}>
        <PanelHeader title={`All Invoices (${filtered.length})`} />

        <div style={toolbarRow}>
          <div style={searchWrap}>
            <Search size={16} style={searchIcon} />
            <input
              type="text"
              placeholder="Search by invoice # or client"
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
            <button
              type="button"
              style={primaryButton}
              onClick={openGenerateModal}
              disabled={clients.length === 0 || products.length === 0}
            >
              <Plus size={16} /> Generate Invoice
            </button>
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {!loading && (clients.length === 0 || products.length === 0) && (
          <p style={styles.statusText}>
            {clients.length === 0 && "Add a client first. "}
            {products.length === 0 && "Add a product first. "}
            Both are needed to generate an invoice.
          </p>
        )}

        {loading ? (
          <p style={styles.statusText}>Loading invoices...</p>
        ) : (
          <>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Invoice #</th>
                    <th style={th}>Client</th>
                    <th style={th}>Invoice Date</th>
                    <th style={th}>Amount</th>
                    <th style={th}>Status</th>
                    <th style={th}>Due Date</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((inv) => (
                    <tr key={inv.id}>
                      <td style={tdBold}>{inv.invoiceNumber}</td>
                      <td style={td}>{clientNameById[inv.customerId] || "—"}</td>
                      <td style={tdMuted}>{inv.invoiceDate}</td>
                      <td style={tdBold}>₹{Number(inv.totalAmount || 0).toLocaleString("en-IN")}</td>
                      <td style={td}>
                        <Badge status={inv.status} />
                      </td>
                      <td style={tdMuted}>{inv.dueDate}</td>
                      <td style={td}>
                        <div
    style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
    }}
>

<button
    style={iconButton}
    title="View PDF"
    onClick={() => handleViewPdf(inv.id)}
    disabled={downloadingId === inv.id}
>
    {downloadingId === inv.id ? (
        <Loader2 size={15} className="animate-spin" />
    ) : (
        <Eye size={15} />
    )}
</button>

<button
    style={iconButton}
    title="Email Invoice"
    onClick={() => handleSendEmail(inv.id)}
    disabled={sendingEmailId===inv.id}
>
    {
        sendingEmailId===inv.id
        ?
        <Loader2 size={15} className="animate-spin"/>
        :
        <Mail size={15}/>
    }
</button>

<button
    style={iconButton}
    title="WhatsApp Invoice"
    onClick={() => handleSendWhatsapp(inv.id)}
    disabled={sendingWhatsappId===inv.id}
>
    {
        sendingWhatsappId===inv.id
        ?
        <Loader2 size={15} className="animate-spin"/>
        :
        <MessageCircle size={15}/>
    }
</button>

</div>
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td style={td} colSpan={7}>
                        No invoices found.
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
        title="Generate Invoice"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" style={secondaryButton} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" style={primaryButton} onClick={handleGenerate} disabled={saving}>
              {saving ? "Generating..." : "Generate"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={formGroup}>
            <label style={formLabel}>Client</label>
            <select
              style={errors.customerId ? { ...formInput, ...styles.inputError } : formInput}
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            >
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.customerName}</option>
              ))}
            </select>
            {errors.customerId && <span style={styles.fieldError}>{errors.customerId}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={formGroup}>
              <label style={formLabel}>Invoice Date</label>
              <input
                type="date"
                style={errors.invoiceDate ? { ...formInput, ...styles.inputError } : formInput}
                value={form.invoiceDate}
                onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
              />
              {errors.invoiceDate && <span style={styles.fieldError}>{errors.invoiceDate}</span>}
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Due Date</label>
              <input
                type="date"
                style={errors.dueDate ? { ...formInput, ...styles.inputError } : formInput}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
              {errors.dueDate && <span style={styles.fieldError}>{errors.dueDate}</span>}
            </div>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Status</label>
            <select style={formInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={formLabel}>Items</label>
            <div style={styles.itemsScroll}>
              <div style={styles.itemsGridInner}>
                <div style={styles.itemsWrap}>
                  <div style={styles.itemHeaderRow}>
                    <span>Product</span>
                    <span>Qty</span>
                    <span>Price</span>
                    <span>Discount</span>
                    <span>GST %</span>
                    <span></span>
                  </div>
                  {form.items.map((item, index) => {
                    const itemErr = errors.items?.[index] || {};
                    return (
                      <div key={index} style={styles.itemRow}>
                        <select
                          style={itemErr.productId ? { ...formInput, ...styles.inputError } : formInput}
                          value={item.productId}
                          onChange={(e) => updateItem(index, "productId", Number(e.target.value) || e.target.value)}
                        >
                          <option value="">Select</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.productName}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          style={itemErr.quantity ? { ...formInput, ...styles.inputError } : formInput}
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        />
                        <input
                          type="number"
                          style={itemErr.unitPrice ? { ...formInput, ...styles.inputError } : formInput}
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                        />
                        <input
                          type="number"
                          style={formInput}
                          value={item.discount}
                          onChange={(e) => updateItem(index, "discount", e.target.value)}
                        />
                        <input
                          type="number"
                          style={formInput}
                          value={item.gstPercentage}
                          onChange={(e) => updateItem(index, "gstPercentage", e.target.value)}
                        />
                        <button
                          type="button"
                          style={{ ...iconButton, color: colors.danger }}
                          onClick={() => removeItem(index)}
                          disabled={form.items.length === 1}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {errors.itemsGeneral && <span style={styles.fieldError}>{errors.itemsGeneral}</span>}
            <button type="button" style={styles.addItemBtn} onClick={addItem}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Notes</label>
            <input
              style={formInput}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div style={styles.totalsBox}>
            <div>Subtotal: ₹{totals.subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
            <div>GST: ₹{totals.gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
            <div style={{ fontWeight: 700 }}>Total: ₹{totals.total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </Modal>
      <Modal
    open={viewModal}
    title="Invoice Details"
    onClose={()=>{
        setViewModal(false);
        setSelectedInvoice(null);
    }}
>

{
loadingInvoice
?

<p>Loading...</p>

:

selectedInvoice && (

<div
style={{
display:"flex",
flexDirection:"column",
gap:18
}}
>

<div>

<h3>{selectedInvoice.invoiceNumber}</h3>

<p>
Client :
{" "}
{selectedInvoice.customerName}
</p>

<p>
Status :
{" "}
{selectedInvoice.status}
</p>

<p>
Invoice Date :
{" "}
{selectedInvoice.invoiceDate}
</p>

<p>
Due Date :
{" "}
{selectedInvoice.dueDate}
</p>

</div>

<table style={table}>

<thead>

<tr>

<th style={th}>Product</th>

<th style={th}>Qty</th>

<th style={th}>Price</th>

<th style={th}>GST</th>

<th style={th}>Total</th>

</tr>

</thead>

<tbody>

{
selectedInvoice.items?.map(item=>(

<tr key={item.id}>

<td style={td}>
{item.productName}
</td>

<td style={td}>
{item.quantity}
</td>

<td style={td}>
₹{item.unitPrice}
</td>

<td style={td}>
{item.gstPercentage}%
</td>

<td style={tdBold}>
₹{item.total}
</td>

</tr>

))
}

</tbody>

</table>

<div
style={{
padding:15,
background:"#f8fafc",
borderRadius:8
}}
>

<h3>

Grand Total

₹

{selectedInvoice.totalAmount}

</h3>

</div>

</div>

)

}

</Modal>
    </div>
    
  );
}