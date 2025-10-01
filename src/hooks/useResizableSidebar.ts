import { useEffect, useRef, useState } from 'react';

export type ResizableSidebarOptions = {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  resizeThreshold?: number;
  mode?: 'fixed' | 'calc';
  direction?: 'left' | 'right';
};

export function useResizableSidebar({
  initialWidth = 240,
  minWidth = 150,
  maxWidth = 500,
  resizeThreshold = 3,
  mode = 'fixed',
  direction = 'left',
}: ResizableSidebarOptions = {}) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isResizing = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const initialSidebarWidth = useRef<number>(initialWidth);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      isResizing.current = false;
      dragStartX.current = null;

      if (sidebarRef.current) {
        const finalWidth = sidebarRef.current.offsetWidth;
        setSidebarWidth(finalWidth);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      let newWidth: number;

      if (mode === 'fixed') {
        if (dragStartX.current === null) return;

        const deltaX = e.clientX - dragStartX.current;
        const adjustedDelta = direction === 'left' ? deltaX : -deltaX;

        if (Math.abs(adjustedDelta) < resizeThreshold) return;

        newWidth = initialSidebarWidth.current + adjustedDelta;

        // Clamp in fixed mode
        newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      } else if (mode === 'calc') {
        if (direction === 'left') {
          newWidth = e.clientX - containerRect.left;
        } else {
          newWidth = containerRect.right - e.clientX;
        }

        if (Math.abs(newWidth - sidebarWidth) < resizeThreshold) return;

        // Clamp in calc mode
        newWidth = Math.max(
          minWidth,
          Math.min(newWidth, containerWidth - maxWidth)
        );
        //newWidth = Math.min(newWidth, maxWidth);
      } else {
        return;
      }

      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          setSidebarWidth(newWidth);
          animationFrameId = null;
        });
      }
    };

    const handleMouseUpGlobal = () => handleMouseUp();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mode, direction, minWidth, maxWidth, resizeThreshold, sidebarWidth]);

  const onSeparatorMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    dragStartX.current = e.clientX;
    initialSidebarWidth.current =
      sidebarRef.current?.offsetWidth ?? sidebarWidth;
  };

  return {
    sidebarWidth,
    sidebarRef,
    containerRef,
    onSeparatorMouseDown,
  };
}
