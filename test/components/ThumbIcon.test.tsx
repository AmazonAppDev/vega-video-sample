import { render } from '@testing-library/react-native';
import React from 'react';
import ThumbIcon from '../../src/components/seekbar/ThumbIcon';

describe('ThumbIcon', () => {
  it('renders focused state correctly', () => {
    const { getByTestId } = render(<ThumbIcon focused={true} />);
    expect(getByTestId('thumb-icon')).toBeTruthy();
  });

  it('renders unfocused state correctly', () => {
    const { getByTestId } = render(<ThumbIcon focused={false} />);
    expect(getByTestId('thumb-icon')).toBeTruthy();
  });

  it('applies focused styles when focused is true', () => {
    const { getByTestId } = render(<ThumbIcon focused={true} />);
    const thumbIcon = getByTestId('thumb-icon');
    expect(thumbIcon.props.style).toEqual(
      expect.objectContaining({
        height: 32,
        width: 32,
        borderRadius: 25,
      }),
    );
  });

  it('applies unfocused styles when focused is false', () => {
    const { getByTestId } = render(<ThumbIcon focused={false} />);
    const thumbIcon = getByTestId('thumb-icon');
    expect(thumbIcon.props.style).toEqual(
      expect.objectContaining({
        height: 35,
        width: 10,
        borderRadius: 5,
        borderWidth: 2,
      }),
    );
  });

  it('handles undefined focused prop gracefully', () => {
    const { getByTestId } = render(<ThumbIcon focused={undefined} />);
    expect(getByTestId('thumb-icon')).toBeTruthy();
  });
});
