import SidebarSeparator from './SidebarSeparator';

interface SidebarProps {
  sidebarWidth: number;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  sidebarContent: React.ReactNode;
  direction?: 'left' | 'right';
  size?: 'full' | 'screen';
  children: React.ReactNode;
  onSeparatorMouseDown: (e: React.MouseEvent) => void;
}

export default function Sidebar({
  sidebarWidth,
  sidebarRef,
  containerRef,
  sidebarContent,
  onSeparatorMouseDown,
  direction = 'left',
  size = 'screen',
  children,
}: SidebarProps) {
  const sidebar = (
    <div
      ref={sidebarRef}
      className="flex-shrink-0 overflow-hidden"
      style={{
        width: `${sidebarWidth}px`,
      }}
    >
      <div
        className={`${size === 'screen' ? 'h-screen' : 'h-full'} overflow-y-auto border-r border-[var(--md-bg-code-color)]`}
        style={{
          width: sidebarWidth,
        }}
      >
        {sidebarContent}
      </div>
    </div>
  );

  const getChild = () => {
    if (direction === 'right') {
      return (
        <>
          {children}
          <SidebarSeparator onMouseDown={onSeparatorMouseDown} />
          {sidebar}
        </>
      );
    }
    return (
      <>
        {sidebar}
        <SidebarSeparator onMouseDown={onSeparatorMouseDown} />
        {children}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${size === 'screen' ? 'h-screen w-screen' : 'w-full h-full'} overflow-hidden`}
    >
      {getChild()}
    </div>
  );
}
