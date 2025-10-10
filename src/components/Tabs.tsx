import React from 'react';
import { useRef, useState } from 'react';

interface TabsProps<T> {
  items: T[];
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
  setItems: (items: T[]) => void;
  getName: (item: T) => string;
  tabMenu: (item: T | undefined) => React.ReactNode;
  getContent: (item: T | undefined) => React.ReactNode;
  onClose: (item: T) => void;
}

export default function Tabs<T extends { id: string }>({
  items,
  setItems,
  activeTabId,
  setActiveTabId,
  getName,
  tabMenu,
  getContent,
  onClose,
}: TabsProps<T>) {
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const tabsHeaderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [dropIndicatorLeft, setDropIndicatorLeft] = useState<number | null>(
    null
  );

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedTabId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!draggedTabId || !tabsHeaderRef.current) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const offset = e.clientX - rect.left;

    const insertBefore = offset < rect.width / 2;
    setDropIndex(insertBefore ? index : index + 1);

    const left = insertBefore
      ? target.offsetLeft
      : target.offsetLeft + target.offsetWidth;

    setDropIndicatorLeft(left);
  };

  const onDrop = () => {
    if (draggedTabId == null || dropIndex == null) return;

    const draggedIndex = items.findIndex((item) => item.id === draggedTabId);
    if (
      draggedIndex === -1 ||
      draggedIndex === dropIndex ||
      draggedIndex + 1 === dropIndex
    ) {
      setDraggedTabId(null);
      setDropIndex(null);
      setDropIndicatorLeft(null);
      return;
    }

    const updatedTabs = [...items];
    const [removed] = updatedTabs.splice(draggedIndex, 1);

    let adjustedDropIndex = dropIndex;
    if (draggedIndex < dropIndex) {
      adjustedDropIndex -= 1;
    }

    updatedTabs.splice(adjustedDropIndex, 0, removed);
    setItems(updatedTabs);
    setDraggedTabId(null);
    setDropIndex(null);
    setDropIndicatorLeft(null);
  };

  const onDragLeave = () => {
    setDropIndex(null);
    setDropIndicatorLeft(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - (tabsHeaderRef.current?.offsetLeft ?? 0);
    scrollLeftRef.current = tabsHeaderRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !tabsHeaderRef.current) return;
    const x = e.pageX - tabsHeaderRef.current.offsetLeft;
    const walk = x - startXRef.current;
    tabsHeaderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (tabsWrapperRef.current) {
      // Only handle horizontal scroll if available
      tabsWrapperRef.current.scrollLeft += e.deltaY;
    }
  };

  const openItem = items.find((tab) => tab.id === activeTabId);

  return (
    <>
      <div
        className={`flex${items.length > 0 ? '' : ' h-0'} justify-between items-center bg-[var(--md-table-nth-child-bg-color)]`}
      >
        <div
          className="overflow-x-auto overflow-y-hidden whitespace-nowrap cursor-grab active:cursor-grabbing scrollbar-hide"
          ref={tabsWrapperRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel} // ← handle scroll on wheel
        >
          <div
            className="scrollbar-hide relative inline-flex items-center overflow-x-hidden pr-[3px]"
            ref={tabsHeaderRef}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  className={`flex shrink-0 items-center px-3 py-1 border-r border-[#333] cursor-pointer relative select-none ${item.id === activeTabId ? 'bg-[var(--md-cspan-bg-color)]' : ''}`}
                  onClick={() => setActiveTabId(item.id)}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.id)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={onDrop}
                  onDragLeave={onDragLeave}
                >
                  <span className="mr-2">{getName(item)}</span>
                  <button
                    className="p-1 pb-0 bg-transparent border-none cursor-pointer text-xl leading-none rounded-sm hover:bg-[var(--md-cspan-bg-color)]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose(item);
                    }}
                  >
                    ×
                  </button>
                </div>
              </React.Fragment>
            ))}
            {dropIndicatorLeft !== null && (
              <div
                className="absolute w-[2px] h-[36px] bg-[dodgerblue] pointer-events-none z-10"
                style={{ left: `${dropIndicatorLeft}px` }}
              />
            )}
          </div>
        </div>
        {items.length > 0 ? tabMenu(openItem) : null}
      </div>
      {getContent(openItem)}
    </>
  );
}
