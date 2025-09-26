import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import Header from '../../../src/components/miniDetails/Header';
import { tileData } from '../../../src/data/tileData';
import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';

describe('Header renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(<Header />);
    expect(tree).toMatchSnapshot();
  });
});

describe('React.memo behavior for Header', () => {
  it('does not re-render when tileData is unchanged', () => {
    const { rerender } = render(<Header data={tileData} />);
    rerender(<Header data={tileData} />);

    expect(areComponentPropsEqual).toHaveBeenCalledWith(tileData, tileData);
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-renders when tile data changes', () => {
    const updatedTileData = { ...tileData, id: '169314' };

    const { rerender } = render(<Header data={tileData} />);
    rerender(<Header data={updatedTileData} />);

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      tileData,
      updatedTileData,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
