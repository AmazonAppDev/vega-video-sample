import { Theme } from '@amazon-devices/kepler-ui-components';

/**
 * Obtains the card dimensions for md aka medium vertical card
 *
 * @param theme Theme from which card dimensions are obtained.
 * @returns card dimensions
 * @throws exception if width or height are undefined
 */
export const getVerticalCardDimensionsMd = (
  theme: Theme,
): { width: number; height: number } => {
  const width = theme.card?.container.size.width.vertical.md;
  const height = theme.card?.container.size.height.vertical.md;

  if (width === undefined || height === undefined) {
    throw new Error('Card dimensions are undefined');
  }

  return {
    width: width,
    height: height,
  };
};
