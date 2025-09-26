import { render } from '@testing-library/react-native';
import React from 'react';
import ForwardBackwardIcon from '../../src/components/seekbar/ForwardBackwardIcon';

// Mock the image assets
jest.mock('../../src/assets/fast_forward.png', () => 'fast_forward.png');
jest.mock('../../src/assets/rewind.png', () => 'rewind.png');

describe('ForwardBackwardIcon', () => {
  it('renders rewind mode with multiplier 1', () => {
    const { getByText } = render(
      <ForwardBackwardIcon
        mode="rewind"
        multiplier={1}
        stepValue={10}
        focused={true}
      />,
    );

    expect(getByText('-10')).toBeTruthy();
  });

  it('renders forward mode with multiplier 1', () => {
    const { getByText } = render(
      <ForwardBackwardIcon
        mode="forward"
        multiplier={1}
        stepValue={10}
        focused={true}
      />,
    );

    expect(getByText('+10')).toBeTruthy();
  });

  it('renders fast_rewind mode with multiplier 1', () => {
    const { getByText } = render(
      <ForwardBackwardIcon
        mode="fast_rewind"
        multiplier={1}
        stepValue={10}
        focused={true}
      />,
    );

    expect(getByText('1x')).toBeTruthy();
  });

  it('renders fast_forward mode with multiplier 1', () => {
    const { getByText } = render(
      <ForwardBackwardIcon
        mode="fast_forward"
        multiplier={1}
        stepValue={10}
        focused={true}
      />,
    );

    expect(getByText('1x')).toBeTruthy();
  });

  it('renders fast_rewind mode with multiplier greater than 1', () => {
    const { getByText } = render(
      <ForwardBackwardIcon
        mode="fast_rewind"
        multiplier={3}
        stepValue={10}
        focused={true}
      />,
    );

    expect(getByText('3x')).toBeTruthy();
  });

  it('renders fast_forward mode with multiplier greater than 1', () => {
    const { getByText } = render(
      <ForwardBackwardIcon
        mode="fast_forward"
        multiplier={5}
        stepValue={10}
        focused={true}
      />,
    );

    expect(getByText('5x')).toBeTruthy();
  });

  it('renders empty string for non-fast modes with multiplier greater than 1', () => {
    const { queryByText } = render(
      <ForwardBackwardIcon
        mode="rewind"
        multiplier={3}
        stepValue={10}
        focused={true}
      />,
    );

    // Should not render any multiplier text for non-fast modes
    expect(queryByText('3x')).toBeNull();
    expect(queryByText('-10')).toBeNull();
  });
});
