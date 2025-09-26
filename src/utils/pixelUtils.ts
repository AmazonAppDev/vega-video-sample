import { Dimensions, PixelRatio } from 'react-native';

/**
 * The actual dimensions of this device (given in dp)
 */
export const SCREEN_DP = Dimensions.get('window');
/**
 * The Aspect Ratio of this device, ie: 16:9 = 1.78
 */
export const ASPECT_RATIO = SCREEN_DP.width / SCREEN_DP.height;

/**
 * The reference height we'll base our sizes on
 */
const REFERENCE_HEIGHT = 1080;

/**
 * The ration multiplier used to adjust the incoming height
 */
const SCALE_RATIO = SCREEN_DP.height / REFERENCE_HEIGHT;

/**
 * Function to scale a given dimension according to the reference height of 1080
 * @param uxUnit the value provided by UX in units of "the pixel size that it would be if the screen were 1080p"
 * @return the scaled DP value.
 */
export const scaleUxToDp = (uxUnit: number): number =>
  PixelRatio.roundToNearestPixel(uxUnit * SCALE_RATIO);
