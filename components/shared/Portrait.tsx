/* A small static cut-out photo; next/image optimisation is not needed here. */
/* eslint-disable @next/next/no-img-element */
import { cv } from "@/data/cv";
import styles from "./SectionContent.module.css";

/** Cut-out photo (public/profile.png, transparent background) on a classic halftone backdrop. */
export default function Portrait() {
  return (
    <div className={styles.portrait}>
      <img src="/profile.png" width={144} height={144} alt={`Portrait of ${cv.identity.name}`} />
    </div>
  );
}
