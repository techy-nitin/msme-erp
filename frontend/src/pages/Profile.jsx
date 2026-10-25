import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";

import { getProfile, updateProfile, deleteAccount } from "../services/Api";
import PanelHeader from "../components/PanelHeader";
import {
  colors,
  panel,
  pageWrap,
  pageTitle,
  formGrid,
  formGroup,
  formLabel,
  formInput,
  primaryButton,
} from "../styles/theme";

const styles = {
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: colors.primaryLight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 600,
    color: colors.primaryDark,
    flexShrink: 0,
  },

  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: colors.textSecondary,
    cursor: "pointer",
  },

  saveRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  buttonRow: {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 20,
},

deleteButton: {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
},
};

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  // ================= Load Profile =================

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await getProfile();

      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        role: res.data.role || "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // ================= Update Profile =================

  async function handleUpdate() {
    try {
      const res = await updateProfile({
        name: form.name,
        phone: form.phone,
      });

      alert(res.data);

      // Reload latest profile from backend
      fetchProfile();
    } catch (err) {
      console.error(err);

      alert(err.response?.data || "Profile update failed.");
    }
  }

  if (loading) {
    return (
      <div style={pageWrap}>
        <h2>Loading...</h2>
      </div>
    );
  }
async function handleDeleteAccount() {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?\n\nThis action cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteAccount();

    alert(res.data);

    // Remove token
    localStorage.removeItem("token");

    // Redirect to login page
    window.location.href = "/";
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data ||
      "Failed to delete account."
    );
  }
}
  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Profile</h1>

      <div style={panel}>
        <PanelHeader title="Personal Information" />

        <div style={styles.avatarRow}>
          <div style={styles.avatar}>
            {form.name ? form.name.charAt(0).toUpperCase() : "U"}
          </div>

          <label style={styles.uploadButton}>
            <Upload size={14} />
            Change Photo
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div style={formGrid}>
          <div style={formGroup}>
            <label style={formLabel}>Full Name</label>
            <input
              style={formInput}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Role</label>
            <input
              style={formInput}
              value={form.role}
              disabled
            />
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Email</label>
            <input
              style={formInput}
              value={form.email}
              disabled
            />
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Phone</label>
            <input
              style={formInput}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>

    <div style={styles.buttonRow}>
  <button
    type="button"
    style={styles.deleteButton}
    onClick={handleDeleteAccount}
  >
    Delete Account
  </button>

  <button
    type="button"
    style={primaryButton}
    onClick={handleUpdate}
  >
    Update Profile
  </button>
</div>
      </div>
    </div>
  );
}