export function urlPrefix(src: string) {
  if (__APP_MODE__ === 'build') {
    return `/mkimp_demo${src}`;
  }
  return src;
}
