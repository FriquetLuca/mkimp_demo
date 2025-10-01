interface HtmlRendererProps {
  title: string;
  className?: string;
  htmlContent: string;
}

export default function HtmlRenderer({
  className,
  htmlContent,
  title,
}: HtmlRendererProps) {
  return (
    <iframe
      title={title}
      className={className}
      srcDoc={htmlContent}
      sandbox="allow-same-origin allow-scripts"
    />
  );
}
