import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Package,
  LayoutList,
  FileText,
  Receipt,
  Wallet,
  BookOpenCheck,
  UserCircle2,
  FileBarChart2,
  Settings,
  KeyRound,
  LogOut,
  Truck,
} from "lucide-react";

import { colors, layout } from "../styles/theme";
import { logout } from "../services/Api";
const navItems = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: Users, label: "Clients", to: "/clients" },
    { icon: Truck, label: "Vendors", to: "/vendors" },
  { icon: Package, label: "Products", to: "/products" },
  { icon: LayoutList, label: "Categories", to: "/categories" },
  { icon: FileText, label: "Quotations", to: "/quotations" },
  { icon: Receipt, label: "Invoices", to: "/invoices" },
  { icon: Wallet, label: "Payments", to: "/payments" },
  { icon: BookOpenCheck, label: "Accounts", to: "/accounts" },
  { icon: UserCircle2, label: "Employees", to: "/employees" },
  { icon: FileBarChart2, label: "Reports", to: "/reports" },
  { icon: Wallet, label: "Expenses", to: "/expenses" },
  { icon: Settings, label: "Company Settings", to: "/company-settings" },
];

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: layout.sidebarWidth,
    display: "flex",
    flexDirection: "column",
    background: colors.white,
    borderRight: `1px solid ${colors.border}`,
    padding: "20px 16px",
    zIndex: 40,
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 8px",
    marginBottom: 32,
    flexShrink: 0,
  },

  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  logoText: {
    fontWeight: 600,
    color: colors.textPrimary,
    fontSize: 18,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    overflowY: "auto",
  },

  navButtonBase: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textDecoration: "none",
    boxSizing: "border-box",
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    width: "100%",
    background: "transparent",
    color: colors.danger,
  },

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: `1px solid ${colors.border}`,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flexShrink: 0,
  },
};

function navLinkStyle({ isActive }) {
  return {
    ...styles.navButtonBase,
    background: isActive ? colors.primary : "transparent",
    color: isActive ? colors.white : colors.textMuted,
    boxShadow: isActive ? "0 1px 3px rgba(37,99,235,0.3)" : "none",
  };
}
 

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoRow}>
        <div style={styles.logoBox}>
          <LayoutGrid size={16} color={colors.white} />
        </div>
        <span style={styles.logoText}>MSME Suite</span>
      </div>

      <nav style={styles.nav}>
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink key={label} to={to} style={navLinkStyle}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
{/* 
      <div style={styles.sidebarFooter}>
        <NavLink to="/profile" style={navLinkStyle}>
          <UserCircle2 size={17} />
          Profile
        </NavLink>

        <NavLink to="/change-password" style={navLinkStyle}>
          <KeyRound size={17} />
          Change Password
        </NavLink>

        <button
          type="button"
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div> */}
    </aside>
  );
}