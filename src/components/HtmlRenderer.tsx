interface HtmlRendererProps {
  title: string;
  className?: string;
  srcDoc: string;
}

export default function HtmlRenderer({ ...props }: HtmlRendererProps) {
  return (
    <div className="h-full w-full relative">
      <iframe {...props} sandbox="allow-scripts" />
    </div>
  );
}
