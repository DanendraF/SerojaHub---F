import Image, { type ImageProps } from 'next/image';

function isRemote(src: ImageProps['src']) {
  return typeof src === 'string' && /^https?:\/\//i.test(src);
}

export function SmartImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  const remote = isRemote(src);
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={unoptimized ?? remote}
      {...rest}
    />
  );
}
