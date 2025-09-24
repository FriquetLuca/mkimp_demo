import { createContext, useContext } from "react";
import type { SetContextMenuState } from "../components/ContextMenu";
import type { DirectoryItem } from "../components/FileExplorer";

export type ContextMenuContextValue = {
    setContextMenuPos: SetContextMenuState<DirectoryItem>;
    onClose: () => void;
};

export const ContextMenuContext = createContext<ContextMenuContextValue | undefined>(undefined);

export const useContextMenu = () => {
    const ctx = useContext(ContextMenuContext);
    if(!ctx) throw new Error("useContextMenu must be used within a ContextMenuProvider");
    return ctx;
};
