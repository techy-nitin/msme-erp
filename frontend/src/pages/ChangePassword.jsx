import React, { useState } from "react";
import { Lock } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import { colors, panel, pageWrap, pageTitle, formGroup, formLabel, formInput, primaryButton } from "../styles/theme";
import { changePassword } from "../services/Api";
const styles = {
  form: { display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 },
  error: { fontSize: 13, color: colors.danger, margin: 0 },
  saveRow: { display: "flex", justifyContent: "flex-end", marginTop: 8 },
  hint: { fontSize: 12, color: colors.textFaint, margin: 0 },
};

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
const handleUpdate = async () => {
  console.log("1. handleUpdate started");

  if (!currentPassword || !newPassword || !confirmPassword) {
    console.log("2. Validation failed");
    setError("Please fill in all fields.");
    return;
  }

  if (newPassword.length < 8) {
    console.log("3. Password too short");
    setError("New password must be at least 8 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    console.log("4. Passwords don't match");
    setError("New password and confirm password do not match.");
    return;
  }

  console.log("5. Calling API...");

  try {
    const res = await changePassword({
      oldPassword: currentPassword,
      newPassword: newPassword,
    });

    console.log("6. Success", res);

  } catch (err) {
    console.log("7. Error", err);
    console.log(err.response);
  }
};
  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Change Password</h1>

      <div style={panel}>
        <PanelHeader title="Update Password" action={<Lock size={16} color={colors.textFaint} />} />

        <div style={styles.form}>
          <div style={formGroup}>
            <label style={formLabel}>Current Password</label>
            <input
              type="password"
              style={formInput}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div style={formGroup}>
            <label style={formLabel}>New Password</label>
            <input type="password" style={formInput} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <p style={styles.hint}>Must be at least 8 characters.</p>
          </div>
          <div style={formGroup}>
            <label style={formLabel}>Confirm New Password</label>
            <input
              type="password"
              style={formInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.saveRow}>
            <button type="button" style={primaryButton} onClick={handleUpdate}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
