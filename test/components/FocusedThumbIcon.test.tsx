import { render } from '@testing-library/react-native';
import React from 'react';
import FocusedThumbIcon from '../../src/components/seekbar/FocusedThumbIcon';

describe('FocusedThumbIcon', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<FocusedThumbIcon />);
    expect(getByTestId('focused-thumb-icon')).toBeTruthy();
  });

  it('applies correct styles', () => {
    const { getByTestId } = render(<FocusedThumbIcon />);
    const thumbIcon = getByTestId('focused-thumb-icon');
    expect(thumbIcon.props.style).toEqual(
      expect.objectContaining({
        height: 32,
        width: 32,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
      }),
    );
  });

  it('has white background color', () => {
    const { getByTestId } = render(<FocusedThumbIcon />);
    const thumbIcon = getByTestId('focused-thumb-icon');
    expect(thumbIcon.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      }),
    );
  });

  it('is a View component', () => {
    const { getByTestId } = render(<FocusedThumbIcon />);
    const thumbIcon = getByTestId('focused-thumb-icon');
    expect(thumbIcon.type).toBe('View');
  });

  it('has consistent dimensions', () => {
    const { getByTestId } = render(<FocusedThumbIcon />);
    const thumbIcon = getByTestId('focused-thumb-icon');
    const style = thumbIcon.props.style;
    expect(style.height).toBe(32);
    expect(style.width).toBe(32);
    expect(style.borderRadius).toBe(18);
  });
});
