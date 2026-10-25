import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { colors } from "../styles/theme";

const styles = {
  wrap: { position: "relative" },
  button: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: colors.textSecondary,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  menu: {
    position: "absolute",
    right: 0,
    marginTop: 4,
    minWidth: 176,
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
    padding: "4px 0",
    zIndex: 30,
  },
  item: (active) => ({
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 500,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: active ? colors.primary : colors.textSecondary,
    whiteSpace: "nowrap",
  }),
};

/**
 * Generic single-select dropdown. Used for date filters, status filters,
 * chart range toggles, etc. Closes on outside click.
 *
 * Props: value, options (string[]), onChange(nextValue), label (optional prefix)
 */
export default function Dropdown({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.wrap} ref={ref}>
      <button type="button" style={styles.button} onClick={() => setOpen((o) => !o)}>
        {label ? `${label}: ${value}` : value}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div style={styles.menu}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              style={styles.item(opt === value)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
