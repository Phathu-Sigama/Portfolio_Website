import { useId, type ReactNode } from "react";

/**
 * Original pixel-art icons drawn on a 32×32 grid.
 * They are decorative: the accessible name always comes from the surrounding control.
 */
export type IconName =
  | "profile"
  | "education"
  | "projects"
  | "experience"
  | "skills"
  | "certifications"
  | "contact"
  | "settings"
  | "drive"
  | "trash"
  | "document"
  | "server"
  | "mail"
  | "help"
  | "social"
  | "media"
  | "idcard";

const K = "#000";
const W = "#fff";
const P = "#dddddd";
const G = "#999999";
const D = "#555555";
const B = "#6b74e0";
const L = "#b4b9f6";
const Y = "#f0c040";
const GR = "#b4f000";

function r(x: number, y: number, w: number, h: number, fill: string, key?: string) {
  return <rect key={key ?? `${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

/** A filled pixel circle, one row at a time. */
function disc(cx: number, cy: number, radius: number, fill: string) {
  return Array.from({ length: radius * 2 }, (_, i) => {
    const dy = i - radius + 0.5;
    const half = Math.round(Math.sqrt(radius * radius - dy * dy));
    return r(cx - half, cy - radius + i, half * 2, 1, fill, `disc-${fill}-${radius}-${i}`);
  });
}

function art(name: IconName, uid: string): ReactNode {
  switch (name) {
    case "profile":
      return (
        <>
          <defs>
            <pattern id={uid} width="2" height="2" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" fill={W} />
              <rect width="1" height="1" fill={K} />
            </pattern>
          </defs>
          {r(2, 2, 28, 28, K)}
          <rect x="3" y="3" width="26" height="26" fill={`url(#${uid})`} />
          {/* hair */}
          {r(12, 5, 8, 1, K)}
          {r(10, 6, 12, 1, K)}
          {r(8, 7, 16, 2, K)}
          {r(7, 9, 18, 6, K)}
          {r(8, 15, 16, 2, K)}
          {/* head, neck and shoulders */}
          {r(10, 17, 12, 2, K)}
          {r(11, 19, 10, 1, K)}
          {r(13, 20, 6, 2, K)}
          {r(9, 22, 14, 1, K)}
          {r(7, 23, 18, 1, K)}
          {r(5, 24, 22, 5, K)}
        </>
      );
    case "education":
      return (
        <>
          {/* bottom book */}
          {r(3, 17, 26, 11, K)}
          {r(4, 18, 24, 9, Y)}
          {r(7, 20, 21, 5, W)}
          {r(7, 22, 21, 1, G)}
          {r(4, 18, 24, 1, "#f8dc80")}
          {/* top book */}
          {r(5, 6, 24, 11, K)}
          {r(6, 7, 22, 9, B)}
          {r(6, 7, 22, 1, L)}
          {r(9, 10, 19, 4, W)}
          {r(9, 12, 19, 1, G)}
          {r(6, 15, 22, 1, "#4a52b8")}
        </>
      );
    case "projects":
      return (
        <>
          {r(3, 4, 26, 24, K)}
          {r(4, 5, 24, 5, P)}
          {r(6, 6, 3, 3, "#e0443a")}
          {r(10, 6, 3, 3, Y)}
          {r(14, 6, 3, 3, "#58b848")}
          {r(4, 11, 24, 16, L)}
          <path d="M12 14 8 19l4 5M20 14l4 5-4 5M18 13l-4 12" fill="none" stroke={K} strokeWidth="2" />
        </>
      );
    case "experience":
      return (
        <>
          {r(11, 4, 10, 2, K)}
          {r(11, 6, 2, 4, K)}
          {r(19, 6, 2, 4, K)}
          {r(2, 9, 28, 19, K)}
          {r(3, 10, 26, 17, "#8a8a8a")}
          {r(3, 10, 26, 7, "#b8b8b8")}
          {r(3, 10, 26, 1, P)}
          {r(3, 17, 26, 1, K)}
          {r(13, 15, 6, 6, K)}
          {r(14, 16, 4, 4, Y)}
        </>
      );
    case "skills":
      return (
        <>
          {r(3, 3, 26, 21, K)}
          {r(4, 4, 24, 19, P)}
          {r(4, 4, 24, 1, W)}
          {r(6, 6, 20, 14, K)}
          <path d="M9 9l4 4-4 4" fill="none" stroke={GR} strokeWidth="2" />
          {r(15, 16, 6, 2, GR)}
          {r(22, 21, 3, 1, "#58b848")}
          {r(12, 24, 8, 2, K)}
          {r(7, 26, 18, 3, K)}
          {r(8, 27, 16, 1, P)}
        </>
      );
    case "certifications":
      return (
        <>
          {r(2, 5, 28, 19, K)}
          {r(3, 6, 26, 17, "#fff8dc")}
          {r(5, 8, 22, 1, L)}
          {r(5, 20, 12, 1, L)}
          {r(5, 8, 1, 13, L)}
          {r(26, 8, 1, 8, L)}
          {r(8, 11, 14, 1, B)}
          {r(8, 14, 10, 1, B)}
          {r(8, 17, 7, 1, B)}
          {/* ribbon */}
          {r(19, 22, 4, 8, K)}
          {r(24, 22, 4, 8, K)}
          {r(20, 22, 2, 7, B)}
          {r(25, 22, 2, 7, B)}
          {/* seal */}
          {r(20, 15, 7, 9, K)}
          {r(19, 16, 9, 7, K)}
          {r(20, 16, 7, 7, Y)}
          {r(22, 18, 3, 3, "#c89010")}
        </>
      );
    case "contact":
      return (
        <>
          {r(2, 13, 28, 17, K)}
          {r(3, 14, 26, 15, P)}
          {/* letter */}
          {r(6, 2, 20, 18, K)}
          {r(7, 3, 18, 17, W)}
          {/* @ */}
          {r(11, 5, 9, 1, B)}
          {r(10, 6, 2, 8, B)}
          {r(11, 14, 10, 1, B)}
          {r(20, 6, 2, 6, B)}
          {r(14, 8, 4, 1, B)}
          {r(13, 9, 2, 3, B)}
          {r(14, 12, 4, 1, B)}
          {r(17, 8, 2, 4, B)}
          {r(18, 12, 3, 1, B)}
          {/* envelope front */}
          <path d="M3 15v14h26V15L16 24z" fill={W} />
          <path d="M3 15l13 9 13-9M3 29l9-8M29 29l-9-8" fill="none" stroke={K} strokeWidth="1" />
        </>
      );
    case "mail":
      return (
        <>
          {r(2, 7, 28, 19, K)}
          {r(3, 8, 26, 17, W)}
          <path d="M3 8l13 10L29 8" fill="none" stroke={K} strokeWidth="1" />
          <path d="M3 25l9-9M29 25l-9-9" fill="none" stroke={G} strokeWidth="1" />
        </>
      );
    case "settings":
      return (
        <>
          {r(13, 1, 6, 30, K)}
          {r(1, 13, 30, 6, K)}
          {r(5, 5, 6, 6, K)}
          {r(21, 5, 6, 6, K)}
          {r(5, 21, 6, 6, K)}
          {r(21, 21, 6, 6, K)}
          {r(6, 8, 20, 16, K)}
          {r(8, 6, 16, 20, K)}
          {r(14, 2, 4, 28, G)}
          {r(2, 14, 28, 4, G)}
          {r(6, 6, 4, 4, G)}
          {r(22, 6, 4, 4, G)}
          {r(6, 22, 4, 4, G)}
          {r(22, 22, 4, 4, G)}
          {r(7, 9, 18, 14, G)}
          {r(9, 7, 14, 18, G)}
          {r(9, 7, 14, 1, P)}
          {r(7, 9, 1, 14, P)}
          {r(11, 12, 10, 8, K)}
          {r(12, 11, 8, 10, K)}
          {r(12, 12, 8, 8, B)}
          {r(14, 14, 4, 4, P)}
        </>
      );
    case "drive":
      return (
        <>
          <path d="M7 7h18l5 6v10H2V13z" fill={K} />
          <path d="M8 8h16l4 5H4z" fill="#f2f2f2" />
          {r(3, 14, 26, 8, P)}
          {r(3, 14, 26, 1, W)}
          {r(3, 19, 26, 1, G)}
          {r(22, 16, 5, 3, K)}
          {r(23, 17, 3, 1, GR)}
          {r(5, 16, 10, 1, G)}
          {r(4, 23, 4, 2, K)}
          {r(24, 23, 4, 2, K)}
        </>
      );
    case "trash":
      return (
        <>
          {r(12, 2, 8, 2, K)}
          {r(12, 4, 2, 2, K)}
          {r(18, 4, 2, 2, K)}
          {r(5, 6, 22, 4, K)}
          {r(6, 7, 20, 2, P)}
          {r(6, 7, 20, 1, W)}
          <path d="M6 10h20l-2 20H8z" fill={K} />
          <path d="M7.5 11h17l-1.5 18H9z" fill={P} />
          {r(11, 12, 1, 16, D)}
          {r(12, 12, 1, 16, W)}
          {r(15, 12, 1, 16, D)}
          {r(16, 12, 1, 16, W)}
          {r(19, 12, 1, 16, D)}
          {r(20, 12, 1, 16, W)}
        </>
      );
    case "document":
      return (
        <>
          <path d="M5 2h15l7 7v21H5z" fill={K} />
          <path d="M6 3h13v7h7v19H6z" fill={W} />
          <path d="M20 4v5h5z" fill={P} />
          {r(9, 13, 14, 1, B)}
          {r(9, 16, 14, 1, B)}
          {r(9, 19, 14, 1, B)}
          {r(9, 22, 14, 1, B)}
          {r(9, 25, 8, 1, B)}
          {r(9, 7, 7, 3, D)}
        </>
      );
    case "server":
      return (
        <>
          {[4, 17].map((y) => (
            <g key={y}>
              {r(3, y, 26, 11, K)}
              {r(4, y + 1, 24, 9, P)}
              {r(4, y + 1, 24, 1, W)}
              {r(4, y + 9, 24, 1, G)}
              {r(6, y + 3, 12, 1, D)}
              {r(6, y + 5, 12, 1, D)}
              {r(6, y + 7, 12, 1, D)}
              {r(21, y + 3, 5, 5, K)}
              {r(22, y + 4, 3, 3, GR)}
            </g>
          ))}
          {r(8, 15, 3, 2, K)}
          {r(21, 15, 3, 2, K)}
          {r(6, 28, 20, 2, K)}
        </>
      );
    case "social":
      return (
        <>
          {/* back speech bubble */}
          {r(2, 3, 20, 14, K)}
          {r(3, 4, 18, 12, B)}
          {r(3, 4, 18, 1, L)}
          {r(5, 17, 4, 2, K)}
          {r(5, 19, 2, 2, K)}
          {r(6, 7, 12, 1, W)}
          {r(6, 10, 9, 1, W)}
          {/* front speech bubble */}
          {r(10, 13, 20, 13, K)}
          {r(11, 14, 18, 11, W)}
          {r(23, 26, 4, 2, K)}
          {r(25, 28, 2, 2, K)}
          {r(14, 17, 3, 3, B)}
          {r(19, 17, 3, 3, B)}
          {r(24, 17, 3, 3, B)}
          {r(14, 22, 12, 1, G)}
        </>
      );
    case "media":
      return (
        <>
          {/* vinyl record */}
          {disc(16, 16, 14, K)}
          {/* grooves catching the light */}
          {r(8, 6, 4, 1, G)}
          {r(6, 8, 2, 2, G)}
          {r(10, 9, 3, 1, D)}
          {r(9, 10, 1, 2, D)}
          {r(20, 25, 4, 1, G)}
          {r(24, 22, 2, 2, G)}
          {r(19, 22, 3, 1, D)}
          {r(22, 20, 1, 2, D)}
          {/* label and spindle hole */}
          {disc(16, 16, 5, B)}
          {r(13, 12, 6, 1, L)}
          {r(15, 15, 2, 2, W)}
        </>
      );
    case "idcard":
      return (
        <>
          {r(2, 5, 28, 22, K)}
          {r(3, 6, 26, 20, W)}
          {r(3, 6, 26, 5, "#2f5fc4")}
          {r(3, 6, 26, 1, "#86aaf6")}
          {/* person */}
          {r(8, 14, 4, 4, K)}
          {r(6, 19, 8, 5, K)}
          {/* details */}
          {r(17, 14, 10, 1, D)}
          {r(17, 17, 10, 1, D)}
          {r(17, 20, 7, 1, D)}
          {r(17, 23, 9, 1, G)}
        </>
      );
    case "help":
      return (
        <>
          {r(4, 3, 24, 26, K)}
          {r(5, 4, 22, 24, Y)}
          {r(5, 4, 22, 1, "#f8dc80")}
          {r(12, 8, 8, 2, K)}
          {r(10, 10, 3, 3, K)}
          {r(19, 10, 3, 5, K)}
          {r(16, 14, 4, 2, K)}
          {r(14, 16, 4, 4, K)}
          {r(14, 22, 4, 3, K)}
        </>
      );
  }
}

export default function PixelIcon({
  name,
  size = 32,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const uid = useId();
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {art(name, uid)}
    </svg>
  );
}
