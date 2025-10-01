import { createContext, useContext } from 'react';
import type { ContextMenuValue } from '../handlers/contextMenu';
import type { SetContextMenuState } from '../components/ContextMenuContainer';

export interface ContextMenuContextValue {
  setContextMenuPos: SetContextMenuState<ContextMenuValue>;
  onClose: () => void;
}

export const ContextMenuContext = createContext<
  ContextMenuContextValue | undefined
>(undefined);

export const useContextMenu = () => {
  const ctx = useContext(ContextMenuContext);
  if (!ctx)
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  return ctx;
};
