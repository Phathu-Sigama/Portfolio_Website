"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 5000);
  return () => window.clearInterval(timer);
}

const getMinute = () => Math.floor(Date.now() / 60000);
const getServerMinute = () => null;

const pad = (n: number) => String(n).padStart(2, "0");
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface Clock {
  /** "16:52" — or a placeholder of the same width before hydration. */
  time: string;
  /** "Mon 16 Nov" */
  date: string;
  /** Machine-readable value for <time dateTime>. */
  iso: string | undefined;
  /** Start of the current minute in epoch milliseconds; null before hydration. */
  epoch: number | null;
}

/** The visitor's local time, updated every minute. Renders a stable placeholder on the server. */
export function useClock(): Clock {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  if (minute === null) return { time: "--:--", date: "", iso: undefined, epoch: null };
  const d = new Date(minute * 60000);
  return {
    epoch: minute * 60000,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    date: `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`,
    iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}
