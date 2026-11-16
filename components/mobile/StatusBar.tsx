"use client";

import PsLogo from "@/components/shared/PsLogo";
import { media, useMedia } from "@/components/shared/mediaStore";
import { useClock } from "@/components/shared/useClock";
import styles from "./Mobile.module.css";

/** The black phone status bar. Signal and battery are decorative. */
export default function StatusBar() {
  const clock = useClock();
  const { playing, muted } = useMedia();
  return (
    <div className={styles.statusBar}>
      <span className={styles.carrier}>
        <PsLogo height={20} />
        PHATHU
        {/* A note appears while the Media Player's track is playing. */}
        {playing && (
          <svg className={styles.statusNote} width="12" height="14" viewBox="0 0 12 14" shapeRendering="crispEdges" role="img" aria-label="Music playing">
            <path d="M4 0h8v3H6v8H4zM0 9h6v5H0zM10 3h2v6h-2zM6 7h6v5H6z" fill="#b4f000" />
          </svg>
        )}
      </span>
      <time className={styles.statusTime} dateTime={clock.iso} suppressHydrationWarning>
        {clock.time}
      </time>
      <span className={styles.statusRight}>
        {/* Mutes the music from any screen. Drawn as shapes so phones cannot swap in an emoji. */}
        <button type="button" className={styles.muteButton} aria-pressed={muted} onClick={media.toggleMute}>
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
            <path d="M0 4h4l5-4v14l-5-4H0z" fill="#fff" />
            {muted ? (
              <path d="M12 3l7 8M19 3l-7 8" stroke="#ff5a4a" strokeWidth="2" fill="none" />
            ) : (
              <path d="M12 4v6M15 2v10M18 0v14" stroke="#fff" strokeWidth="1.5" fill="none" />
            )}
          </svg>
          <span className="sr-only">Mute music</span>
        </button>
        <svg aria-hidden="true" width="22" height="14" viewBox="0 0 22 14" shapeRendering="crispEdges">
          <path d="M0 10h3v4H0zM5 7h3v7H5zM10 4h3v10h-3zM15 0h3v14h-3z" fill="#fff" />
        </svg>
        <span aria-hidden="true">92%</span>
        <svg aria-hidden="true" width="28" height="14" viewBox="0 0 28 14" shapeRendering="crispEdges">
          <path d="M1 1h23v12H1z" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M4 4h16v6H4zM25 4h3v6h-3z" fill="#fff" />
        </svg>
      </span>
    </div>
  );
}
