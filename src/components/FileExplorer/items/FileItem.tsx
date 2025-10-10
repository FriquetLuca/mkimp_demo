import React from 'react';
import Item from './Item';
import { useContextMenu } from '../../../hooks/useContextMenu';
import type { FileEntry } from '../../../types/fileExplorer';
import Image from '../../Image';

interface FileItemProps {
  file: FileEntry;
  selectedFileIds: Array<string>;
  onSelect: (file: FileEntry, add?: boolean) => void;
  onOpen: (file: FileEntry) => void;
}

export default function FileItem({
  file,
  selectedFileIds,
  onSelect,
  onOpen,
}: FileItemProps) {
  const menuContext = useContextMenu();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: file.id, type: 'file' })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuContext.setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      target: { type: 'file', value: file },
    });
  };

  const getFileIcon = (): React.ReactNode => {
    if (file.name.endsWith('.md')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/markdown.svg'}
          alt="markdown"
        />
      );
    }
    if (file.name.endsWith('.js') || file.name.endsWith('.mjs')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/javascript.svg'}
          alt="javascript"
        />
      );
    }
    if (file.name.endsWith('.jsx')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/jsx.svg'}
          alt="javascript"
        />
      );
    }
    if (file.name.endsWith('.json')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/json.svg'} alt="json" />
      );
    }
    if (file.name.endsWith('.ts') || file.name.endsWith('.mts')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/typescript.svg'}
          alt="typescript"
        />
      );
    }
    if (file.name.endsWith('.tsx')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/tsx.svg'}
          alt="typescript"
        />
      );
    }
    if (file.name.endsWith('.html')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/html.svg'} alt="html" />
      );
    }
    if (file.name.endsWith('.css')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/css.svg'} alt="css" />
      );
    }
    if (file.name.endsWith('.rs')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/rust.svg'} alt="rust" />
      );
    }
    if (file.name.endsWith('.toml')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/toml.svg'} alt="toml" />
      );
    }
    if (file.name.endsWith('.sass') || file.name.endsWith('.scss')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/sass.svg'} alt="sass" />
      );
    }
    if (file.name.endsWith('.svg')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/svg.svg'} alt="svg" />
      );
    }
    if (file.name.endsWith('.yml') || file.name.endsWith('.yaml')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/yaml.svg'} alt="yaml" />
      );
    }
    if (file.name.endsWith('.sh')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/shell.svg'} alt="shell" />
      );
    }
    if (file.name.endsWith('.ps1')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/powershell.svg'}
          alt="powershell"
        />
      );
    }
    if (
      file.name.endsWith('.cpp') ||
      file.name.endsWith('.cc') ||
      file.name.endsWith('.cxx') ||
      file.name.endsWith('.c++')
    ) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/c-plus-plus.svg'}
          alt="C++"
        />
      );
    }
    if (
      file.name.endsWith('.py') ||
      file.name.endsWith('.pyc') ||
      file.name.endsWith('.pyd') ||
      file.name.endsWith('.pyo')
    ) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/python.svg'}
          alt="python"
        />
      );
    }
    if (file.name.endsWith('.tex')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/tex.svg'} alt="tex" />
      );
    }
    if (file.name.endsWith('.cs')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/c-sharp.svg'} alt="C#" />
      );
    }
    if (file.name.endsWith('.c')) {
      return <Image className="w-5 h-5" src={'/file_icons/c.svg'} alt="C" />;
    }
    if (
      file.name.endsWith('.java') ||
      file.name.endsWith('.class') ||
      file.name.endsWith('.jar') ||
      file.name.endsWith('.jad') ||
      file.name.endsWith('.jmod')
    ) {
      return <Image className="w-5 h-5" src={'/java.svg'} alt="java" />;
    }
    if (file.name.endsWith('.go')) {
      return <Image className="w-5 h-5" src={'/file_icons/go.svg'} alt="go" />;
    }
    if (file.name.endsWith('.xml')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/xml.svg'} alt="xml" />
      );
    }
    if (
      file.name.endsWith('.cbl') ||
      file.name.endsWith('.cob') ||
      file.name.endsWith('.cpy')
    ) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/cobol.svg'} alt="cobol" />
      );
    }
    if (file.name.endsWith('.kt') || file.name.endsWith('.kts')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/kotlin.svg'}
          alt="kotlin"
        />
      );
    }
    if (file.name.endsWith('.scala') || file.name.endsWith('.sc')) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/scala.svg'} alt="scala" />
      );
    }
    if (
      file.name.endsWith('.h') ||
      file.name.endsWith('.hpp') ||
      file.name.endsWith('.hh') ||
      file.name.endsWith('.hxx') ||
      file.name.endsWith('.h++')
    ) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/header.svg'}
          alt="header"
        />
      );
    }
    if (
      file.name.endsWith('.php') ||
      file.name.endsWith('.phps') ||
      file.name.endsWith('.phar') ||
      file.name.endsWith('.phtml') ||
      file.name.endsWith('.pht')
    ) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/php.svg'} alt="php" />
      );
    }
    if (
      file.name.endsWith('.lua') ||
      file.name.endsWith('.luna') ||
      file.name.endsWith('.lunaire') ||
      file.name.endsWith('.anair')
    ) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/lua.svg'} alt="lua" />
      );
    }
    if (file.name.endsWith('.hl') || file.name.endsWith('.lhs')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/haskell.svg'}
          alt="haskell"
        />
      );
    }
    if (file.name.endsWith('.exe') || file.name.endsWith('.dll')) {
      return (
        <Image
          className="w-5 h-5"
          src={'/file_icons/file-exe.svg'}
          alt="executable"
        />
      );
    }
    if (file.name === '.gitignore' || file.name === '.gitkeep') {
      return (
        <Image className="w-5 h-5" src={'/file_icons/git.svg'} alt="git" />
      );
    }
    if (
      file.name.endsWith('.ttf') ||
      file.name.endsWith('.woff') ||
      file.name.endsWith('.woff2')
    ) {
      return (
        <Image className="w-5 h-5" src={'/file_icons/font.svg'} alt="font" />
      );
    }
    return '📄';
  };

  const handleFileClick = (e: React.MouseEvent) => {
    // if ctrl or cmd key is pressed, do
    console.log('handleFileClick', e.ctrlKey || e.metaKey);
    if (e.ctrlKey || e.metaKey) {
      onSelect(file, true);
    } else {
      onSelect(file);
    }
  };

  return (
    <>
      <li
        draggable
        onDragStart={handleDragStart}
        onClick={handleFileClick}
        onDoubleClick={() => onOpen(file)}
        onContextMenu={handleContextMenu}
        className="transition-colors duration-100 hover:bg-[var(--md-border-color)] cursor-pointer"
      >
        <Item
          icon={getFileIcon()}
          name={file.name}
          isSelected={selectedFileIds.includes(file.id)}
        />
      </li>
    </>
  );
}
