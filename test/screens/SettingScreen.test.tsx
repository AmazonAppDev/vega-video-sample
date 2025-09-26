import { LinearGradientProps } from '@amazon-devices/react-linear-gradient';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import FocusableElement from '../../src/components/FocusableElement';
import { Screens } from '../../src/components/navigation/types';
import SettingsScreen from '../../src/screens/SettingsScreen';

jest.mock('@amazon-devices/react-native-kepler', () => ({
  TVFocusGuideView: (props) => <div {...props}>{props.children}</div>,
}));

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
} as any;

const mockRoute = {
  key: 'SearchScreen',
  name: Screens.SETTINGS_SCREEN,
  params: {},
} as any;

jest.mock('@amazon-devices/react-linear-gradient', () => ({
  __esModule: true,
  default: ({ children }: LinearGradientProps) => <>{children}</>,
}));

jest.mock('@amazon-devices/react-navigation__core', () => ({
  useFocusEffect: jest.fn((cb) => cb()),
}));

jest.mock('@amazon-devices/react-native-device-info', () => ({
  getApplicationName: jest.fn(() => 'TestApp'),
  getModel: jest.fn(() => 'TestModel'),
  getSystemName: jest.fn(() => 'TestSystem'),
  getVersion: jest.fn(() => '1.0.0'),
  getDeviceType: jest.fn(() => 'TestDevice'),
  getBaseOs: jest.fn(() => Promise.resolve('TestOS')),
  getManufacturer: jest.fn(() => Promise.resolve('TestManufacturer')),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(() => false),
}));
jest.mock('../../src/config/AppConfig', () => ({
  isAccountLoginEnabled: jest.fn(() => true),
}));

// Mock the useDeviceInfo hook
jest.mock('../../src/utils/useDeviceInfo', () => ({
  useDeviceInfo: jest.fn(() => ({
    deviceInfo: {
      applicationName: 'TestApp',
      modelName: 'TestModel',
      systemName: 'TestOS',
      versionName: '1.0',
      deviceType: 'TestType',
      baseOS: 'TestBaseOS',
      manufacturer: 'TestManufacturer',
    },
    isLoading: false,
    fetchDeviceInfo: jest.fn(),
  })),
}));

// Mock the refresh function from @amazon-devices/keplerscript-netmgr-lib
jest.mock('@amazon-devices/keplerscript-netmgr-lib', () => ({
  refresh: jest.fn(() => Promise.resolve({ success: true })),
}));

const renderSettingsScreen = () => {
  return <SettingsScreen navigation={mockNavigation} route={mockRoute} />;
};

afterEach(cleanup);

describe('Setting Test Cases', () => {
  it('returns container', () => {
    const { container } = render(<View />);
    expect(container).toBeTruthy();
  });

  it('View is present in component', async () => {
    const { queryByTestId } = render(renderSettingsScreen());
    await act(() => {
      const view = queryByTestId('settings-main-view');
      expect(view).toBeDefined();
    });
  });

  it('Linear gradient is present in component', async () => {
    const { queryByTestId } = render(renderSettingsScreen());
    await act(() => {
      const linearGradients = queryByTestId('linear-gradient');
      expect(linearGradients).toBeDefined();
    });
  });

  it('FocusableElement responds to focus and press events', () => {
    const onPressMock = jest.fn();

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
    const onBlurMock = jest.fn();
    const onFocusMock = jest.fn();
    const { getByTestId } = render(
      <FocusableElement
        onBlur={onBlurMock}
        onFocus={onFocusMock}
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

  it('does not display wifi details when wifiDetails is empty object', async () => {
    const { queryByText } = render(renderSettingsScreen());
    await act(() => {
      expect(queryByText('Wifi Name:')).toBeNull();
    });
  });

  it('returns the number of keys when wifiDetails has keys', async () => {
    const wifiDetails = {
      ssid: 'TestWifi',
      password: 'password123',
      security: 'WPA2',
    };
    render(renderSettingsScreen());
    await act(() => {
      expect(Object.keys(wifiDetails).length).toBe(3);
    });
  });

  it('navigates to FEEDBACK_SCREEN when Feedback button is pressed', () => {
    const { getByText } = render(
      <SettingsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Find the Feedback button
    const feedbackButton = getByText('Feedback');
    expect(feedbackButton).toBeTruthy();

    // Press the button
    fireEvent.press(feedbackButton);

    // Check if navigation was called
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      Screens.FEEDBACK_SCREEN,
    );
  });

  it('renders SettingScreen correctly and matches snapshot', async () => {
    const trees = render(
      <SettingsScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(trees).toMatchSnapshot();
  });
});
