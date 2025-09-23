import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ContextMenuProps = {
  x: number;
  y: number;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onCreate: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function ContextMenu({
  x,
  y,
  menuRef,
  onClose,
  onCreate,
  onRename,
  onDelete,
}: ContextMenuProps) {
  const [position, setPosition] = useState({ top: y, left: x });
  const localRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const { offsetWidth: width, offsetHeight: height } = el;
    const padding = 4;
    let newLeft = x;
    let newTop = y;

    if (x + width > window.innerWidth - padding) {
      newLeft = window.innerWidth - width - padding;
    }
    if (y + height > window.innerHeight - padding) {
      newTop = window.innerHeight - height - padding;
    }

    setPosition({ left: newLeft, top: newTop });
  }, [x, y]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        localRef.current &&
        !localRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [onClose]);

  return (
    <div
      ref={(el) => {
        localRef.current = el;
        if (menuRef) menuRef.current = el;
      }}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        backgroundColor: "#333",
        border: "1px solid #555",
        padding: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        userSelect: "none",
        minWidth: 120,
        color: "#fff",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 4 }}>
        <li
          style={{ padding: "4px 8px", cursor: "pointer" }}
          onClick={() => {
            onCreate();
            onClose();
          }}
        >
          Create
        </li>
        <li
          style={{ padding: "4px 8px", cursor: "pointer" }}
          onClick={() => {
            onRename();
            onClose();
          }}
        >
          Rename
        </li>
        <li
          style={{ padding: "4px 8px", cursor: "pointer", color: "red" }}
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          Delete
        </li>
      </ul>
    </div>
  );
}
