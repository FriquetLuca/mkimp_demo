import { useRef, useState } from "react";
import { ContextMenuContext } from "../hooks/useContextMenu";
import { ContextMenu, type ContextMenuState } from "../components/ContextMenu";
import type { DirectoryItem } from "../components/FileExplorer";

type ContextMenuProviderProps = {
    children: React.ReactNode;
    createMenu: (target: DirectoryItem, onClose: () => void) => React.JSX.Element;
    style?: React.CSSProperties | undefined;
}

export function ContextMenuProvider({ children, createMenu, style }: ContextMenuProviderProps) {
    const contextMenu = useState<ContextMenuState<DirectoryItem> | null>(null);
    const [contextMenuPos, setContextMenuPos] = contextMenu;
    const menuRef = useRef<HTMLDivElement>(null);

    const onClose = () => {
        setContextMenuPos(null)
    };
    
    return (
        <ContextMenuContext.Provider value={{
            onClose,
            setContextMenuPos,
        }}>
            {children}
            {contextMenuPos && (
                <ContextMenu<DirectoryItem>
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    menuRef={menuRef}
                    onClose={onClose}
                    target={contextMenuPos?.target}
                    createMenu={createMenu}
                    style={style}
                />
            )}
        </ContextMenuContext.Provider>
    )
};
