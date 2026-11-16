"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useClock } from "@/components/shared/useClock";
import styles from "./Desktop.module.css";

export type MenuItem =
  | { kind: "separator" }
  | {
      kind?: "action";
      label: string;
      onSelect: () => void;
      disabled?: boolean;
      checked?: boolean;
    }
  | { kind: "link"; label: string; href: string; download?: string };

export interface Menu {
  id: string;
  label: string;
  /** Replaces the text label visually (used for the PS logo menu). */
  icon?: ReactNode;
  bold?: boolean;
  items: MenuItem[];
}

export default function MenuBar({ menus }: { menus: Menu[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const barRef = useRef<HTMLElement>(null);
  /** Which item to focus once the menu that is opening has rendered. */
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const clock = useClock();

  // Close when clicking or focusing anywhere outside the menu bar.
  useEffect(() => {
    if (!openId) return;
    const onOutside = (event: Event) => {
      if (!barRef.current?.contains(event.target as Node)) setOpenId(null);
    };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
    };
  }, [openId]);

  const trigger = (id: string) => barRef.current?.querySelector<HTMLElement>(`[data-menu-trigger="${id}"]`);
  const itemsOf = (id: string) =>
    Array.from(
      barRef.current?.querySelectorAll<HTMLElement>(`[data-menu="${id}"] [role^="menuitem"]:not([aria-disabled="true"])`) ??
        [],
    );

  function open(id: string, focus: "first" | "last" | null = null) {
    pendingFocus.current = focus;
    setOpenId(id);
  }

  // Keyboard-opened menus move focus to their first (or last) item after rendering.
  useEffect(() => {
    const focus = pendingFocus.current;
    pendingFocus.current = null;
    if (!openId || !focus) return;
    const items = Array.from(
      barRef.current?.querySelectorAll<HTMLElement>(
        `[data-menu="${openId}"] [role^="menuitem"]:not([aria-disabled="true"])`,
      ) ?? [],
    );
    (focus === "first" ? items[0] : items[items.length - 1])?.focus();
  }, [openId]);

  function close(returnFocus: boolean) {
    if (returnFocus && openId) trigger(openId)?.focus();
    setOpenId(null);
  }

  function sibling(id: string, delta: number) {
    const index = menus.findIndex((menu) => menu.id === id);
    return menus[(index + delta + menus.length) % menus.length].id;
  }

  function onTriggerKeyDown(event: KeyboardEvent, id: string) {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        open(id, "first");
        break;
      case "ArrowUp":
        event.preventDefault();
        open(id, "last");
        break;
      case "ArrowRight":
      case "ArrowLeft": {
        event.preventDefault();
        const next = sibling(id, event.key === "ArrowRight" ? 1 : -1);
        trigger(next)?.focus();
        if (openId) setOpenId(next);
        break;
      }
      case "Escape":
        if (openId) {
          event.preventDefault();
          close(true);
        }
        break;
    }
  }

  function onMenuKeyDown(event: KeyboardEvent, id: string) {
    const items = itemsOf(id);
    const index = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "ArrowRight":
      case "ArrowLeft":
        event.preventDefault();
        open(sibling(id, event.key === "ArrowRight" ? 1 : -1), "first");
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  }

  return (
    <header className={styles.menuBar} ref={barRef}>
      <nav aria-label="Phathu OS menu bar">
        <ul className={styles.menuList}>
          {menus.map((menu) => {
            const isOpen = openId === menu.id;
            return (
              <li key={menu.id} className={styles.menuRoot}>
                <button
                  type="button"
                  className={`${styles.menuTrigger} ${menu.bold ? styles.menuTriggerBold : ""}`}
                  id={`menu-trigger-${menu.id}`}
                  data-menu-trigger={menu.id}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  aria-label={menu.icon ? menu.label : undefined}
                  onClick={() => (isOpen ? close(false) : open(menu.id))}
                  onPointerEnter={() => {
                    if (openId && !isOpen) open(menu.id);
                  }}
                  onKeyDown={(event) => onTriggerKeyDown(event, menu.id)}
                >
                  {menu.icon ?? menu.label}
                </button>
                {isOpen && (
                  <ul
                    className={styles.menu}
                    role="menu"
                    aria-label={menu.label}
                    data-menu={menu.id}
                    onKeyDown={(event) => onMenuKeyDown(event, menu.id)}
                  >
                    {menu.items.map((item, index) => {
                      if (item.kind === "separator") {
                        return <li key={`sep-${index}`} role="separator" className={styles.menuSeparator} />;
                      }
                      if (item.kind === "link") {
                        return (
                          <li key={item.label} role="none">
                            <a
                              role="menuitem"
                              className={styles.menuItem}
                              href={item.href}
                              download={item.download}
                              tabIndex={-1}
                              onClick={() => close(false)}
                            >
                              <span className={styles.menuCheck} aria-hidden="true" />
                              {item.label}
                            </a>
                          </li>
                        );
                      }
                      const checkable = item.checked !== undefined;
                      return (
                        <li key={item.label} role="none">
                          <button
                            type="button"
                            role={checkable ? "menuitemradio" : "menuitem"}
                            aria-checked={checkable ? item.checked : undefined}
                            aria-disabled={item.disabled || undefined}
                            className={styles.menuItem}
                            tabIndex={-1}
                            onClick={() => {
                              if (item.disabled) return;
                              close(false);
                              item.onSelect();
                            }}
                          >
                            <span className={styles.menuCheck} aria-hidden="true">
                              {item.checked ? "✓\uFE0E" : ""}
                            </span>
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <time className={styles.menuClock} dateTime={clock.iso} suppressHydrationWarning>
        <span>{clock.date}</span>
        <span>{clock.time}</span>
      </time>
    </header>
  );
}
