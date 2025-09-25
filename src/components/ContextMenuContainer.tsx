import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type ContextMenuState<T> = {
  x: number;
  y: number;
  target: T | null;
};

export type GetContextMenuState<T> = ContextMenuState<T> | null;
export type SetContextMenuState<T> = React.Dispatch<
  React.SetStateAction<ContextMenuState<T> | null>
>;
export type FullContextMenuState<T> = [
  GetContextMenuState<T>,
  SetContextMenuState<T>,
];

type ContextMenuProps<T, Ref = HTMLDivElement> = ContextMenuState<T> & {
  menuRef: React.RefObject<Ref | null>;
  onClose: () => void;
  createMenu: (target: T, onClose: () => void) => React.ReactNode;
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
};

export default function ContextMenuContainer<T>({
  x,
  y,
  target,
  menuRef,
  style,
  className,
  createMenu,
  onClose,
}: ContextMenuProps<T>) {
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
      if (localRef.current && !localRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const content = target ? createMenu(target, onClose) : null;

  return (
    <div
      ref={(el) => {
        localRef.current = el;
        if (menuRef) menuRef.current = el;
      }}
      className={`fixed ${className}`}
      style={{
        top: position.top,
        left: position.left,
        ...style,
      }}
    >
      {content}
    </div>
  );
}
