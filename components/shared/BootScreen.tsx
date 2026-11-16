"use client";

import { useEffect, useState } from "react";
import { cv, sections } from "@/data/cv";
import StatusBar from "@/components/mobile/StatusBar";
import PixelIcon from "./PixelIcon";
import SpinningLogo from "./SpinningLogo";
import styles from "./BootScreen.module.css";

export const RESTART_EVENT = "ps:restart";
const YEAR = new Date().getFullYear();

/** Ask the boot screen to play again (used by Special ▸ Restart and mobile Settings). */
export function restartBoot() {
  window.dispatchEvent(new Event(RESTART_EVENT));
}

function BootDialog({ title, status }: { title: string; status: string }) {
  return (
    <div className={styles.dialog}>
      <SpinningLogo boot className={styles.logoBox} />
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{cv.identity.name} Portfolio</p>
      <div className={styles.bar} aria-hidden="true">
        <div className={styles.fill} />
      </div>
      <p className={styles.status}>{status}</p>
      <ul className={styles.icons} aria-hidden="true">
        {sections.map((section, index) => (
          <li key={section.id} style={{ animationDelay: `${400 + index * 700}ms` }}>
            <PixelIcon name={section.id} size={40} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The start-up screen. Its timing is pure CSS (see BootScreen.module.css), so it always
 * dismisses itself after ~5.6s — even if JavaScript never loads. JavaScript only adds
 * "tap to skip", the once-per-session skip (inline script in app/layout.tsx) and Restart.
 */
export default function BootScreen() {
  const [run, setRun] = useState(0);

  useEffect(() => {
    const replay = () => {
      delete document.documentElement.dataset.booted;
      setRun((n) => n + 1);
    };
    window.addEventListener(RESTART_EVENT, replay);
    return () => window.removeEventListener(RESTART_EVENT, replay);
  }, []);

  const skip = () => {
    document.documentElement.dataset.booted = "1";
  };

  return (
    <div key={run} className={styles.boot} role="status" data-boot onClick={skip}>
      <div className={styles.desktop}>
        <BootDialog title="Welcome to Phathu OS 9" status="Loading portfolio extensions..." />
        <p className={styles.footLeft} suppressHydrationWarning>
          © {YEAR} {cv.identity.name}
        </p>
        <p className={styles.footRight}>{cv.identity.location}</p>
      </div>
      <div className={styles.mobile}>
        <StatusBar />
        <div className={styles.mobileBody}>
          <BootDialog title="Starting Phathu Mobile" status="Loading CV apps..." />
          <ul className={styles.steps} aria-hidden="true">
            <li>Optimising for mobile</li>
            <li>Loading project data</li>
            <li>Preparing contact links</li>
          </ul>
        </div>
        <p className={styles.footMobile} suppressHydrationWarning>
          © {YEAR} {cv.identity.name} • Cape Town
        </p>
      </div>
    </div>
  );
}
