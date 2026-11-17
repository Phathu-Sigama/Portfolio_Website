"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./WorldClocks.module.css";

interface City {
  name: string;
  /** IANA time zone. */
  zone: string;
}

const DEFAULT_CITIES: City[] = [
  { name: "Cape Town", zone: "Africa/Johannesburg" },
  { name: "London", zone: "Europe/London" },
  { name: "New York", zone: "America/New_York" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
];

const MORE_CITIES: City[] = [
  { name: "Amsterdam", zone: "Europe/Amsterdam" },
  { name: "Auckland", zone: "Pacific/Auckland" },
  { name: "Berlin", zone: "Europe/Berlin" },
  { name: "Cairo", zone: "Africa/Cairo" },
  { name: "Chicago", zone: "America/Chicago" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "Hong Kong", zone: "Asia/Hong_Kong" },
  { name: "Lagos", zone: "Africa/Lagos" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "Mumbai", zone: "Asia/Kolkata" },
  { name: "Nairobi", zone: "Africa/Nairobi" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "São Paulo", zone: "America/Sao_Paulo" },
  { name: "Seoul", zone: "Asia/Seoul" },
  { name: "Singapore", zone: "Asia/Singapore" },
  { name: "Toronto", zone: "America/Toronto" },
];

const DAY_START = 6;
const DAY_END = 18;

/** Hour and minute of `date` on the wall clocks of `zone`. */
function wallTime(date: Date, zone: string): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { hour: read("hour"), minute: read("minute") };
}

const pad = (n: number) => String(n).padStart(2, "0");

function formatTime(hour: number, minute: number, h24: boolean): string {
  if (h24) return `${pad(hour)}:${pad(minute)}`;
  return `${hour % 12 === 0 ? 12 : hour % 12}:${pad(minute)} ${hour < 12 ? "AM" : "PM"}`;
}

/* Original pixel icons */
function Glyph({ kind }: { kind: "clock" | "sun" | "moon" | "globe" }) {
  const common = { width: 26, height: 26, viewBox: "0 0 13 13", shapeRendering: "crispEdges" as const, "aria-hidden": true };
  switch (kind) {
    case "clock":
      return (
        <svg {...common}>
          <path d="M4 0h5v1h2v1h1v2h1v5h-1v2h-1v1H9v1H4v-1H2v-1H1V9H0V4h1V2h1V1h2z" fill="#000" />
          <path d="M4 1h5v1h2v2h1v5h-1v2H9v1H4v-1H2V9H1V4h1V2h2z" fill="#fff" />
          <path d="M6 3h1v4H6zM4 7h3v1H4z" fill="#000" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <path d="M6 0h1v2H6zM6 11h1v2H6zM0 6h2v1H0zM11 6h2v1h-2zM2 2h1v1H2zM10 2h1v1h-1zM2 10h1v1H2zM10 10h1v1h-1z" fill="#000" />
          <path d="M5 3h3v1h1v1h1v3H9v1H8v1H5V9H4V8H3V5h1V4h1z" fill="#000" />
          <path d="M5 4h3v1h1v3H8v1H5V8H4V5h1z" fill="#f4e36a" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M3 1h3v1H5v1H4v4h1v2h1v1h3v1h1v1H9v1H4v-1H3v-1H2V9H1V4h1V2h1z" fill="#000" />
          <path d="M3 2h1v1H3zM2 4h2v5H2zM3 9h2v1H3zM4 10h2v1H4zM5 11h4v1H5zM3 3h1v1H3z" fill="#8f96ee" />
          <path d="M9 1h1v1h1v1h-1v1H9V3H8V2h1zM11 6h1v1h-1z" fill="#000" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <path d="M4 0h5v1h2v1h1v2h1v5h-1v2h-1v1H9v1H4v-1H2v-1H1V9H0V4h1V2h1V1h2z" fill="#000" />
          <path d="M4 1h5v1h2v2h1v5h-1v2H9v1H4v-1H2V9H1V4h1V2h2z" fill="#8f96ee" />
          <path d="M6 1h1v11H6zM1 6h11v1H1zM2 3h9v1H2zM2 9h9v1H2zM3 2h1v9H3zM9 2h1v9H9z" fill="#000" />
        </svg>
      );
  }
}

/**
 * The World Clocks panel that opens from the control strip's clock.
 * `epoch` is the current minute (from useClock), so every row ticks over together.
 */
export default function WorldClocks({ epoch, date, onClose }: { epoch: number; date: string; onClose: (returnFocus: boolean) => void }) {
  const [h24, setH24] = useState(true);
  const [added, setAdded] = useState<City[]>([]);
  const [picking, setPicking] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
  }, []);

  // Clicking anywhere else closes the panel (the clock button itself toggles it).
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element;
      if (!panel.current?.contains(target) && !target.closest("[data-world-clock-toggle]")) onClose(false);
    }
    // Escape closes it wherever the focus is, and before any window underneath reacts.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose(true);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [onClose]);

  const now = new Date(epoch);
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const listed = [...DEFAULT_CITIES, ...added];
  // A visitor whose own time zone is not listed gets it as the first row.
  const cities = listed.some((city) => city.zone === localZone)
    ? listed
    : [{ name: localZone.split("/").pop()!.replace(/_/g, " "), zone: localZone }, ...listed];
  const firstLocal = cities.findIndex((city) => city.zone === localZone);
  const available = MORE_CITIES.filter((city) => !cities.some((c) => c.name === city.name));

  return (
    <div
      ref={panel}
      className={styles.panel}
      role="dialog"
      aria-label="World clocks"
      tabIndex={-1}
    >
      <header className={styles.titleBar}>
        <span className={styles.globe}>
          <Glyph kind="globe" />
        </span>
        <span className={styles.stripes} aria-hidden="true" />
        <h2 className={styles.title}>World Clocks</h2>
        <span className={styles.stripes} aria-hidden="true" />
        <button type="button" className={styles.close} onClick={() => onClose(true)}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="#000" strokeWidth="2" />
          </svg>
          <span className="sr-only">Close world clocks</span>
        </button>
      </header>

      <div className={styles.dateRow}>
        <p>{date}</p>
        <button type="button" className={styles.button} aria-pressed={h24} onClick={() => setH24((on) => !on)}>
          {h24 ? "24H" : "12H"}
          <span className="sr-only"> — switch to {h24 ? "12-hour" : "24-hour"} time</span>
        </button>
      </div>

      <ul className={styles.rows} style={h24 ? undefined : ({ "--time-w": "6.6em" } as React.CSSProperties)}>
        {cities.map((city, index) => {
          const { hour, minute } = wallTime(now, city.zone);
          const local = index === firstLocal;
          const day = hour >= DAY_START && hour < DAY_END;
          const removable = added.includes(city);
          return (
            <li key={city.name} className={`${styles.row} ${local ? styles.rowLocal : ""}`}>
              <Glyph kind={local ? "clock" : day ? "sun" : "moon"} />
              <span className={styles.city}>{city.name}</span>
              <span className={styles.time}>{formatTime(hour, minute, h24)}</span>
              <span className={styles.tag}>{local ? "Local" : <span className="sr-only">{day ? "Daytime" : "Night"}</span>}</span>
              {/* The city's own day from midnight to midnight: yellow is daylight, the marker is now. */}
              <span className={styles.bar} aria-hidden="true">
                <svg
                  className={styles.marker}
                  style={{ left: `${((hour * 60 + minute) / 1440) * 100}%` }}
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                >
                  <path d="M1 1h12L7 8z" fill="#b4f000" stroke="#000" strokeWidth="1.5" />
                </svg>
              </span>
              {removable ? (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => {
                    setAdded((list) => list.filter((c) => c !== city));
                    panel.current?.focus({ preventScroll: true });
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="sr-only">Remove {city.name}</span>
                </button>
              ) : (
                <span className={styles.removeSpace} />
              )}
            </li>
          );
        })}
      </ul>

      <footer className={styles.footer}>
        {picking ? (
          <select
            className={styles.select}
            aria-label="City to add"
            autoFocus
            defaultValue=""
            onChange={(event) => {
              const city = available.find((c) => c.name === event.target.value);
              if (city) setAdded((list) => [...list, city]);
              setPicking(false);
            }}
            onBlur={() => setPicking(false)}
          >
            <option value="" disabled>
              Choose a city…
            </option>
            {available.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        ) : (
          <button type="button" className={styles.button} disabled={available.length === 0} onClick={() => setPicking(true)}>
            + Add City
          </button>
        )}
      </footer>
      <span className={styles.tail} aria-hidden="true" />
    </div>
  );
}
