"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { cv, isSectionId, sections, type SectionId } from "@/data/cv";
import AboutText from "@/components/shared/AboutText";
import { restartBoot } from "@/components/shared/BootScreen";
import { noteSectionOpened, onOpenSectionRequest } from "@/components/shared/HirePrompt";
import PixelIcon, { type IconName } from "@/components/shared/PixelIcon";
import PsLogo from "@/components/shared/PsLogo";
import SectionContent from "@/components/shared/SectionContent";
import SocialLinks from "@/components/shared/SocialLinks";
import SpinningLogo from "@/components/shared/SpinningLogo";
import contentStyles from "@/components/shared/SectionContent.module.css";
import StatusBar from "./StatusBar";
import styles from "./Mobile.module.css";

type AppId = SectionId | "settings" | "about" | "social";

const apps: { id: AppId; label: string; title?: string; icon: IconName }[] = [
  ...sections.map((s) => ({ id: s.id, label: s.label, icon: s.id as IconName })),
  { id: "social", label: "Social Media", icon: "social" },
  { id: "settings", label: "Settings", icon: "settings" },
  // Its tile shows the spinning 3D logo instead of a pixel icon.
  { id: "about", label: "About", title: "About Phathu OS", icon: "help" },
];

/** Sections whose content is one block and therefore needs a surrounding grouped panel. */
const PANELLED: AppId[] = ["profile", "certifications", "contact"];

/* The open app lives in the URL hash, so the browser's Back button returns to the home screen. */
function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}
const getHash = () => window.location.hash.slice(1);
const getServerHash = () => "";

/** Glossy early-smartphone icon tile. */
function Tile({ icon, logo, spin }: { icon?: IconName; logo?: boolean; spin?: boolean }) {
  if (spin) {
    return (
      <span className={`${styles.tile} ${styles["tile-about"]}`}>
        <SpinningLogo className={styles.tileSpin} />
      </span>
    );
  }
  return (
    <span className={`${styles.tile} ${styles[`tile-${logo ? "home" : icon}`]}`}>
      {logo ? <PsLogo height={38} /> : <PixelIcon name={icon!} size={40} />}
    </span>
  );
}

export default function MobileShell() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const app: AppId | null = isSectionId(hash) || hash === "settings" || hash === "about" || hash === "social" ? hash : null;
  const current = apps.find((a) => a.id === app);

  const gridRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLElement>(null);
  const githubDialog = useRef<HTMLDialogElement>(null);
  const lastOpened = useRef<AppId | null>(null);
  const { contact } = cv;

  function openApp(id: AppId) {
    lastOpened.current = id;
    window.history.pushState({ psApp: true }, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    if (isSectionId(id)) noteSectionOpened(id);
  }

  function goHome() {
    if (!app) {
      gridRef.current?.scrollTo({ top: 0 });
      return;
    }
    if (window.history.state?.psApp) {
      // We pushed this entry ourselves, so Back lands on the home screen.
      window.history.back();
    } else {
      // Arrived by a direct link such as /#projects: there is no home entry to go back to.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  // The "Are you impressed?" pop-up can ask for a section (Contact) to be opened.
  useEffect(
    () =>
      onOpenSectionRequest((id) => {
        if (!window.matchMedia("(max-width: 767.98px)").matches) return;
        if (window.location.hash === `#${id}`) return;
        if (window.location.hash.length > 1) {
          // Another app is open: swap it, so Home / Back still lead to the home screen.
          window.history.replaceState(window.history.state, "", `#${id}`);
        } else {
          window.history.pushState({ psApp: true }, "", `#${id}`);
        }
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }),
    [],
  );

  // Move focus with the navigation, but only when this interface is the visible one.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767.98px)").matches) return;
    if (app) {
      appRef.current?.focus({ preventScroll: true });
    } else if (lastOpened.current) {
      document.getElementById(`app-icon-${lastOpened.current}`)?.focus({ preventScroll: true });
      lastOpened.current = null;
    }
  }, [app]);

  return (
    <div className={styles.phone}>
      {/* The home screen stays mounted while an app is open, so its scroll position is preserved. */}
      <div className={styles.home} inert={app !== null}>
        <StatusBar />
        <div className={styles.gridScroll} ref={gridRef}>
          <nav aria-label="CV apps">
            <ul className={styles.grid}>
              {apps.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    id={`app-icon-${item.id}`}
                    className={styles.appButton}
                    onClick={() => openApp(item.id)}
                  >
                    <Tile icon={item.icon} spin={item.id === "about"} />
                    <span className={styles.appLabel}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dotActive} />
          <span />
          <span />
        </div>

        <nav aria-label="Dock" className={styles.dock}>
          <ul>
            <li>
              <button type="button" className={styles.appButton} onClick={goHome}>
                <Tile logo />
                <span className={styles.appLabel}>Home</span>
              </button>
            </li>
            <li>
              <a className={styles.appButton} href={contact.cvFile} download={contact.cvFileName}>
                <Tile icon="document" />
                <span className={styles.appLabel}>
                  CV<span className="sr-only"> — download PDF</span>
                </span>
              </a>
            </li>
            <li>
              {contact.github ? (
                <a className={styles.appButton} href={contact.github} target="_blank" rel="noopener noreferrer">
                  <Tile icon="server" />
                  <span className={styles.appLabel}>
                    GitHub<span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              ) : (
                <button type="button" className={styles.appButton} onClick={() => githubDialog.current?.showModal()}>
                  <Tile icon="server" />
                  <span className={styles.appLabel}>GitHub</span>
                </button>
              )}
            </li>
            <li>
              <a className={styles.appButton} href={`mailto:${contact.email}`}>
                <Tile icon="mail" />
                <span className={styles.appLabel}>Email</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {current && (
        <section className={styles.app} ref={appRef} tabIndex={-1} aria-labelledby="mobile-app-title">
          <StatusBar />
          <header className={styles.navBar}>
            <button type="button" className={styles.backButton} onClick={goHome}>
              <span>
                <span aria-hidden="true">◀ </span>Home
              </span>
            </button>
            <h2 id="mobile-app-title" className={styles.navTitle}>
              {current.title ?? current.label}
            </h2>
          </header>
          <div className={styles.appScroll}>
            {current.id === "settings" ? (
              <div className={contentStyles.content}>
                <div className={styles.panel}>
                  <div className={styles.settingsHead}>
                    <PsLogo height={56} alt="PS logo" />
                    <div>
                      <h3 className={contentStyles.entryTitle}>Phathu Mobile</h3>
                      <p>Version 1.0</p>
                    </div>
                  </div>
                  <dl className={contentStyles.contactList}>
                    <div>
                      <dt>Owner</dt>
                      <dd>{cv.identity.name}</dd>
                    </div>
                    <div>
                      <dt>Apps</dt>
                      <dd>{sections.length} CV apps</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{cv.identity.location}</dd>
                    </div>
                  </dl>
                  <p>On a tablet or computer this site becomes Phathu OS 9, a classic desktop.</p>
                </div>
                <div className={styles.settingsActions}>
                  <button type="button" className={contentStyles.button} onClick={restartBoot}>
                    Replay start-up screen
                  </button>
                  <a className={contentStyles.button} href={contact.cvFile} download={contact.cvFileName}>
                    Download CV (PDF)
                  </a>
                </div>
              </div>
            ) : current.id === "social" ? (
              <SocialLinks />
            ) : current.id === "about" ? (
              <div className={contentStyles.content}>
                <div className={styles.panel}>
                  <SpinningLogo className={styles.aboutSpin} />
                  <AboutText />
                </div>
                <div className={styles.settingsActions}>
                  <a className={contentStyles.button} href={contact.cvFile} download={contact.cvFileName}>
                    Download CV (PDF)
                  </a>
                </div>
              </div>
            ) : PANELLED.includes(current.id) ? (
              <div className={styles.panel}>
                <SectionContent id={current.id} />
              </div>
            ) : (
              <SectionContent id={current.id} />
            )}
          </div>
        </section>
      )}

      <dialog ref={githubDialog} className={styles.alert} aria-labelledby="github-alert-title">
        <h2 id="github-alert-title">GitHub</h2>
        <p>A GitHub profile has not been linked to this portfolio yet. Email {cv.identity.name.split(" ")[0]} for code samples.</p>
        <form method="dialog">
          <button type="submit" className={contentStyles.button}>
            OK
          </button>
        </form>
      </dialog>
    </div>
  );
}
