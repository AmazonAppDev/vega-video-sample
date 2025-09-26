import { values } from 'underscore';

import * as base64 from 'base-64';
import { FrameImageOffset } from './FrameImageOffset';
import { FrameImageSource } from './FrameImageSource';

/**
 * A FrameImageSource backed by a BIF file.
 *
 * Lazy-loads requested images, caching them for subsequent use.
 */
class BifFrameImageSource implements FrameImageSource {
  // Set in constructor.
  private bifFile: ArrayBuffer;
  private imageOffsets: FrameImageOffset[] = [];
  private base64Images: string[] = [];

  // Internal state.
  private imageUrlMap: { [index: number]: string } = {};

  /**
   * Create a new BifFrameImageSource with the given ArrayBuffer and imageOffsets. It is expected that all image offsets
   * be contained within the BIF.
   *
   * @param bifFile {ArrayBuffer} A complete BIF file
   * @param imageOffsets {FrameImageOffset[]} A sorted list of FrameImageOffsets
   */
  constructor(bifFile: ArrayBuffer, imageOffsets: FrameImageOffset[]) {
    this.bifFile = bifFile;
    this.imageOffsets = imageOffsets;
  }

  /**
   * Destroys all cached ObjectURLS, as they are not cleaned up by garbage collection.
   */
  clearCache() {
    values(this.imageUrlMap).forEach((imageUrl: string) => {
      URL.revokeObjectURL(imageUrl);
    });

    this.base64Images.length = 0;
  }

  /**
   * Gets the Uint8Array for the frame image associated with the given position in milliseconds.
   *
   * @param positionMillis {number} The position an image is requested for, in milliseconds.
   * @returns {Uint8Array} The array containing the data for the trickplay image or null if the frame images are empty.
   */
  getImageData(positionMillis: number): Uint8Array | null {
    // BifParser will always add a final entry, so need to check for at least length 2.
    if (this.imageOffsets.length < 2) {
      console.warn('Attemped to get the image array from empty frame images.');
      return null;
    }

    const endIndex = this.getEndIndex(positionMillis);
    const startIndex = endIndex - 1;
    const startOffset = this.imageOffsets[startIndex].offsetBytes;
    const endOffset = this.imageOffsets[endIndex].offsetBytes;

    return new Uint8Array(this.bifFile, startOffset, endOffset - startOffset);
  }

  /**
   * Get Uint8Array based on the image frame associated and transform this in a base64 image that can be used in the trickplay
   * @param positionMillis {number} The position an image is requested for, in milliseconds.
   * @returns The string containing the base 64 image data for the trickplay image or null if the frame images are empty.
   */
  getBase64Image(positionMillis: number): string | null {
    const trickplayImageData = this.getImageData(positionMillis);

    if (trickplayImageData === null) {
      return null;
    }

    const utf8string = String.fromCharCode(...trickplayImageData);
    const base64String: string = base64.encode(utf8string);
    const base64URL: string = 'data:image/jpeg;base64,' + base64String;
    return base64URL;
  }

  /**
   * Calculates the frame index for trickplay images based on a timestamp.
   *
   * @param positionMillis - Timestamp position in milliseconds
   * @returns Frame index for accessing trickplay image data
   *
   * @description
   * Converts a millisecond timestamp to a frame index using the following logic:
   * 1. Returns index 1 for timestamp 0
   * 2. For other timestamps:
   *    - Converts milliseconds to seconds (÷ 1000)
   *    - Maps to frame intervals (÷ 10, as frames are captured every 10 seconds)
   *    - Rounds up and adds 1 for 1-based indexing
   *
   * @example
   * For timestamp 26:30 (1,590,000 ms):
   * 1,590,000 ms → 1,590 seconds → 159 frames → index 160
   */
  private getEndIndex(positionMillis: number): number {
    const SECOND_IN_MILIS = 1000;

    //Get first position of the array if the position in miliseconds is 0
    if (positionMillis === 0) {
      return 1;
    }

    //Divided ÷ 10 to get the position based on the seconds
    //Example Minute 26:30 -> 1,590,000 ms / 1000 ms = 1,590 -> 1,590 / 10 -> 159 + 1 = frame 160
    const position = Math.ceil(positionMillis / SECOND_IN_MILIS / 10) + 1;
    return position;
  }
}

export { BifFrameImageSource };
