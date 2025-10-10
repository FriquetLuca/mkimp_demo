import type { DirectoryItem, FileEntry } from '../types/fileExplorer';
import emojis from './emojis.json';
import { MkImp, type EmojiRecord } from 'mkimp';
import jsyaml from 'js-yaml';
import { isDirectory, findParent } from './directoryItem';
import { urlPrefix } from './urlPrefix';

const templateHtml = `<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="${urlPrefix('/css/mkimp.css')}">
        <link rel="stylesheet" href="${urlPrefix('/css/katex.min.css')}">
        <link rel="stylesheet" href="${urlPrefix('/css/vs2015.min.css')}">
        <title>{{_title}}</title>
    </head>
    <body>
        <div class="content">
            %PAGE_CONTENT%
        </div>
        <script type="module">
          import mermaid from '${urlPrefix('/mermaid.esm.min.mjs')}';
          mermaid.initialize({ startOnLoad: true });
        </script>
    </body>
</html>
`;

const searchByPath = (
  location: string[],
  currentItem: DirectoryItem,
  root: DirectoryItem
) => {
  let newcurrentItem = currentItem;
  for (const pathItemName of location) {
    if (pathItemName === '.') {
      if (!isDirectory(newcurrentItem)) {
        const parent = findParent(newcurrentItem.id, root);
        if (parent) {
          newcurrentItem = parent;
        } else {
          return undefined;
        }
      }
      continue;
    }
    if (pathItemName === '..') {
      const parent = findParent(newcurrentItem.id, root);
      if (parent) {
        newcurrentItem = parent;
      } else {
        return undefined;
      }
      continue;
    }
    if (isDirectory(newcurrentItem)) {
      const child = newcurrentItem.nodes.find((p) => p.name === pathItemName);
      if (child) {
        newcurrentItem = child;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  return newcurrentItem;
};

export async function parse(
  file: FileEntry | undefined,
  filesTree: DirectoryItem[]
) {
  if (!file) {
    const template = templateHtml.replaceAll(`{{_title}}`, 'None');
    return template.replace(/%PAGE_CONTENT%/g, () => '');
  }

  const root = {
    id: 'root',
    name: '',
    nodes: filesTree,
  };

  const mkimp = new MkImp({
    emojis: emojis as Record<string, EmojiRecord>,
    async frontMatter(content) {
      return jsyaml.load(content, {});
    },
    async include(loc, from, to) {
      const location = loc.split('/').filter(Boolean);
      console.log(location);
      if (location.length > 0) {
        const item =
          location[0] === '.' || location[0] === '..'
            ? searchByPath(location, file, root)
            : searchByPath(location, root, root);
        console.log(item);
        if (item && !isDirectory(item)) {
          if (from === undefined && to === undefined) {
            return item.content;
          }
          const filelines = item.content.split(/\r?\n/);
          const newFrom = from ? from - 1 : 0;
          const newTo = to ? to : filelines.length - 1;
          return filelines.slice(newFrom, newTo).join('\n');
        }
      }
      return undefined;
    },
    async includeCode(loc, from, to) {
      const location = loc.split('/').filter(Boolean);
      if (location.length > 0) {
        const item =
          location[0] === '.' || location[0] === '..'
            ? searchByPath(location, file, root)
            : searchByPath(location, root, root);
        if (item && !isDirectory(item)) {
          if (from === undefined && to === undefined) {
            return item.content;
          }
          const filelines = item.content.split(/\r?\n/);
          const newFrom = from ? from - 1 : 0;
          const newTo = to ? to : filelines.length - 1;
          return filelines.slice(newFrom, newTo).join('\n');
        }
      }
      return undefined;
    },
  });
  const template = templateHtml.replaceAll(`{{_title}}`, file.name);
  const result = await mkimp.parse(file.content);
  return template.replace(/%PAGE_CONTENT%/g, () => result);
}
