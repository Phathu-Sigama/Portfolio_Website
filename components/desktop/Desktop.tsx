"use client";

import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { cv, isSectionId, sections, type SectionId } from "@/data/cv";
import AboutText from "@/components/shared/AboutText";
import { restartBoot } from "@/components/shared/BootScreen";
import { noteSectionOpened, onOpenSectionRequest } from "@/components/shared/HirePrompt";
import PixelIcon, { type IconName } from "@/components/shared/PixelIcon";
import PsLogo from "@/components/shared/PsLogo";
import SectionContent from "@/components/shared/SectionContent";
import SocialLinks from "@/components/shared/SocialLinks";
import SpinningLogo from "@/components/shared/SpinningLogo";
import { useClock } from "@/components/shared/useClock";
import contentStyles from "@/components/shared/SectionContent.module.css";
import MenuBar, { type Menu, type MenuItem } from "./MenuBar";
import Window, { type Point } from "./Window";
import styles from "./Desktop.module.css";

type WindowId = "finder" | SectionId | "about" | "help" | "trash" | "social";

interface WindowState {
  id: WindowId;
  position: Point | null;
  collapsed: boolean;
  zoomed: boolean;
}

type Action =
  | { type: "open"; id: WindowId }
  | { type: "close"; id: WindowId }
  | { type: "focus"; id: WindowId }
  | { type: "move"; id: WindowId; position: Point }
  | { type: "collapse"; id: WindowId }
  | { type: "zoom"; id: WindowId }
  | { type: "closeAll" }
  | { type: "cleanUp" };

const fresh = (id: WindowId): WindowState => ({ id, position: null, collapsed: false, zoomed: false });

/** The array order is the stacking order: the last window is frontmost and active. */
function reducer(state: WindowState[], action: Action): WindowState[] {
  switch (action.type) {
    case "open": {
      const existing = state.find((w) => w.id === action.id);
      return [...state.filter((w) => w.id !== action.id), existing ? { ...existing, collapsed: false } : fresh(action.id)];
    }
    case "close":
      return state.filter((w) => w.id !== action.id);
    case "focus": {
      if (state[state.length - 1]?.id === action.id) return state;
      const target = state.find((w) => w.id === action.id);
      return target ? [...state.filter((w) => w.id !== action.id), target] : state;
    }
    case "move":
      return state.map((w) => (w.id === action.id ? { ...w, position: action.position } : w));
    case "collapse":
      return state.map((w) => (w.id === action.id ? { ...w, collapsed: !w.collapsed } : w));
    case "zoom":
      return state.map((w) => (w.id === action.id ? { ...w, zoomed: !w.zoomed, collapsed: false } : w));
    case "closeAll":
      return [];
    case "cleanUp":
      return state.map((w) => fresh(w.id));
  }
}

const TITLES: Record<Exclude<WindowId, SectionId>, string> = {
  finder: cv.identity.name,
  about: "About Phathu OS 9",
  help: "Phathu OS Help",
  trash: "Trash",
  social: "Social Media",
};

const titleOf = (id: WindowId) =>
  isSectionId(id) ? sections.find((s) => s.id === id)!.label : TITLES[id];

/** CSS class that supplies each window's default (un-dragged) position and size. */
const PLACEMENT: Record<WindowId, string> = {
  finder: styles.placeFinder,
  profile: styles.placeProfile,
  education: styles.slot1,
  projects: styles.slot2,
  experience: styles.slot3,
  skills: styles.slot4,
  certifications: styles.slot5,
  contact: styles.slot6,
  about: styles.placeAbout,
  help: styles.slot7,
  trash: styles.placeDialog,
  social: styles.placeDialog,
};

/** An icon that selects on single click and opens on double click, Enter/Space or tap. */
function IconButton({
  elementId,
  icon,
  art,
  label,
  selected,
  variant,
  onSelect,
  onOpen,
}: {
  elementId: string;
  icon: IconName;
  /** Custom artwork shown instead of the pixel icon. */
  art?: ReactNode;
  label: string;
  selected: boolean;
  variant: "finder" | "desktop" | "list";
  onSelect: () => void;
  onOpen: () => void;
}) {
  const touch = useRef(false);
  return (
    <button
      type="button"
      id={elementId}
      className={`${styles.icon} ${styles[`icon-${variant}`]} ${selected ? styles.iconSelected : ""}`}
      aria-haspopup="dialog"
      title={`Open ${label}`}
      onPointerDown={(event) => {
        touch.current = event.pointerType !== "mouse";
      }}
      onClick={(event) => {
        // detail === 0 means the click came from the keyboard (Enter / Space).
        if (event.detail === 0 || touch.current) onOpen();
        else onSelect();
      }}
      onDoubleClick={onOpen}
    >
      {art ?? <PixelIcon name={icon} size={variant === "list" ? 16 : variant === "desktop" ? 48 : 64} />}
      <span className={styles.iconLabel}>{label}</span>
    </button>
  );
}

export default function Desktop() {
  const [windows, dispatch] = useReducer(reducer, [fresh("finder"), fresh("profile")]);
  const [selected, setSelected] = useState<string | null>("profile");
  const [view, setView] = useState<"icons" | "list">("icons");
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | undefined>(undefined);
  const clock = useClock();

  const active = windows[windows.length - 1]?.id ?? null;
  const { contact } = cv;

  /** Element ids to try focusing (in order) once the next window change has rendered. */
  const pendingFocus = useRef<string[] | null>(null);

  function open(id: WindowId) {
    pendingFocus.current = [`window-${id}`];
    dispatch({ type: "open", id });
    if (isSectionId(id)) noteSectionOpened(id);
  }

  function close(id: WindowId) {
    // Hand focus back to something sensible: the icon that opened it, else the Portfolio menu.
    pendingFocus.current = [`finder-icon-${id}`, `desktop-icon-${id}`, "menu-trigger-portfolio"];
    dispatch({ type: "close", id });
  }

  useEffect(() => {
    const ids = pendingFocus.current;
    pendingFocus.current = null;
    const target = ids?.map((id) => document.getElementById(id)).find(Boolean);
    target?.focus({ preventScroll: true });
  }, [windows]);

  function announce(message: string) {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3000);
  }

  function copyEmail() {
    navigator.clipboard
      ?.writeText(contact.email)
      .then(() => announce("Email address copied"))
      .catch(() => announce(contact.email));
  }

  // Deep links such as /#projects open the matching window.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      if (isSectionId(hash) && window.matchMedia("(min-width: 768px)").matches) {
        dispatch({ type: "open", id: hash });
        setSelected(hash);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  // The "Are you impressed?" pop-up can ask for a section (Contact) to be opened.
  useEffect(
    () =>
      onOpenSectionRequest((id) => {
        if (!window.matchMedia("(min-width: 768px)").matches) return;
        pendingFocus.current = [`window-${id}`];
        dispatch({ type: "open", id });
      }),
    [],
  );

  const downloadCv: MenuItem = { kind: "link", label: "Download CV", href: contact.cvFile, download: contact.cvFileName };
  const sep: MenuItem = { kind: "separator" };
  const selectedWindow = selected === "hd" ? "finder" : (selected as WindowId | null);

  const menus: Menu[] = [
    {
      id: "ps",
      label: "Phathu OS",
      icon: <PsLogo height={20} />,
      items: [
        { label: "About Phathu OS 9…", onSelect: () => open("about") },
        sep,
        { label: "Phathu OS Help", onSelect: () => open("help") },
      ],
    },
    {
      id: "portfolio",
      label: "Portfolio",
      bold: true,
      items: [
        ...sections.map((section): MenuItem => ({ label: section.label, onSelect: () => open(section.id) })),
        sep,
        { label: TITLES.social, onSelect: () => open("social") },
        downloadCv,
      ],
    },
    {
      id: "file",
      label: "File",
      items: [
        {
          label: selectedWindow ? `Open ${selected === "hd" ? "PHATHU HD" : titleOf(selectedWindow)}` : "Open",
          disabled: !selectedWindow,
          onSelect: () => selectedWindow && open(selectedWindow),
        },
        { label: "Close Window", disabled: !active, onSelect: () => active && close(active) },
        sep,
        downloadCv,
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        { label: "Undo", disabled: true, onSelect: () => {} },
        sep,
        { label: "Cut", disabled: true, onSelect: () => {} },
        { label: "Copy", disabled: true, onSelect: () => {} },
        { label: "Paste", disabled: true, onSelect: () => {} },
        sep,
        { label: "Copy Email Address", onSelect: copyEmail },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { label: "as Icons", checked: view === "icons", onSelect: () => setView("icons") },
        { label: "as List", checked: view === "list", onSelect: () => setView("list") },
      ],
    },
    {
      id: "special",
      label: "Special",
      items: [
        { label: "Clean Up Windows", disabled: windows.length === 0, onSelect: () => dispatch({ type: "cleanUp" }) },
        { label: "Empty Trash…", disabled: true, onSelect: () => {} },
        sep,
        { label: "Restart", onSelect: restartBoot },
      ],
    },
    {
      id: "window",
      label: "Window",
      items: [
        {
          label: windows.find((w) => w.id === active)?.collapsed ? "Expand Window" : "Minimize Window",
          disabled: !active,
          onSelect: () => active && dispatch({ type: "collapse", id: active }),
        },
        { label: "Close All", disabled: windows.length === 0, onSelect: () => dispatch({ type: "closeAll" }) },
        sep,
        ...(windows.length === 0
          ? [{ label: "No open windows", disabled: true, onSelect: () => {} } satisfies MenuItem]
          : [...windows]
              .sort((a, b) => titleOf(a.id).localeCompare(titleOf(b.id)))
              .map((w): MenuItem => ({ label: titleOf(w.id), checked: w.id === active, onSelect: () => open(w.id) }))),
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [
        { label: "Phathu OS Help", onSelect: () => open("help") },
        { label: "About Phathu OS 9…", onSelect: () => open("about") },
      ],
    },
  ];

  function body(id: WindowId): ReactNode {
    if (isSectionId(id)) return <SectionContent id={id} />;
    switch (id) {
      case "finder":
        return view === "icons" ? (
          <ul className={styles.finderGrid}>
            {sections.map((section) => (
              <li key={section.id}>
                <IconButton
                  elementId={`finder-icon-${section.id}`}
                  icon={section.id}
                  label={section.label}
                  variant="finder"
                  selected={selected === section.id}
                  onSelect={() => setSelected(section.id)}
                  onOpen={() => {
                    setSelected(section.id);
                    open(section.id);
                  }}
                />
              </li>
            ))}
            <li>
              <IconButton
                elementId="finder-icon-about"
                icon="help"
                art={<SpinningLogo className={styles.spinIcon} />}
                label={TITLES.about}
                variant="finder"
                selected={selected === "about"}
                onSelect={() => setSelected("about")}
                onOpen={() => {
                  setSelected("about");
                  open("about");
                }}
              />
            </li>
          </ul>
        ) : (
          <table className={styles.finderList}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Kind</th>
                <th scope="col">About</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id} className={selected === section.id ? styles.rowSelected : undefined}>
                  <td>
                    <IconButton
                      elementId={`finder-icon-${section.id}`}
                      icon={section.id}
                      label={section.label}
                      variant="list"
                      selected={selected === section.id}
                      onSelect={() => setSelected(section.id)}
                      onOpen={() => {
                        setSelected(section.id);
                        open(section.id);
                      }}
                    />
                  </td>
                  <td>CV application</td>
                  <td>{section.summary}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <IconButton
                    elementId="finder-icon-about"
                    icon="help"
                    art={<PsLogo height={16} />}
                    label={TITLES.about}
                    variant="list"
                    selected={selected === "about"}
                    onSelect={() => setSelected("about")}
                    onOpen={() => {
                      setSelected("about");
                      open("about");
                    }}
                  />
                </td>
                <td>Read me</td>
                <td>How and why this site was made</td>
              </tr>
            </tbody>
          </table>
        );
      case "about":
        return (
          <div className={styles.about}>
            <PsLogo height={98} alt="PS logo" />
            <div className={contentStyles.content}>
              <h3 className={contentStyles.name}>Phathu OS 9</h3>
              <p>
                The CV portfolio of {cv.identity.name} — {cv.identity.title}, {cv.identity.location}.
              </p>
              <AboutText />
              <p>Built with Next.js, React and TypeScript. All icons and artwork are original pixel art.</p>
              <p>
                <a className={contentStyles.button} href={contact.cvFile} download={contact.cvFileName}>
                  Download CV (PDF)
                </a>
              </p>
            </div>
          </div>
        );
      case "help":
        return (
          <div className={contentStyles.content}>
            <h3 className={contentStyles.heading} style={{ marginTop: 0 }}>
              Using Phathu OS
            </h3>
            <ul className={contentStyles.bullets}>
              <li>Click an icon to select it. Double-click it to open its window.</li>
              <li>Every CV section is also listed in the Portfolio menu.</li>
              <li>Drag a window by its title bar. Click any window to bring it to the front.</li>
              <li>The box on the left of a title bar closes the window; the boxes on the right zoom and minimize it.</li>
            </ul>
            <h3 className={contentStyles.heading}>Keyboard</h3>
            <ul className={contentStyles.bullets}>
              <li>Tab moves between icons, menus and windows.</li>
              <li>Enter or Space opens the focused icon or menu.</li>
              <li>Arrow keys move through menus.</li>
              <li>Escape closes the focused window or menu.</li>
              <li>Alt + arrow keys move the focused window.</li>
            </ul>
          </div>
        );
      case "social":
        return <SocialLinks />;
      case "trash":
        return (
          <div className={`${contentStyles.content} ${contentStyles.empty}`}>
            <PixelIcon name="trash" size={64} />
            <p>
              <strong>The Trash is empty.</strong>
            </p>
            <p>Nothing on this CV deserves to be thrown away.</p>
          </div>
        );
    }
  }

  const finderToolbar = (
    <div className={styles.finderBar}>
      <div className={styles.viewToggle} role="group" aria-label="View options">
        <button type="button" aria-pressed={view === "icons"} onClick={() => setView("icons")}>
          <svg width="20" height="14" viewBox="0 0 20 14" shapeRendering="crispEdges" aria-hidden="true">
            <path d="M3 1h6v5H3zM11 1h6v5h-6zM3 8h6v5H3zM11 8h6v5h-6z" fill="none" stroke="currentColor" />
          </svg>
          <span className="sr-only">View as icons</span>
        </button>
        <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
          <svg width="20" height="14" viewBox="0 0 20 14" shapeRendering="crispEdges" aria-hidden="true">
            <path d="M2 3h2M2 7h2M2 11h2M6 3h12M6 7h12M6 11h12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="sr-only">View as list</span>
        </button>
      </div>
      <p className={styles.finderInfo}>{sections.length + 1} items, 5.6 MB available</p>
    </div>
  );

  return (
    <div className={styles.desktop}>
      <MenuBar menus={menus} />

      <div
        className={styles.surface}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        <p className={styles.osTag} role="status">
          {notice || "PHATHU OS 9"}
        </p>

        <ul className={styles.desktopIcons}>
          <li>
            <IconButton
              elementId="desktop-icon-finder"
              icon="drive"
              label="PHATHU HD"
              variant="desktop"
              selected={selected === "hd"}
              onSelect={() => setSelected("hd")}
              onOpen={() => {
                setSelected("hd");
                open("finder");
              }}
            />
          </li>
          <li>
            <IconButton
              elementId="desktop-icon-social"
              icon="social"
              label={TITLES.social}
              variant="desktop"
              selected={selected === "social"}
              onSelect={() => setSelected("social")}
              onOpen={() => {
                setSelected("social");
                open("social");
              }}
            />
          </li>
          <li>
            <IconButton
              elementId="desktop-icon-trash"
              icon="trash"
              label="Trash"
              variant="desktop"
              selected={selected === "trash"}
              onSelect={() => setSelected("trash")}
              onOpen={() => {
                setSelected("trash");
                open("trash");
              }}
            />
          </li>
        </ul>

        {windows.map((w, index) => (
          <Window
            key={w.id}
            id={w.id}
            title={titleOf(w.id)}
            active={w.id === active}
            collapsed={w.collapsed}
            zoomed={w.zoomed}
            position={w.position}
            zIndex={10 + index}
            className={`${PLACEMENT[w.id]} ${w.id === "finder" ? styles.finderWindow : ""}`}
            toolbar={w.id === "finder" ? finderToolbar : undefined}
            onFocus={() => dispatch({ type: "focus", id: w.id })}
            onClose={() => close(w.id)}
            onCollapse={() => dispatch({ type: "collapse", id: w.id })}
            onZoom={() => dispatch({ type: "zoom", id: w.id })}
            onMove={(position) => dispatch({ type: "move", id: w.id, position })}
          >
            {body(w.id)}
          </Window>
        ))}

        <aside className={styles.controlStrip} aria-label="Control strip">
          <span className={styles.stripCell} aria-hidden="true">
            <svg width="44" height="16" viewBox="0 0 44 16" shapeRendering="crispEdges">
              <path d="M2 6h4l5-4v12l-5-4H2z" fill="#000" />
              <path d="M14 5v6M17 3v10" stroke="#000" strokeWidth="1" fill="none" />
              <path d="M23 11h3v3h-3zM28 9h3v5h-3zM33 7h3v7h-3zM38 4h3v10h-3z" fill="#fff" stroke="#000" />
            </svg>
          </span>
          <time className={styles.stripCell} dateTime={clock.iso} suppressHydrationWarning>
            {clock.time}
          </time>
          <span className={styles.stripCell} aria-hidden="true">
            <svg width="20" height="18" viewBox="0 0 20 18" shapeRendering="crispEdges">
              <path d="M2 1h16v11H2z" fill="#fff" stroke="#000" strokeWidth="2" />
              <path d="M5 4h10v5H5z" fill="#6b74e0" />
              <path d="M7 14h6v2H7zM4 16h12v2H4z" fill="#000" />
            </svg>
          </span>
          <span className={styles.stripCell}>
            <span className={styles.online}>ONLINE</span>
          </span>
          <a className={`${styles.stripCell} ${styles.stripLink}`} href={contact.cvFile} download={contact.cvFileName}>
            Download CV
          </a>
        </aside>
      </div>
    </div>
  );
}
