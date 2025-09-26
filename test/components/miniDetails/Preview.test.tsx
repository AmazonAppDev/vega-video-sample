import { render } from '@testing-library/react-native';
import React from 'react';
import Preview from '../../../src/components/miniDetails/Preview';

import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';

describe('Preview renders correctly', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with a posterUrl', () => {
    const posterUrl = 'http://example.com/poster.jpg';
    const { toJSON, getByTestId } = render(<Preview posterUrl={posterUrl} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByTestId('poster-image')).toBeTruthy();
  });

  it('renders GradientOverlay correctly', () => {
    const { getByTestId } = render(<Preview />);
    expect(getByTestId('left-gradient')).toBeTruthy();
    expect(getByTestId('bottom-gradient')).toBeTruthy();
  });
});

describe('React.memo behavior for Preview', () => {
  const mockPosterUrl = 'http://example.com/poster.jpg';

  it('does not re-render when posterUrl is unchanged', () => {
    const { rerender } = render(<Preview posterUrl={mockPosterUrl} />);

    rerender(<Preview posterUrl={mockPosterUrl} />);
    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      mockPosterUrl,
      mockPosterUrl,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-renders when posterUrl changes', () => {
    const { rerender } = render(<Preview posterUrl={mockPosterUrl} />);

    const newPosterUrl = 'http://example.com/new-poster.jpg';

    rerender(<Preview posterUrl={newPosterUrl} />);
    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      mockPosterUrl,
      newPosterUrl,
    );
  });
});
