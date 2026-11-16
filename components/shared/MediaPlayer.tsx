"use client";

import { track } from "@/data/media";
import { formatTime, media, useMedia } from "./mediaStore";
import styles from "./MediaPlayer.module.css";

/* Transport symbols are drawn as shapes: the text characters turn into colour emoji on phones. */
const SHAPES = {
  play: "M3 1v14l12-7z",
  pause: "M3 2h4v12H3zM9 2h4v12H9z",
  stop: "M3 3h10v10H3z",
  repeat: "M2 7V4h9V1l4 4-4 4V6H4v1zM14 9v3H5v3l-4-4 4-4v3h7V9z",
  speaker: "M1 6h3l4-4v12l-4-4H1z",
  waves: "M10 5v6M12 3v10M14 1v14",
  cross: "M10 5l5 6M15 5l-5 6",
};

/** The Media Player controls, shared by the desktop window and the mobile app. */
export default function MediaPlayer() {
  const { playing, time, duration, volume, muted, repeat, error } = useMedia();
  const status = error ? "Could not load the track" : playing ? "Now playing" : time > 0 ? "Paused" : "Ready";

  return (
    <div className={styles.player} role="group" aria-label="Media Player">
      <div className={styles.display}>
        <p className={styles.status} role="status">
          {status}
        </p>
        <p className={styles.title}>{track.title}</p>
        <p className={styles.credit}>{track.credit}</p>
        <div className={styles.meter}>
          <span className={`${styles.bars} ${playing ? styles.barsOn : ""}`} aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${-((i * 370) % 900)}ms` }} />
            ))}
          </span>
          <span className={styles.clock}>
            {formatTime(time)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      <input
        className={styles.range}
        type="range"
        aria-label="Position in track"
        aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
        min={0}
        max={Math.floor(duration)}
        step={1}
        value={Math.floor(time)}
        onChange={(event) => media.seek(Number(event.target.value))}
      />

      <div className={styles.controls}>
        <button type="button" className={styles.key} onClick={media.stop} disabled={!playing && time === 0}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d={SHAPES.stop} fill="currentColor" />
          </svg>
          <span className="sr-only">Stop</span>
        </button>
        <button type="button" className={`${styles.key} ${styles.keyMain}`} onClick={media.toggle}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d={playing ? SHAPES.pause : SHAPES.play} fill="currentColor" />
          </svg>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className={styles.key} aria-pressed={repeat} onClick={media.toggleRepeat}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d={SHAPES.repeat} fill="currentColor" />
          </svg>
          <span className="sr-only">Repeat</span>
        </button>
        <button type="button" className={styles.key} aria-pressed={muted} onClick={media.toggleMute}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d={SHAPES.speaker} fill="currentColor" />
            <path d={muted ? SHAPES.cross : SHAPES.waves} stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="sr-only">Mute</span>
        </button>
        {/* Phones set the volume with their own buttons, so the slider is desktop-only (see the CSS). */}
        <input
          className={`${styles.range} ${styles.volume}`}
          type="range"
          aria-label="Volume"
          min={0}
          max={100}
          step={5}
          value={muted ? 0 : Math.round(volume * 100)}
          onChange={(event) => media.setVolume(Number(event.target.value) / 100)}
        />
      </div>

      <p className={styles.hint}>The music keeps playing while you browse the rest of the site.</p>
    </div>
  );
}
