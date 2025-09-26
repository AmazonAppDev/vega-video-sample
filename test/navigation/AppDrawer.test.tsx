import { LinearGradientProps } from '@amazon-devices/react-linear-gradient';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import { render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import AppDrawer from '../../src/components/navigation/AppDrawer';
import DrawerContent from '../../src/components/navigation/navigationDrawerContent/DrawerContent';
import { DrawerType, Screens } from '../../src/components/navigation/types';
import HomeScreen from '../../src/screens/HomeScreen';
import { COLORS } from '../../src/styles/Colors';

jest.mock('@amazon-devices/react-navigation__drawer', () => ({
  createDrawerNavigator: jest.fn().mockReturnValue({
    Navigator: jest.fn(({ children }) => <div>{children}</div>),
    Screen: jest.fn(({ children }) => children),
  }),
}));

jest.mock('@amazon-devices/react-linear-gradient', () => ({
  __esModule: true,

  default: ({ children }: LinearGradientProps) => <>{children}</>,
}));

describe('AppDrawer', () => {
  const setup = () => {
    return render(<AppDrawer />);
  };

  it('should render GestureHandlerRootView', () => {
    setup();
    const { getByTestId } = render(<AppDrawer />);
    const gestureHandlerRootView = getByTestId('gesture-handler-root-view');
    expect(gestureHandlerRootView).toBeDefined();
  });

  it('renders the drawer navigator with correct screens', () => {
    setup();

    const createDrawer = createDrawerNavigator();

    expect(createDrawer.Navigator).toHaveBeenCalled();
    expect(createDrawer.Screen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: Screens.HOME_SCREEN,
        component: HomeScreen,
        options: { drawerIcon: expect.any(Function) },
      }),
      {},
    );
    expect(createDrawer.Screen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: Screens.SEARCH_SCREEN,
        options: { drawerIcon: expect.any(Function) },
      }),
      {},
    );
    expect(createDrawer.Screen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: Screens.SETTINGS_SCREEN,
        options: { drawerIcon: expect.any(Function) },
      }),
      {},
    );
  });

  it('renders drawer icons correctly for each screen initially', () => {
    setup();

    const createDrawer = createDrawerNavigator();
    const screenCalls = (createDrawer.Screen as jest.Mock).mock.calls;
    const homeScreenIconProps = screenCalls
      .find(
        (call: { name: Screens }[]) => call[0].name === Screens.HOME_SCREEN,
      )[0]
      .options.drawerIcon(
        (props: { color: string; size: number; focused: boolean }) => {
          return props.color;
        },
      ).props;
    const searchScreenIconProps = screenCalls
      .find(
        (call: { name: Screens }[]) => call[0].name === Screens.SEARCH_SCREEN,
      )[0]
      .options.drawerIcon().props;
    const settingsScreenIconProps = screenCalls
      .find(
        (call: { name: Screens }[]) => call[0].name === Screens.SETTINGS_SCREEN,
      )[0]
      .options.drawerIcon(
        (props: { color: string; size: number; focused: boolean }) => {
          return props.color;
        },
      ).props;

    expect(homeScreenIconProps).toEqual({
      testID: 'homesvg',
      width: 40,
      height: 40,
      stroke: COLORS.SMOKE_WHITE,
      fill: undefined,
    });

    expect(searchScreenIconProps).toEqual({
      testID: 'searchsvg',
      width: 40,
      height: 40,
      stroke: COLORS.SMOKE_WHITE,
      fill: COLORS.SMOKE_WHITE,
    });

    expect(settingsScreenIconProps).toEqual({
      testID: 'settingsvg',
      width: 40,
      height: 40,
      stroke: COLORS.SMOKE_WHITE,
      fill: undefined,
    });
  });

  it('navigator has correct screen options', () => {
    let mockProps: any;
    const styles = StyleSheet.create({
      drawer: {
        backgroundColor: COLORS.TRANSPARENT,
        borderRightColor: COLORS.TRANSPARENT,
        width: 100,
      },
    });
    setup();
    const createDrawer = createDrawerNavigator();
    const navigatorProps = (createDrawer.Navigator as jest.Mock).mock
      .calls[0][0];

    expect(navigatorProps.screenOptions).toEqual({
      drawerType: DrawerType.PERMANENT,
      drawerStyle: styles.drawer,
      headerShown: false,
    });
    expect(navigatorProps.drawerContent()).toEqual(
      <DrawerContent {...mockProps} />,
    );
  });
});
