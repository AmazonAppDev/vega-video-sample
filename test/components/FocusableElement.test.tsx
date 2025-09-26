import { fireEvent, render } from '@testing-library/react-native';
import isEqual from 'lodash/isEqual';
import React from 'react';
import 'react-native';
import { TouchableOpacity } from 'react-native';
import FocusableElement from '../../src/components/FocusableElement';
import { COLORS } from '../../src/styles/Colors';

jest.mock('lodash/isEqual', () =>
  jest.requireMock('../helperMocks/MockLodashIsEqual'),
);

describe('FocusableElement renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(
      <FocusableElement onFocusOverrideStyle={undefined} style={undefined} />,
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly with styles', () => {
    const tree = render(
      <FocusableElement
        onFocusOverrideStyle={{
          borderColor: COLORS.YELLOW,
        }}
        style={{
          borderColor: COLORS.YELLOW,
        }}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
  it('TouchableOpacity is present in component', async () => {
    const { UNSAFE_queryByType } = render(
      <FocusableElement onFocusOverrideStyle={undefined} style={undefined} />,
    );
    const touchableOpacity = UNSAFE_queryByType(TouchableOpacity);
    expect(touchableOpacity).toBeDefined();
  });
});

describe('FocusableElement with React.memo', () => {
  it('doesnot renders when props are unchanged', async () => {
    const { rerender, UNSAFE_queryByType } = render(
      <FocusableElement onFocusOverrideStyle={undefined} style={undefined} />,
    );
    rerender(
      <FocusableElement onFocusOverrideStyle={undefined} style={undefined} />,
    );
    expect(isEqual).toHaveBeenCalledWith(
      {
        onFocusOverrideStyle: undefined,
        style: undefined,
      },
      {
        onFocusOverrideStyle: undefined,
        style: undefined,
      },
    );
    expect(UNSAFE_queryByType(TouchableOpacity)).toBeTruthy();
  });
  it('renders only when props are changed', async () => {
    const { rerender, UNSAFE_queryByType } = render(
      <FocusableElement onFocusOverrideStyle={undefined} style={undefined} />,
    );
    rerender(
      <FocusableElement
        onFocusOverrideStyle={{
          borderColor: COLORS.YELLOW,
        }}
        style={undefined}
      />,
    );
    expect(isEqual).toHaveBeenCalledWith(
      {
        onFocusOverrideStyle: undefined,
        style: undefined,
      },
      {
        onFocusOverrideStyle: {
          borderColor: COLORS.YELLOW,
        },
        style: undefined,
      },
    );
    expect(UNSAFE_queryByType(TouchableOpacity)).toBeTruthy();
  });
});

describe('FocusableElement callback function props', () => {
  test('should call onFocus', async () => {
    const onFocusMock = jest.fn();
    const getFocusStateMock = jest.fn();
    const { getByTestId } = render(
      <FocusableElement
        onFocusOverrideStyle={undefined}
        style={undefined}
        testID="focusable-element"
        onFocus={onFocusMock}
        getFocusState={getFocusStateMock}
      />,
    );
    const focusableElement = getByTestId('focusable-element');
    fireEvent(focusableElement, 'focus');
    expect(onFocusMock).toHaveBeenCalledTimes(1);
    expect(getFocusStateMock).toHaveBeenCalledWith(true);
  });
  test('should call onBlur', async () => {
    const onBlurMock = jest.fn();
    const getFocusStateMock = jest.fn();
    const { getByTestId } = render(
      <FocusableElement
        onFocusOverrideStyle={undefined}
        style={undefined}
        testID="focusable-element"
        onBlur={onBlurMock}
        getFocusState={getFocusStateMock}
      />,
    );
    const focusableElement = getByTestId('focusable-element');
    fireEvent(focusableElement, 'blur');
    expect(onBlurMock).toHaveBeenCalledTimes(1);
    expect(getFocusStateMock).toHaveBeenCalledWith(false);
  });
});
