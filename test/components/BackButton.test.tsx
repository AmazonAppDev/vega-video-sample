import { render } from '@testing-library/react-native';
import React from 'react';
import { areComponentPropsEqual } from '../../src/utils/lodashHelper';

import 'react-native';
import BackButton from '../../src/components/BackButton';

jest.mock('../../src/components/FocusableElement');

const onPressMock = jest.fn();
describe('BackButton renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(
      <BackButton onPress={onPressMock} hasTVPreferredFocus={false} />,
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('React.memo behavior for BackButton', () => {
  const excludedProps = ['onPress'];
  it('does not re-render when hasTVPreferredFocus is unchanged', () => {
    const mockHasTVPreferredFocus = false;
    const { rerender } = render(
      <BackButton
        onPress={onPressMock}
        hasTVPreferredFocus={mockHasTVPreferredFocus}
      />,
    );
    rerender(
      <BackButton
        onPress={onPressMock}
        hasTVPreferredFocus={mockHasTVPreferredFocus}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      { hasTVPreferredFocus: mockHasTVPreferredFocus, onPress: onPressMock },
      { hasTVPreferredFocus: mockHasTVPreferredFocus, onPress: onPressMock },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-render when hasTVPreferredFocus is changed', () => {
    const mockHasTVPreferredFocus = true;
    const updatedMockHasTVPreferredFocus = false;

    const { rerender } = render(
      <BackButton
        onPress={onPressMock}
        hasTVPreferredFocus={mockHasTVPreferredFocus}
      />,
    );
    rerender(
      <BackButton
        onPress={onPressMock}
        hasTVPreferredFocus={updatedMockHasTVPreferredFocus}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      { hasTVPreferredFocus: mockHasTVPreferredFocus, onPress: onPressMock },
      {
        hasTVPreferredFocus: updatedMockHasTVPreferredFocus,
        onPress: onPressMock,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
