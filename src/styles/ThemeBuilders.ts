import { createThemeFromPartialTheme } from '@amazon-devices/kepler-ui-components';
import { scaleUxToDp } from '../utils/pixelUtils';
import { COLORS } from './Colors';

/**
 * Given the suggested card width, compute all the other dimensions for the
 * card including card height, card child image height/width, margins and
 * so on.
 *
 * @param suggestedCardWidthDP Suggested card width. The width would be clipped
 *    to reside between minimum/maximum width supported by the card.
 * @returns
 */
const computeCardDimensionsForCardWidth = (suggestedCardWidthDP: number) => {
  const maxWidth = scaleUxToDp(440);
  const minWidth = scaleUxToDp(320);
  let cardWidth = suggestedCardWidthDP;

  const cardHeightToWidthRatio = 9 / 16; // 16:9

  let cardHeight = cardWidth * cardHeightToWidthRatio;
  if (cardWidth > maxWidth) {
    cardWidth = maxWidth;
  } else if (cardWidth < minWidth) {
    cardWidth = minWidth;
  }

  const maxHeight = maxWidth * cardHeightToWidthRatio;
  const minHeight = minWidth * cardHeightToWidthRatio;
  if (cardHeight > maxHeight) {
    cardHeight = maxHeight;
  } else if (cardHeight < minHeight) {
    cardHeight = minHeight;
  }

  return {
    card: {
      width: cardWidth,
      height: cardHeight,
    },
  };
};

/**
 * Create the theme with given parameters.
 *
 * @param suggestedCardWidthDP Suggested card width. The width would be clipped
 *    to reside between minimum/maximum width supported by the card.
 */
const createThemeWith = (suggestedCardWidthDP: number) => {
  const cardDimensions =
    computeCardDimensionsForCardWidth(suggestedCardWidthDP);
  console.log('cardDimensions', cardDimensions);

  return createThemeFromPartialTheme({
    card: {
      container: {
        size: {
          width: {
            vertical: {
              md: cardDimensions.card.width,
            },
          },
          height: {
            vertical: {
              md: cardDimensions.card.height,
            },
          },
          borderRadius: {
            sm: 8,
            md: 8,
            lg: 8,
            xl: 8,
          },
        },
        color: {
          borderColor: {
            focused: COLORS.ORANGE,
            pressed: COLORS.ORANGE,
          },
        },
      },
      image: {
        size: {
          margin: 0,
          borderRadius: {
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
          width: {
            vertical: {
              md: cardDimensions.card.width,
            },
          },
          height: {
            vertical: {
              md: cardDimensions.card.height,
            },
          },
        },
      },
    },

    typography: {
      text: {
        color: {
          display: COLORS.PALE_BLUE_WHITE,
          headline: COLORS.PALE_BLUE_WHITE,
          title: COLORS.PALE_BLUE_WHITE,
          body: COLORS.PALE_BLUE_WHITE,
          label: COLORS.PALE_BLUE_WHITE,
        },
      },
    },
  });
};

export const createTheme = () => createThemeWith(352);
