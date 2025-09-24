import { generateDirectoryItemHandlers, type ContextMenuValue } from "../handlers/contextMenu";
import type { DirectoryItem } from "../types/fileExplorer";

type createContextMenu = {
    items: DirectoryItem[];
    setItems: (newItems: DirectoryItem[]) => void;
};

export function createContextMenu({
      items,
      setItems,
}: createContextMenu) {

    const menuItems = generateDirectoryItemHandlers({
        items,
        setItems,
    });
  
    return (target: ContextMenuValue, closeMenu: () => void) => {
        const liItems = menuItems
            .filter(item => {
                if(item.filter) {
                    return item.filter(target);
                }
                return true;
            })
            .map((item, i) => (
                <li
                    key={i}
                    className="hover-explorer-item"
                    style={{ padding: "4px 8px", cursor: "pointer", ...item.style }}
                    onClick={async () => {
                        closeMenu();
                        await item.handler(target);
                    }}
                >
                    {item.label}
                </li>
            ));
        return (
            <ul style={{ listStyle: "none", margin: 0, paddingTop: ".5em", paddingBottom: ".5em" }}>
                {liItems}
            </ul>
        )
    }
}
