"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import styles from "./Desktop.module.css";

export interface Point {
  x: number;
  y: number;
}

interface WindowProps {
  id: string;
  title: string;
  active: boolean;
  collapsed: boolean;
  zoomed: boolean;
  /** null = use the CSS default position for this window. */
  position: Point | null;
  zIndex: number;
  className?: string;
  /** Rendered between the title bar and the scrolling content (e.g. the Finder info bar). */
  toolbar?: ReactNode;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onCollapse: () => void;
  onZoom: () => void;
  onMove: (position: Point) => void;
}

const MENU_BAR_HEIGHT = 28;
const KEY_STEP = 24;

/** Keep a window rectangle fully inside the viewport (and below the menu bar). Viewport coordinates. */
function clamp(x: number, y: number, width: number, height: number): Point {
  const maxX = Math.max(0, window.innerWidth - width);
  const maxY = Math.max(MENU_BAR_HEIGHT, window.innerHeight - height);
  return {
    x: Math.floor(Math.min(Math.max(0, x), maxX)),
    y: Math.floor(Math.min(Math.max(MENU_BAR_HEIGHT, y), maxY)),
  };
}

export default function Window({
  id,
  title,
  active,
  collapsed,
  zoomed,
  position,
  zIndex,
  className,
  toolbar,
  children,
  onFocus,
  onClose,
  onCollapse,
  onZoom,
  onMove,
}: WindowProps) {
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const titleId = `window-title-${id}`;

  // Re-clamp when the viewport or the window's own size changes, so it can never be stranded off-screen.
  const hasPosition = position !== null;
  const reclamp = useCallback(() => {
    const el = ref.current;
    if (!el || !hasPosition) return;
    const rect = el.getBoundingClientRect();
    const next = clamp(rect.left, rect.top, rect.width, rect.height);
    if (Math.abs(next.x - rect.left) >= 1 || Math.abs(next.y - rect.top) >= 1) onMove(next);
  }, [hasPosition, onMove]);

  useEffect(() => {
    window.addEventListener("resize", reclamp);
    return () => window.removeEventListener("resize", reclamp);
  }, [reclamp]);

  useEffect(() => {
    const frame = requestAnimationFrame(reclamp);
    return () => cancelAnimationFrame(frame);
  }, [collapsed, reclamp]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (zoomed || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    const rect = ref.current!.getBoundingClientRect();
    drag.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const rect = ref.current!.getBoundingClientRect();
    onMove(clamp(event.clientX - drag.current.dx, event.clientY - drag.current.dy, rect.width, rect.height));
  }

  function endDrag() {
    drag.current = null;
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    // Alt + arrow keys move the window for keyboard users.
    if (event.altKey && event.key.startsWith("Arrow") && !zoomed) {
      event.preventDefault();
      const rect = ref.current!.getBoundingClientRect();
      const dx = event.key === "ArrowLeft" ? -KEY_STEP : event.key === "ArrowRight" ? KEY_STEP : 0;
      const dy = event.key === "ArrowUp" ? -KEY_STEP : event.key === "ArrowDown" ? KEY_STEP : 0;
      onMove(clamp(rect.left + dx, rect.top + dy, rect.width, rect.height));
    }
  }

  const classes = [
    styles.window,
    active ? styles.windowActive : "",
    collapsed ? styles.windowCollapsed : "",
    zoomed ? styles.windowZoomed : "",
    className ?? "",
  ].join(" ");

  const style =
    position && !zoomed
      ? // Positions are stored in viewport coordinates; the window is laid out inside the
        // desktop surface, which starts below the menu bar.
        { left: position.x, top: position.y - MENU_BAR_HEIGHT, right: "auto", bottom: "auto", zIndex }
      : { zIndex };

  return (
    <section
      ref={ref}
      id={`window-${id}`}
      className={classes}
      style={style}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
      onKeyDown={onKeyDown}
    >
      <div
        className={styles.titleBar}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(event) => {
          if (!(event.target as HTMLElement).closest("button")) onCollapse();
        }}
      >
        <button type="button" className={`${styles.box} ${styles.closeBox}`} onClick={onClose}>
          <span className="sr-only">Close {title} window</span>
        </button>
        <span className={styles.stripes} aria-hidden="true" />
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <span className={styles.stripes} aria-hidden="true" />
        <button type="button" className={`${styles.box} ${styles.zoomBox}`} aria-pressed={zoomed} onClick={onZoom}>
          <span className="sr-only">Zoom {title} window</span>
        </button>
        <button
          type="button"
          className={`${styles.box} ${styles.collapseBox}`}
          aria-expanded={!collapsed}
          onClick={onCollapse}
        >
          <span className="sr-only">{collapsed ? `Expand ${title} window` : `Minimize ${title} window`}</span>
        </button>
      </div>
      <div className={styles.windowBody} hidden={collapsed}>
        {toolbar}
        <div className={styles.windowContent} tabIndex={0} role="group" aria-label={`${title} content`}>
          {children}
        </div>
      </div>
    </section>
  );
}
