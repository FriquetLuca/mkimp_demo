interface HtmlRendererProps {
  title: string;
  className?: string;
  srcDoc: string;
  disabled?: boolean;
}

export default function HtmlRenderer({ ...props }: HtmlRendererProps) {
  return (
    <div
      className={
        props.disabled
          ? 'w-full h-full relative -z-10'
          : 'h-full w-full relative z-0'
      }
    >
      <iframe {...props} sandbox="allow-scripts" />
    </div>
  );
}
