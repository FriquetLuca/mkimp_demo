import { useEffect, useRef, useState } from 'react';

export function useResizableSidebarH({
  initialWidth = 240,
  minWidth = 150,
  maxWidth = 500,
  resizeThreshold = 3,
} = {}) {
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
      if (!isResizing.current || dragStartX.current === null) return;

      if ((e.buttons & 1) !== 1) {
        handleMouseUp();
        return;
      }

      const deltaX = e.clientX - dragStartX.current;

      if (Math.abs(deltaX) < resizeThreshold) return;

      document.body.style.userSelect = 'none';

      const newWidth = initialSidebarWidth.current + deltaX;
      const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

      // 1. DOM update for smoothness
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${clampedWidth}px`;
      }

      // 2. Debounced state update
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          setSidebarWidth(clampedWidth);
          animationFrameId = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minWidth, maxWidth, resizeThreshold]);

  const onSeparatorMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    dragStartX.current = e.clientX;
    initialSidebarWidth.current = sidebarRef.current?.offsetWidth ?? sidebarWidth;
  };

  return {
    sidebarWidth,
    sidebarRef,
    containerRef,
    onSeparatorMouseDown,
  };
}

export function useResizableSidebarV({
  initialHeight = 240,
  minHeight = 100,
  maxHeight = 600,
  resizeThreshold = 3,
} = {}) {
  const [sidebarHeight, setSidebarHeight] = useState(initialHeight);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isResizing = useRef(false);
  const dragStartY = useRef<number | null>(null);
  const initialSidebarHeight = useRef<number>(initialHeight);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      isResizing.current = false;
      dragStartY.current = null;

      if (sidebarRef.current) {
        const finalHeight = sidebarRef.current.offsetHeight;
        setSidebarHeight(finalHeight);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || dragStartY.current === null) return;

      if ((e.buttons & 1) !== 1) {
        handleMouseUp();
        return;
      }

      const deltaY = e.clientY - dragStartY.current;

      if (Math.abs(deltaY) < resizeThreshold) return;

      document.body.style.userSelect = 'none';

      const newHeight = initialSidebarHeight.current + deltaY;
      const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

      if (sidebarRef.current) {
        sidebarRef.current.style.height = `${clampedHeight}px`;
      }

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          setSidebarHeight(clampedHeight);
          animationFrameId = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minHeight, maxHeight, resizeThreshold]);

  const onSeparatorMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    dragStartY.current = e.clientY;
    initialSidebarHeight.current = sidebarRef.current?.offsetHeight ?? sidebarHeight;
  };

  return {
    sidebarHeight,
    sidebarRef,
    containerRef,
    onSeparatorMouseDown,
  };
}
