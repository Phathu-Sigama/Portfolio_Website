/** The video played by the Media Player (desktop window and mobile app), embedded from YouTube. */
export interface Track {
  title: string;
  /** The creator, shown under the title. */
  credit: string;
  /** YouTube video id: the part after "v=" or "/embed/". */
  videoId: string;
}

export const track: Track = {
  title: "A Dime A Dozen",
  credit: "OldSouly",
  videoId: "QqO6RhmD_U8",
};
