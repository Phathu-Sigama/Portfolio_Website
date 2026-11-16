/* The logo is a tiny static SVG; next/image optimisation would add nothing. */
/* eslint-disable @next/next/no-img-element */

/** Aspect ratio of public/ps-logo.svg (52 × 49 logo pixels). */
const RATIO = 52 / 49;

export default function PsLogo({
  height,
  alt = "",
  className,
}: {
  height: number;
  /** Leave empty when the logo sits next to text that already names it. */
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src="/ps-logo.svg"
      width={Math.round(height * RATIO)}
      height={height}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}
