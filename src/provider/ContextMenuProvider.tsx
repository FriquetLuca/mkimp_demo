import { useRef, useState } from 'react';
import { ContextMenuContext } from '../hooks/useContextMenu';
import type { ContextMenuValue } from '../handlers/contextMenu';
import ContextMenuContainer, {
  type ContextMenuState,
} from '../components/ContextMenuContainer';

type ContextMenuProviderProps = {
  children: React.ReactNode;
  createMenu: (
    target: ContextMenuValue,
    onClose: () => void
  ) => React.JSX.Element;
  className: string;
  style?: React.CSSProperties | undefined;
};

export function ContextMenuProvider({
  children,
  createMenu,
  className,
  style,
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
          style={style}
        />
      )}
    </ContextMenuContext.Provider>
  );
}
