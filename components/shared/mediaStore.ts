"use client";

import { useSyncExternalStore } from "react";
import { track } from "@/data/media";

/**
 * One audio element for the whole site, kept outside React.
 * Because no window or app owns it, the music keeps playing while the visitor
 * opens, closes and scrolls through anything else.
 */
export interface MediaState {
  playing: boolean;
  /** Seconds played. */
  time: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeat: boolean;
  error: boolean;
}

const initial: MediaState = {
  playing: false,
  time: 0,
  duration: track.seconds,
  volume: 0.8,
  muted: false,
  repeat: false,
  error: false,
};

let state = initial;
let audio: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();

function set(patch: Partial<MediaState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

/** Created on first use, so the track is only downloaded once the visitor presses Play. */
function element(): HTMLAudioElement {
  if (audio) return audio;
  const el = new Audio();
  el.preload = "none";
  el.src = track.src;
  el.volume = state.volume;
  el.loop = state.repeat;

  el.addEventListener("play", () => set({ playing: true, error: false }));
  el.addEventListener("pause", () => set({ playing: false }));
  el.addEventListener("ended", () => set({ playing: false, time: 0 }));
  el.addEventListener("timeupdate", () => set({ time: el.currentTime }));
  el.addEventListener("durationchange", () => {
    if (Number.isFinite(el.duration) && el.duration > 0) set({ duration: el.duration });
  });
  el.addEventListener("volumechange", () => set({ volume: el.volume, muted: el.muted }));
  el.addEventListener("error", () => set({ playing: false, error: true }));

  // Lock-screen and headphone controls.
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.credit,
      album: "Phathu OS",
      artwork: [{ src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    });
    navigator.mediaSession.setActionHandler("play", () => media.play());
    navigator.mediaSession.setActionHandler("pause", () => media.pause());
    navigator.mediaSession.setActionHandler("stop", () => media.stop());
  }

  audio = el;
  return el;
}

export const media = {
  play() {
    element()
      .play()
      .catch((error: unknown) => {
        // AbortError just means Pause was pressed before playback started.
        if ((error as DOMException)?.name !== "AbortError") set({ playing: false, error: true });
      });
  },
  pause() {
    audio?.pause();
  },
  toggle() {
    if (state.playing) media.pause();
    else media.play();
  },
  stop() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    set({ time: 0 });
  },
  seek(seconds: number) {
    const el = element();
    const time = Math.min(Math.max(seconds, 0), state.duration);
    el.currentTime = time;
    set({ time });
  },
  setVolume(volume: number) {
    const el = element();
    el.muted = false;
    el.volume = Math.min(Math.max(volume, 0), 1);
  },
  toggleMute() {
    const el = element();
    el.muted = !el.muted;
  },
  toggleRepeat() {
    const repeat = !state.repeat;
    element().loop = repeat;
    set({ repeat });
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getState = () => state;
const getServerState = () => initial;

export function useMedia(): MediaState {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

/** "2:50" */
export function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
