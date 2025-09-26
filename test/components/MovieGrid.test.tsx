import { describe } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import MovieGrid from '../../src/components/MovieGrid';
import { MovieGridData } from '../../src/types/MovieGridData';
import { MovieGridDataBuilder, TitleDataBuilder } from '../common/dataBuilders';

const ViewTypes = {
  Grid: 'GRID',
  Other: 'OTHER',
};

const visibleRows = 3;

const setLayoutDimensions = (
  type: string | number,
  dim: { width: any; height: any },
  index: number,
) => {
  console.log(index);
  switch (type) {
    case ViewTypes.Grid:
      dim.width = Dimensions.get('window').width;
      dim.height = Dimensions.get('window').height / visibleRows;
      break;
    default:
      dim.width = 0;
      dim.height = 0;
  }
};

const tileData: MovieGridData[] = [
  new MovieGridDataBuilder('Costa Rica Attractions', 'test-1')
    .addTile(new TitleDataBuilder('169313').build())
    .build(),
];

jest.mock('@amazon-devices/react-native-kepler', () => ({
  useHideSplashScreenCallback: jest.fn(),
}));

const initialProps = {
  heading: 'Category 1',
  tileData,
  testID: 'movie_carousel_category_1',
  row: 0,
  reportFullyDrawn: jest.fn(),
  onTileFocus: jest.fn(),
  onTileBlur: jest.fn(),
  destinations: [],
};

describe('Movie Grid Test Cases', () => {
  it('renders correctly', async () => {
    const { findAllByTestId } = render(
      <MovieGrid data={tileData} testID="movieGrid" destinations={[]} />,
    );
    const movieGridComponents = await findAllByTestId('movieGrid');
    expect(movieGridComponents.length).toBe(tileData.length);
  });

  it('should correctly identify unchanged data', () => {
    const { rerender } = render(
      <MovieGrid data={tileData} {...initialProps} />,
    );
    rerender(<MovieGrid data={tileData} {...initialProps} />);
    expect(initialProps.onTileFocus).not.toHaveBeenCalled();
  });

  it('calls onTileFocus when a tile is focused', () => {
    const { getByTestId } = render(
      <MovieGrid data={tileData} {...initialProps} />,
    );
    const movieCarousel = getByTestId('movie_carousel_category_1');
    fireEvent(movieCarousel, 'onTileFocus', {
      id: '169313',
      title: 'Beautiful Whale Tail Uvita Costa Rica',
    });
    expect(initialProps.onTileFocus).toHaveBeenCalledWith({
      id: '169313',
      title: 'Beautiful Whale Tail Uvita Costa Rica',
    });
  });

  it('calls onTileBlur when a tile is blurred', () => {
    const { getByTestId } = render(
      <MovieGrid data={tileData} {...initialProps} />,
    );
    const movieCarousel = getByTestId('movie_carousel_category_1');
    fireEvent(movieCarousel, 'onTileBlur', {
      id: '169313',
      title: 'Beautiful Whale Tail Uvita Costa Rica',
    });
    expect(initialProps.onTileBlur).toHaveBeenCalledWith({
      id: '169313',
      title: 'Beautiful Whale Tail Uvita Costa Rica',
    });
  });

  it('should set dim to 0 width and height for unknown view type', () => {
    const dim = { width: 100, height: 100 };
    setLayoutDimensions(ViewTypes.Other, dim, 0);
    expect(dim.width).toBe(0);
    expect(dim.height).toBe(0);
  });

  it('should set correct dimensions for Grid view type', () => {
    const dim = { width: 0, height: 0 };
    const windowDimensions = Dimensions.get('window');
    setLayoutDimensions(ViewTypes.Grid, dim, 0);
    expect(dim.width).toBe(windowDimensions.width);
    expect(dim.height).toBe(windowDimensions.height / visibleRows);
  });
});
