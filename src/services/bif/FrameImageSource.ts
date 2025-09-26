/**
 * A source of Frame Images used for the Trickplay feature.
 */
interface FrameImageSource {
  /**
   * Destroys all cached ObjectURLS, as they are not cleaned up by garbage collection.
   */
  clearCache(): void;

  /**
   * Gets the Uint8Array for the frame image associated with the given position in milliseconds.
   *
   * @param positionMillis {number} The position an image is requested for, in milliseconds.
   * @returns {Uint8Array | null} The array containing the data for the trickplay image or null if the frame images are empty.
   */
  getImageData(positionMillis: number): Uint8Array | null;

  /**
   * Gets the base 64 image for the frame image associated with the given position in milliseconds.
   *
   * @param positionMillis {number} The position an image is requested for, in milliseconds.
   * @returns {string | null} The string containing the base 64 image data for the trickplay image or null if the frame images are empty.
   */
  getBase64Image(positionMillis: number): string | null;
}

export type { FrameImageSource };
