type SidebarSeparatorProps = {
  onMouseDown?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export default function SidebarSeparator({
  onMouseDown,
}: SidebarSeparatorProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-[4px] cursor-col-resize z-[100]"
    >
      <div className="w-1 h-full bg-[var(--md-cspan-bg-color)]"></div>
    </div>
  );
}
