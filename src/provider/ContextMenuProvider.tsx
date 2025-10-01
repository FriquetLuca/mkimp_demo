import { useRef, useState } from 'react';
import { ContextMenuContext } from '../hooks/useContextMenu';
import type { ContextMenuValue } from '../handlers/contextMenu';
import ContextMenuContainer, {
  type ContextMenuState,
} from '../components/ContextMenuContainer';

interface ContextMenuProviderProps {
  children: React.ReactNode;
  createMenu: (
    target: ContextMenuValue,
    onClose: () => void
  ) => React.JSX.Element;
  className?: string;
}

export function ContextMenuProvider({
  children,
  createMenu,
  className,
}: ContextMenuProviderProps) {
  const contextMenu = useState<ContextMenuState<ContextMenuValue> | null>(null);
  const [contextMenuPos, setContextMenuPos] = contextMenu;
  const menuRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setContextMenuPos(null);
  };

  return (
    <ContextMenuContext.Provider
      value={{
        onClose,
        setContextMenuPos,
      }}
    >
      {children}
      {contextMenuPos && (
        <ContextMenuContainer<ContextMenuValue>
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          menuRef={menuRef}
          onClose={onClose}
          target={contextMenuPos?.target}
          createMenu={createMenu}
          className={className}
        />
      )}
    </ContextMenuContext.Provider>
  );
}
