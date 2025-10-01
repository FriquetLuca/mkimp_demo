import { useEffect, useRef } from 'react';

interface HtmlRendererProps {
  htmlContent: string;
}

export default function HtmlRenderer({ htmlContent }: HtmlRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      // Write the full HTML into the iframe
      iframe.contentDocument.open();
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      title="HTML Renderer"
      sandbox="allow-same-origin allow-scripts"
      style={{
        width: '100%',
        height: '600px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
      }}
    />
  );
}
