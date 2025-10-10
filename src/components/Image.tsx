import { urlPrefix } from '../utils/urlPrefix';

export default function Image({
  src,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  return <img {...props} src={src ? urlPrefix(src) : src} />;
}
