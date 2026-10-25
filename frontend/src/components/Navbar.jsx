import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  UserCircle2,
  KeyRound,
  LogOut,
} from "lucide-react";
import { colors, layout } from "../styles/theme";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getProfile, 
  logout, 
  getLatestNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead 
} from "../services/Api";

// Maps each route path to the title shown in the navbar.
const routeTitles = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/products": "Products",
  "/categories": "Categories",
  "/quotations": "Quotations",
  "/invoices": "Invoices",
  "/payments": "Payments",
  "/accounts": "Accounts",
  "/employees": "Employees",
  "/reports": "Reports",
  "/company-settings": "Company Settings",
  "/profile": "Profile",
  "/change-password": "Change Password",
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: layout.sidebarWidth,
    right: 0,
    height: layout.navbarHeight,
    minHeight: layout.navbarHeight,
    background: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 32px",
    boxSizing: "border-box",
    zIndex: 1000,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.textPrimary,
    margin: 0,
    whiteSpace: "nowrap",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    height: "100%",
    flexShrink: 0,
  },
  searchWrap: {
    position: "relative",
    width: 280,
  }, 
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.textFaint,
  },
  searchInput: {
    width: "100%",
    height: 40,
    padding: "0 14px 0 38px",
    borderRadius: 12,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  notificationWrap: {
    position: "relative",
  },
  bellButton: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: colors.white,
    border: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    fontSize: 10,
    borderRadius: "50%",
    background: colors.primary,
    color: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 320,
    maxHeight: 400,
    overflowY: "auto",
    background: "#fff",
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    zIndex: 999,
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: `1px solid ${colors.border}`,
  },
  markReadBtn: {
    border: "none",
    background: "transparent",
    color: colors.primary,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 12,
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: 4,
    textDecoration: "none",
    cursor: "pointer",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: colors.primaryLight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    color: colors.primaryDark,
    flexShrink: 0,
  },
  profileName: {
    fontSize: 15,
    fontWeight: 500,
    color: colors.textSecondary,
    whiteSpace: "nowrap",
  },
  menuWrap: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 220,
    background: "#fff",
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 999,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "12px 16px",
    textDecoration: "none",
    color: colors.textPrimary,
    background: "white",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    height: 42,
    padding: "0 8px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  },
};

export default function Navbar() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Dashboard";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);
  const menuRef = useRef(null);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const [latestRes, countRes] = await Promise.all([
        getLatestNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(latestRes.data || []);
      setUnreadCount(countRes.data || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadProfile();
    loadNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={styles.navbar}>
      <h1 style={styles.title}>{title}</h1>

      <div style={styles.right}>
        {/* Search Input */}
        <div style={styles.searchWrap}>
          <Search size={16} style={styles.searchIcon} />
          <input type="text" placeholder="Search" style={styles.searchInput} />
        </div>

        {/* Notification Bell Component */}
        <div style={styles.notificationWrap} ref={notificationRef}>
          <button 
            style={styles.bellButton} 
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell size={20} color={colors.textSecondary} />
            {unreadCount > 0 && (
              <span style={styles.bellBadge}>{unreadCount}</span>
            )}
          </button>

          {/* Notification Dropdown Context */}
          {notificationOpen && (
            <div style={styles.notificationDropdown}>
              <div style={styles.notificationHeader}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                <button onClick={handleMarkAllRead} style={styles.markReadBtn}>
                  Mark all as read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: colors.textSecondary, fontSize: 14 }}>
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: `1px solid ${colors.border}`,
                      background: n.read ? "#fff" : "#f8fbff",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: colors.textPrimary, fontSize: 13 }}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary }} />
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    {n.createdAt && (
                      <div style={{ marginTop: 6, fontSize: 11, color: colors.textFaint }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown Component */}
        <div style={styles.menuWrap} ref={menuRef}>
          <button style={styles.profileButton} onClick={() => setMenuOpen(!menuOpen)}>
            <div style={styles.avatarCircle}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span style={styles.profileName}>
              {user?.name || "User"} {user?.role ? `- ${user.role}` : ""}
            </span>
            <ChevronDown size={14} color={colors.textFaint} />
          </button>

          {menuOpen && (
            <div style={styles.menu}>
              <Link to="/profile" style={styles.menuItem}>
                <UserCircle2 size={18} />
                Profile
              </Link>
              <Link to="/change-password" style={styles.menuItem}>
                <KeyRound size={18} />
                Change Password
              </Link>
              <button style={styles.menuItem} onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}