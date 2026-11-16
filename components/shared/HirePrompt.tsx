"use client";

import { useEffect, useRef } from "react";
import { cv, type SectionId } from "@/data/cv";
import PsLogo from "./PsLogo";
import styles from "./HirePrompt.module.css";

const SECTION_OPENED = "ps:section-opened";
const OPEN_SECTION = "ps:open-section";
const SEEN_KEY = "ps-hire-prompt-seen";

/*
 * When the "Are you impressed?" pop-up appears — once per visitor, ever:
 *
 *   • after they have opened 3 different CV sections (real interest), but never in the
 *     first 30 seconds, and 5 seconds after their latest click so it does not land on
 *     top of something they have only just opened;
 *   • or, for slow readers who stay in one or two sections, 60 seconds after they opened
 *     their first one.
 *
 * It waits if they are typing, another dialog is open, the tab is hidden or the
 * start-up screen is still showing.
 */
const SECTIONS_NEEDED = 3;
const MIN_TIME_ON_SITE = 30_000;
const PAUSE_AFTER_LAST_OPEN = 5_000;
const SLOW_READER_TIME = 60_000;
const RETRY_WHEN_BUSY = 4_000;

/** Called by both interfaces whenever a CV section is opened. */
export function noteSectionOpened(id: SectionId) {
  window.dispatchEvent(new CustomEvent<SectionId>(SECTION_OPENED, { detail: id }));
}

/** Lets the pop-up ask whichever interface is visible to open a section. */
export function onOpenSectionRequest(handler: (id: SectionId) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<SectionId>).detail);
  window.addEventListener(OPEN_SECTION, listener);
  return () => window.removeEventListener(OPEN_SECTION, listener);
}

function isBusy() {
  const boot = document.querySelector<HTMLElement>("[data-boot]");
  const bootStyle = boot && getComputedStyle(boot);
  const bootShowing = bootStyle && bootStyle.display !== "none" && bootStyle.visibility !== "hidden";
  const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "");
  return document.hidden || bootShowing || typing || document.querySelector("dialog[open]") !== null;
}

export default function HirePrompt() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { contact, identity } = cv;
  const firstName = identity.name.split(" ")[0];

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      // Storage unavailable (private mode): the pop-up may show once per page load instead.
    }

    const arrived = Date.now();
    const opened = new Set<SectionId>();
    let timer: number | undefined;
    let shown = false;

    const show = () => {
      if (shown) return;
      if (isBusy()) {
        timer = window.setTimeout(show, RETRY_WHEN_BUSY);
        return;
      }
      shown = true;
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // ignore
      }
      dialogRef.current?.showModal();
    };

    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(show, Math.max(0, delay));
    };

    const onOpened = (event: Event) => {
      if (shown) return;
      opened.add((event as CustomEvent<SectionId>).detail);
      const elapsed = Date.now() - arrived;
      if (opened.size >= SECTIONS_NEEDED) {
        schedule(Math.max(PAUSE_AFTER_LAST_OPEN, MIN_TIME_ON_SITE - elapsed));
      } else if (opened.size === 1) {
        schedule(SLOW_READER_TIME);
      }
    };

    window.addEventListener(SECTION_OPENED, onOpened);
    return () => {
      window.removeEventListener(SECTION_OPENED, onOpened);
      window.clearTimeout(timer);
    };
  }, []);

  const close = () => dialogRef.current?.close();

  const viewContact = () => {
    close();
    window.dispatchEvent(new CustomEvent<SectionId>(OPEN_SECTION, { detail: "contact" }));
  };

  // The email draft the "Hire" button opens, pre-filled so the visitor only has to add details and send.
  const subject = "Let’s build something great";
  const body = `Hi ${firstName},\n\nI came across your portfolio and would like to discuss a potential opportunity with you.\n\n`;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <dialog ref={dialogRef} className={styles.prompt} aria-labelledby="hire-prompt-title">
      <div className={styles.titleBar}>
        <button type="button" className={styles.closeBox} onClick={close}>
          <span className="sr-only">Close</span>
        </button>
        <span className={styles.stripes} aria-hidden="true" />
        <span className={styles.titleText}>PHATHU OS</span>
        <span className={styles.stripes} aria-hidden="true" />
      </div>
      <div className={styles.body}>
        <div className={styles.badge}>
          <PsLogo height={72} />
        </div>
        <div className={styles.copy}>
          <h2 id="hire-prompt-title" className={styles.heading}>
            Are you impressed?
          </h2>
          <p className={styles.sub}>Hire me — let’s build something great.</p>
        </div>
        <div className={styles.actions}>
          {/* The default button, as in a classic alert: focused first, with a double border. */}
          <a className={`${styles.button} ${styles.buttonDefault}`} href={mailto} onClick={close} autoFocus>
            Hire {firstName}
          </a>
          <button type="button" className={styles.button} onClick={viewContact}>
            View contact
          </button>
        </div>
      </div>
    </dialog>
  );
}
