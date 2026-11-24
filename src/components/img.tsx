import Image, { type ImageProps } from "next/image"

type Props = Omit<ImageProps, "width" | "height" | "alt" | "src"> & {
  src: string
  alt?: string
  width?: number
  height?: number
}

/**
 * Optimised drop-in for <img>: served as AVIF/WebP at the right size via the Next image optimiser.
 * Width/height only reserve the aspect ratio; CSS classes control the rendered size. Use `fill` inside a sized, relative parent.
 */
export function Img({ src, alt = "", width = 640, height = 480, quality = 70, sizes = "(min-width:1024px) 25vw, 50vw", loading, priority, fill, ...rest }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      {...(fill ? { fill: true } : { width, height })}
      quality={quality}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading ?? "lazy"}
      {...rest}
    />
  )
}
