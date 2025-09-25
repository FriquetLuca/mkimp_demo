import {
  generateDirectoryItemHandlers,
  type ContextMenuValue,
} from '../handlers/contextMenu';
import type { DirectoryItem } from '../types/fileExplorer';

type createContextMenu = {
  items: DirectoryItem[];
  setItems: (newItems: DirectoryItem[]) => void;
};

export function createContextMenu({ items, setItems }: createContextMenu) {
  const menuItems = generateDirectoryItemHandlers({
    items,
    setItems,
  });

  const itemExplorerStyle =
    'px-2 py-1 cursor-pointer transition-colors duration-100 hover:bg-[var(--md-border-color)]';

  return (target: ContextMenuValue, closeMenu: () => void) => {
    const liItems = menuItems
      .filter((item) => {
        if (item.filter) {
          return item.filter(target);
        }
        return true;
      })
      .map((item, i) => (
        <li
          key={i}
          className={
            item?.className
              ? `${item.className} ${itemExplorerStyle}`
              : itemExplorerStyle
          }
          onClick={async () => {
            closeMenu();
            await item.handler(target);
          }}
        >
          {item.label}
        </li>
      ));
    return <ul className="list-none m-0 py-2">{liItems}</ul>;
  };
}
