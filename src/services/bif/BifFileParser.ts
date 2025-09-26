import { BifFrameImageSource } from './BifFrameImageSource';
import { FrameImageOffset } from './FrameImageOffset';
import { FrameImageSource } from './FrameImageSource';

/**
 * Parses a valid Roku BIF File (http://sdkdocs.roku.com/display/sdkdoc/BIF+File+Specification) into a FrameImageSource
 * used by clients to render JPEG frame images.
 */
class BifParser {
  private static readonly FRAME_ENTRY_SIZE_BYTES = 8;
  private static readonly UINT32_SIZE_BYTES = 4;

  /**
   * Parses a given BIF file into a FrameImageSource. Returns null if unable to parse BIF file.
   *
   * @param buffer {ArrayBuffer} A valid ArrayBuffer containing the complete BIF file.
   * @returns {FrameImageSource}
   */
  parse(buffer: ArrayBuffer): FrameImageSource | null {
    const dataView = new DataView(buffer);
    if (!this.isValidBif(dataView)) {
      console.error('Unable to parse invalid BIF file.');
      return null;
    }

    try {
      const numberOfImages = dataView.getUint32(12, true);

      // This multiplier is used to get the true timestamp of a frame. Zero === 1000ms.
      let timestampMultiplier = dataView.getUint32(16, true);
      timestampMultiplier =
        timestampMultiplier === 0 ? 1000 : timestampMultiplier;

      console.info(
        `Parsing BIF with ${numberOfImages} images and a timestamp multiplier of ${timestampMultiplier}`,
      );

      // Frames start at byte 64, with each frame containing two 32bit integers: timestamp, offset.
      const frameImages: FrameImageOffset[] = [];
      let indexOffset = 64;
      for (let i = 1; i <= numberOfImages; i++) {
        const positionMillis =
          dataView.getUint32(indexOffset, true) * timestampMultiplier;
        const frameOffset = dataView.getUint32(
          indexOffset + BifParser.UINT32_SIZE_BYTES,
          true,
        );

        frameImages.push({
          positionMillis: positionMillis,
          offsetBytes: frameOffset,
        });

        indexOffset += BifParser.FRAME_ENTRY_SIZE_BYTES;
      }

      const finalEntry = dataView.getUint32(indexOffset, true);
      if (finalEntry !== 0xffffffff) {
        console.warn(
          'Missing final entry indicator, there may be missing frames.',
        );
      }

      // This final entry includes the necessary information needed to load the last frame.
      frameImages.push({
        positionMillis: Number.MAX_VALUE,
        offsetBytes: dataView.getUint32(
          indexOffset + BifParser.UINT32_SIZE_BYTES,
          true,
        ),
      });

      const bifFrameImageSource = new BifFrameImageSource(buffer, frameImages);

      return bifFrameImageSource;
    } catch (e) {
      console.error('Unable to parse BIF file due to fatal error.', e);
      return null;
    }
  }

  /**
   * Verify if it's a valid BIF
   * For magic number, please see: https://developer.roku.com/docs/developer-program/media-playback/trick-mode/bif-file-creation.md#TrickModeSupport-BIFFileCreationusingtheRokuBIFTool
   * @param dataView
   * @returns
   */
  private isValidBif(dataView: DataView): boolean {
    const magicNumber = [0x89, 0x42, 0x49, 0x46, 0x0d, 0x0a, 0x1a, 0x0a];
    for (let offset = 0; offset < magicNumber.length; offset++) {
      const num = dataView.getUint8(offset);
      if (num !== magicNumber[offset]) {
        return false;
      }
    }

    // The only BIF version is currently zero.
    const version = dataView.getUint32(8, true);
    return version === 0;
  }
}

export { BifParser };
