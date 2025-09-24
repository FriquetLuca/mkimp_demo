import React from "react";

type ConfirmProps = {
  label: React.ReactNode;
  onYes: () => void;
  onNo: () => void;
  yesLabel?: React.ReactNode;
  noLabel?: React.ReactNode;
  style?: React.CSSProperties;
};

export default function Confirm({
  label,
  onYes,
  onNo,
  yesLabel = "Yes",
  noLabel = "No",
  style,
}: ConfirmProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: ".5rem", ...style }}>
      <p style={{ fontSize: "1.1rem", margin: 0, width: "80%", textAlign: "center", alignSelf: "center" }}>{label}</p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button className="confirm-btn" onClick={onNo} style={{ padding: "0.5rem 1.2rem", borderColor: 'transparent', borderRadius: "10px" }}>
          {noLabel}
        </button>
        <button className="confirm-btn" onClick={onYes} style={{ padding: "0.5rem 1.2rem", borderColor: 'transparent', borderRadius: "10px" }}>
          {yesLabel}
        </button>
      </div>
    </div>
  );
}
