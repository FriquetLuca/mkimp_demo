interface HtmlRendererProps {
  title: string;
  className?: string;
  htmlcontent: string;
}

export default function HtmlRenderer({ ...props }: HtmlRendererProps) {
  return <iframe {...props} sandbox="allow-scripts" />;
}
