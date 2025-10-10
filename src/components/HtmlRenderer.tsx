import { useEffect, useRef } from 'react';

interface HtmlRendererProps {
  title: string;
  className?: string;
  srcDoc: string;
}

export default function HtmlRenderer({ ...props }: HtmlRendererProps) {
  const frame = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (frame?.current && props.srcDoc) frame.current.innerHTML = props.srcDoc;
  }, [frame, props.srcDoc]);

  return (
    <div className="h-full w-full relative">
      <div ref={frame} className={props.className} title={props.title} />
    </div>
  );
}
