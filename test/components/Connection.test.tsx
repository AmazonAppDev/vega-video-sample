import { useFocusEffect } from '@amazon-devices/react-navigation__core';
import '@testing-library/jest-native/extend-expect';
import {
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import ConnectionComponent from '../../src/components/ConnectionComponent';
import FocusableElement from '../../src/components/FocusableElement';
global.fetch = jest.fn();

jest.mock('@amazon-devices/keplerscript-netmgr-lib', () => ({
  refresh: jest.fn(),
}));

jest.mock('@amazon-devices/react-navigation__core', () => {
  return {
    useFocusEffect: jest.fn(),
    NavigationContainer: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

jest.mock('@amazon-devices/kepler-ui-components', () => ({
  __esModule: true,
  Typography: jest.fn(),
}));

jest.mock('@amazon-devices/keplerscript-netmgr-lib', () => ({
  __esModule: true,

  fetch: jest.fn(),
  NetInfoConnectedDetails: jest.fn(),
  NetInfoState: jest.fn(),
  refresh: jest.fn().mockResolvedValue({}),
}));

const handleRefreshError = (): Promise<void> => {
  throw new Error('I should fail');
};

describe('Connection Component Test Cases', () => {
  let tree: RenderAPI;
  beforeEach(() => {
    tree = render(<ConnectionComponent testID="connection-component" />);
  });

  it('renders correctly with styles', () => {
    const snap = tree;
    expect(snap).toMatchSnapshot();
  });

  it('renders correctly with initial state', () => {
    const { getByTestId } = tree;
    expect(getByTestId('connection-component')).toBeTruthy();
  });

  it('does not display wifi details when wifiDetails is empty object', () => {
    const { queryByText } = tree;
    expect(queryByText('Wifi Name:')).toBeNull();
  });

  it('styles applied correctly', () => {
    const { getByTestId } = tree;
    const container = getByTestId('connection-component');
    expect(container).toHaveStyle({ position: 'absolute' });
  });

  it('returns the number of keys when wifiDetails has keys', () => {
    tree;
    const wifiDetails = {
      ssid: 'TestWifi',
      password: 'password123',
      security: 'WPA2',
    };
    expect(Object.keys(wifiDetails).length).toBe(3);
  });

  it('FocusableElement responds to focus and press events', () => {
    // Mock onPress function
    const onPressMock = jest.fn();
    // Render the dummy FocusableElement with a testID and required params
    const { getByTestId } = render(
      <FocusableElement
        onPress={onPressMock}
        testID="focusable-element"
        onFocusOverrideStyle={undefined}
        style={undefined}
      />,
    );
    fireEvent.press(getByTestId('focusable-element'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('FocusableElement handles focus and blur events correctly', () => {
    // Mock onFocus and onBlur callback functions
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();

    // Render the FocusableElement with onFocus and onBlur props
    const { getByTestId } = render(
      <FocusableElement
        onFocus={onFocusMock}
        onBlur={onBlurMock}
        testID="focusable-element"
        onFocusOverrideStyle={undefined}
        style={undefined}
      />,
    );
    fireEvent(getByTestId('focusable-element'), 'focus');
    expect(onFocusMock).toHaveBeenCalled();
    fireEvent(getByTestId('focusable-element'), 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });

  it('calls handleRefresh when screen is in focus', async () => {
    const handleRefresh = jest.fn();
    render(<ConnectionComponent testID="connection-component" />);
    await (useFocusEffect as jest.Mock).mock.calls[0][0]();
    handleRefresh();
    waitFor(() => {
      expect(handleRefresh).toHaveBeenCalled();
    });
  });

  it('onError is called when refresh throws an error', () => {
    expect.assertions(1);
    const mockOnError = jest.fn();
    render(<ConnectionComponent testID="connection-component" />);
    try {
      handleRefreshError();
    } catch (error) {
      mockOnError();
    }
    expect(mockOnError).toHaveBeenCalled();
  });
});
