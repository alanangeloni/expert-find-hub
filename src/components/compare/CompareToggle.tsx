import React from "react";

interface CompareToggleProps {
  active: boolean;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: "sm" | "md";
}

export const CompareToggle = ({ active, disabled, onClick, size = "sm" }: CompareToggleProps) => (
  <button
    type="button"
    className={`compare-toggle compare-toggle--${size} ${active ? "is-active" : ""} ${
      disabled && !active ? "is-disabled" : ""
    }`}
    onClick={onClick}
    disabled={disabled && !active}
    aria-pressed={active}
    aria-label={active ? "Remove from comparison" : "Add to comparison"}
    title={active ? "Remove from comparison" : "Compare"}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
    <span>{active ? "Comparing" : "Compare"}</span>
  </button>
);

export default CompareToggle;
