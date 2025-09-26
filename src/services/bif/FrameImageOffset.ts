/**
 * The representation of a FrameImage within a binary file.
 */
interface FrameImageOffset {
  /**
   * The position in the video this frame represents.
   */
  positionMillis: number;

  /**
   * The starting offset of the frame in the file source.
   */
  offsetBytes: number;
}

export type { FrameImageOffset };
