import { Theme } from '@amazon-devices/kepler-ui-components';
import { describe } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';
import { RotatorData } from '../../../src/components/rotator/type';
import { MovieRotatorGrid } from '../../../src/components/touchOptimized/MovieRotatorGrid';
import { MovieGridData } from '../../../src/types/MovieGridData';
import {
  MovieGridDataBuilder,
  RotatorDataBuilder,
  TitleDataBuilder,
} from '../../common/dataBuilders';

const mockTheme = {
  card: {
    container: {
      size: {
        width: {
          vertical: {
            md: 200,
          },
        },
        height: {
          vertical: {
            md: 300,
          },
        },
      },
    },
  },
} as Theme;

jest.mock('@amazon-devices/react-native-kepler', () => ({
  useHideSplashScreenCallback: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('@amazon-devices/kepler-performance-api', () => ({
  useReportFullyDrawn: jest.fn().mockReturnValue(() => {}),
}));

const mockUseTheme = jest.fn().mockReturnValue(mockTheme);

jest.mock('@amazon-devices/kepler-ui-components', () => ({
  useTheme: () => mockUseTheme(),
}));

const gridData: MovieGridData[] = [
  new MovieGridDataBuilder('Sci-Fi', 'test-1')
    .addTile(
      new TitleDataBuilder('169313')
        .setTitle('Hitchhikers guide to galaxy')
        .setDuration(200)
        .setRentAmount('2.99$')
        .setSecure(true)
        .setDescription(
          'the answer to the ultimate question of life, the universe, and everything.',
        )
        .build(),
    )
    .build(),
];

const rotatorData: RotatorData[] = [
  new RotatorDataBuilder('1111').build(),
  new RotatorDataBuilder('1112').build(),
];

const screenDimensions = {
  fontScale: 1,
  height: 1080,
  scale: 1,
  width: 1920,
};

describe('Movie Rotator Grid Test Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const useWindowDimensionsSpy = jest.spyOn(
      require('react-native'),
      'useWindowDimensions',
    );
    useWindowDimensionsSpy.mockReturnValue(screenDimensions);
    mockUseTheme.mockReturnValue(mockTheme);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Carousel is rendered', async () => {
    const { findAllByTestId } = render(
      <MovieRotatorGrid movieGridData={gridData} rotatorData={rotatorData} />,
    );

    const movieCarouselComponent = await findAllByTestId('movie-rotator-grid');
    expect(movieCarouselComponent).toBeDefined();

    expect(
      require('@amazon-devices/react-native-kepler').useHideSplashScreenCallback,
    ).toHaveBeenCalled();
    expect(
      require('@amazon-devices/kepler-performance-api').useReportFullyDrawn,
    ).toHaveBeenCalled();
    expect(mockUseTheme).toHaveBeenCalled();
  });
});
