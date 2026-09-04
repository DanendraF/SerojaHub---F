import Image, { type ImageProps } from 'next/image';

function isRemote(src: ImageProps['src']) {
  return typeof src === 'string' && /^https?:\/\//i.test(src);
}

export function SmartImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={unoptimized}
      {...rest}
    />
  );
}
