import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { colors } from "../styles/theme";

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  info: {
    fontSize: 13,
    color: colors.textMuted,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  btn: (disabled) => ({
    width: 30,
    height: 30,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    color: colors.textMuted,
  }),
  pageBtn: (active) => ({
    minWidth: 30,
    height: 30,
    padding: "0 8px",
    borderRadius: 8,
    border: `1px solid ${active ? colors.primary : colors.border}`,
    background: active ? colors.primary : colors.white,
    color: active ? colors.white : colors.textSecondary,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  }),
};

/**
 * Generic pagination bar.
 * Props:
 *  - page: current page (1-indexed)
 *  - totalPages: total number of pages
 *  - totalItems: total row count (for the "Showing X of Y" label)
 *  - pageSize: rows per page
 *  - onPageChange: (nextPage) => void
 */
export default function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={styles.wrap}>
      <span style={styles.info}>
        Showing {start}-{end} of {totalItems}
      </span>
      <div style={styles.controls}>
        <button
          style={styles.btn(page === 1)}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            style={styles.pageBtn(p === page)}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          style={styles.btn(page === totalPages || totalPages === 0)}
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
