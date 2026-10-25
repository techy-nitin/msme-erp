import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { colors, layout } from "../styles/theme";

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.textSecondary,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  content: {
    marginLeft: layout.sidebarWidth,
    paddingTop: layout.navbarHeight,
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  contentInner: {
    padding: "24px 32px",
    maxWidth: 1400,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
};

/**
 * Shared layout for every authenticated page. Sidebar and Navbar are fixed
 * (position: fixed) and always visible; only the Outlet content scrolls
 * and changes as React Router navigates between pages.
 */
export default function DashboardLayout() {
  return (
    <div style={styles.page}>
      <Sidebar />
      <Navbar />
      <div style={styles.content}>
        <div style={styles.contentInner}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
