import { socials } from "@/data/cv";
import PixelIcon, { type IconName } from "./PixelIcon";
import styles from "./SectionContent.module.css";

/* Original pixel icons rather than the networks' own logos. */
const ICONS: Record<(typeof socials)[number]["id"], IconName> = {
  linkedin: "idcard",
  github: "server",
};

/** The Social Media list from data/cv.ts, shared by the desktop window and the mobile app. */
export default function SocialLinks() {
  return (
    <div className={styles.content}>
      <ul className={styles.socialList}>
        {socials.map((social) => {
          const inner = (
            <>
              <PixelIcon name={ICONS[social.id]} size={40} />
              <span className={styles.socialText}>
                <span className={styles.socialName}>{social.label}</span>
                <span className={styles.socialHandle}>
                  {social.href ? social.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : "Not linked yet"}
                </span>
              </span>
            </>
          );
          return (
            <li key={social.id}>
              {social.href ? (
                <a className={styles.socialRow} href={social.href} target="_blank" rel="noopener noreferrer">
                  {inner}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <div className={`${styles.socialRow} ${styles.socialRowEmpty}`}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
