import { track } from "@/data/media";
import styles from "./MediaPlayer.module.css";

/**
 * The Media Player: the creator's own YouTube video, embedded rather than re-hosted.
 * youtube-nocookie.com is YouTube's privacy-enhanced player, and nothing is requested
 * from it until the player is first opened.
 *
 * `mini` is the small floating version used on the phone while another app is open.
 * The <iframe> keeps its place in the tree between the two layouts, so switching
 * never reloads the video or interrupts the music.
 */
export default function MediaPlayer({
  hint,
  mini = false,
  onExpand,
  onStop,
}: {
  hint?: string;
  mini?: boolean;
  onExpand?: () => void;
  onStop?: () => void;
}) {
  return (
    <div className={`${styles.player} ${mini ? styles.mini : ""}`}>
      <div className={styles.screen}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${track.videoId}?playsinline=1&rel=0`}
          title={`${track.title} by ${track.credit}`}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {mini ? (
        <div className={styles.miniBar}>
          <button type="button" className={styles.miniOpen} onClick={onExpand}>
            {track.title}
            <span className="sr-only"> — open Media Player</span>
          </button>
          <button type="button" className={styles.miniStop} onClick={onStop}>
            {/* Drawn as a shape: text symbols can turn into colour emoji on phones. */}
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span className="sr-only">Stop and close the player</span>
          </button>
        </div>
      ) : (
        <div className={styles.info}>
          <p className={styles.title}>{track.title}</p>
          <p className={styles.credit}>
            by{" "}
            <a href={`https://www.youtube.com/watch?v=${track.videoId}`} target="_blank" rel="noopener noreferrer">
              {track.credit}
              <span className="sr-only"> on YouTube (opens in a new tab)</span>
            </a>
          </p>
          {hint && <p className={styles.hint}>{hint}</p>}
        </div>
      )}
    </div>
  );
}
