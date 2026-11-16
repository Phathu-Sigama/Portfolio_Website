/** The track played by the Media Player (desktop window and mobile app). */
export interface Track {
  title: string;
  /** Shown under the title. */
  credit: string;
  src: string;
  /** Length in seconds, so the player can show it before the file has been downloaded. */
  seconds: number;
}

export const track: Track = {
  title: "A Dime A Dozen",
  credit: "Alchemist x Westside Gunn type beat",
  src: "/audio/a-dime-a-dozen.mp3",
  seconds: 170,
};
