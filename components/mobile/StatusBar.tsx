"use client";

import PsLogo from "@/components/shared/PsLogo";
import { useClock } from "@/components/shared/useClock";
import styles from "./Mobile.module.css";

/** The black phone status bar. Signal and battery are decorative. */
export default function StatusBar() {
  const clock = useClock();
  return (
    <div className={styles.statusBar}>
      <span className={styles.carrier}>
        <PsLogo height={20} />
        PHATHU
      </span>
      <time className={styles.statusTime} dateTime={clock.iso} suppressHydrationWarning>
        {clock.time}
      </time>
      <span className={styles.statusRight} aria-hidden="true">
        <svg width="22" height="14" viewBox="0 0 22 14" shapeRendering="crispEdges">
          <path d="M0 10h3v4H0zM5 7h3v7H5zM10 4h3v10h-3zM15 0h3v14h-3z" fill="#fff" />
        </svg>
        <span>92%</span>
        <svg width="28" height="14" viewBox="0 0 28 14" shapeRendering="crispEdges">
          <path d="M1 1h23v12H1z" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M4 4h16v6H4zM25 4h3v6h-3z" fill="#fff" />
        </svg>
      </span>
    </div>
  );
}
