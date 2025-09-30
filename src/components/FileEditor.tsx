import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import type { FileEntry } from '../types/fileExplorer';
import { textAreaTab } from './FileViewer/textAreaTab';
import { moveLine } from './FileViewer/moveLine';
import { moveCursorToLineEdge } from './FileViewer/moveCursorToLineEdge';
import { moveCursorWord } from './FileViewer/moveCursorWord';

type FileEditorProps = {
  file: FileEntry;
  lineHeight?: number;
  tabIndent?: number;
  onChange: (updated: FileEntry) => void;
};

export default function FileEditor({
  file,
  onChange,
  lineHeight = 24,
  tabIndent = 4,
}: FileEditorProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [lineNumberWidth, setLineNumberWidth] = useState(0);

  useEffect(() => {
    setContent(file.content);
  }, [file]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    moveLine({ file, e, content, textarea, onChange, setContent });
    textAreaTab({ textarea, file, e, tabIndent, onChange, setContent });
    moveCursorToLineEdge({ e, textarea });
    moveCursorWord({ e, textarea, content });
  };

  const onAreaScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      lineNumbersRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  };

  const onLinesScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      const scrollTop = lineNumbersRef.current.scrollTop;
      textareaRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  };

  useLayoutEffect(() => {
    if (lineNumbersRef.current) {
      setContainerHeight(lineNumbersRef.current.clientHeight);
    }
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    onChange({ ...file, content: updatedContent });
  };

  const lines = content.split('\n');
  const totalLines = lines.length;

  const startLine = Math.floor(scrollTop / lineHeight);
  const visibleLinesCount = Math.min(
    totalLines - startLine,
    Math.ceil(containerHeight / lineHeight) + 1
  );
  const visibleLineNumbers = Array.from(
    { length: visibleLinesCount },
    (_, i) => i + startLine
  );

  useLayoutEffect(() => {
    const maxLineNumber = totalLines;
    const lineNumberText = `${maxLineNumber}`;
    const font = '12px monospace';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = font;
      const width = ctx.measureText(lineNumberText).width;
      setLineNumberWidth(width + 16);
    }
  }, [totalLines]);

  return (
    <div className="flex flex-1 border-t border-[var(--md-cspan-bg-color)] bg-transparent overflow-y-auto">
      <div
        ref={lineNumbersRef}
        onScroll={onLinesScroll}
        className="scrollbar-hide pt-2 overflow-y-auto overflow-x-hidden h-full px-2 border-r border-[var(--md-cspan-bg-color)] text-gray-400 bg-[var(--md-bg-code-color)] select-none relative line-numbers"
        style={{
          width: `${1.1 * lineNumberWidth}px`,
          lineHeight: `${lineHeight}px`,
        }}
      >
        <div
          className="relative"
          style={{
            height: totalLines * lineHeight,
          }}
        >
          {visibleLineNumbers.map((lineIndex) => (
            <div
              key={lineIndex}
              className="absolute right-0 left-0 w-full text-right"
              style={{
                top: lineIndex * lineHeight,
                height: lineHeight,
              }}
            >
              {lineIndex + 1}
            </div>
          ))}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onScroll={onAreaScroll}
        onKeyDown={handleKeyDown}
        className="pt-2 font-mono whitespace-pre flex-1 px-2 resize-none focus:outline-none bg-transparent scrollbar-thin"
        style={{
          lineHeight: `${lineHeight}px`,
        }}
      />
    </div>
  );
}
