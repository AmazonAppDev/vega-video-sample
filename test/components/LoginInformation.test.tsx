import { act, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import LoginInformation from '../../src/components/LoginInformation';

jest.mock('@amazon-devices/react-native-kepler', () => ({
  TVFocusGuideView: (props) => <div {...props}>{props.children}</div>,
}));

describe('LoginInformation', () => {
  const handleOnToggleLoginStatus = jest.fn();

  beforeEach(() => {
    render(
      <LoginInformation
        loginStatus={false}
        handleOnToggleLoginStatus={handleOnToggleLoginStatus}
      />,
    );
  });

  it('renders SettingsScreen correctly and matches snapshot', async () => {
    const trees = render(
      <LoginInformation
        loginStatus={false}
        handleOnToggleLoginStatus={handleOnToggleLoginStatus}
      />,
    );
    expect(trees).toMatchSnapshot();
  });

  it('View is present in component', async () => {
    const { queryByTestId } = render(
      <LoginInformation
        loginStatus={false}
        handleOnToggleLoginStatus={handleOnToggleLoginStatus}
      />,
    );
    await act(() => {
      const view = queryByTestId('settings-main-view');
      expect(view).toBeDefined();
    });
  });

  it('renders the Image component when loginStatus is true', async () => {
    const { getByTestId, getByText } = render(
      <LoginInformation
        loginStatus={true}
        handleOnToggleLoginStatus={jest.fn()}
      />,
    );
    // Wait for the Image component to render
    await waitFor(() => {
      expect(getByTestId('profile-image')).toBeTruthy();
    });

    // Ensure the correct text is displayed
    expect(getByText('Hi, Johannes!')).toBeTruthy();
  });
});
