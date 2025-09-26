/* eslint-disable react/no-unstable-nested-components */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { GestureHandlerRootView } from '@amazon-devices/react-native-gesture-handler';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import React from 'react';
import { StyleSheet } from 'react-native';
import HomeSvg from '../../assets/svgr/HomeSVG';
import SearchSvg from '../../assets/svgr/SearchSVG';
import SettingSvg from '../../assets/svgr/SettingSVG';
import HomeScreen from '../../screens/HomeScreen';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import SearchWithSuspense from '../SearchWithSuspense';
import SettingsWithSuspense from '../SettingsWithSuspense';
import DrawerContent from './navigationDrawerContent/DrawerContent';
import { AppDrawerParamList, DrawerType, Screens } from './types';

const AppDrawer = () => {
  const Drawer = createDrawerNavigator<AppDrawerParamList>();

  return (
    <GestureHandlerRootView
      testID="gesture-handler-root-view"
      style={styles.container}>
      <Drawer.Navigator
        initialRouteName={Screens.HOME_SCREEN}
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          drawerType: DrawerType.PERMANENT,
          drawerStyle: styles.drawer,
          headerShown: false,
        }}
        backBehavior="history">
        <Drawer.Screen
          name={Screens.HOME_SCREEN}
          component={HomeScreen}
          options={{
            drawerIcon: (props) => (
              <HomeSvg
                testID="homesvg"
                width={40}
                height={40}
                stroke={COLORS.SMOKE_WHITE}
                fill={props.color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name={Screens.SEARCH_SCREEN}
          component={SearchWithSuspense}
          options={{
            drawerIcon: () => (
              <SearchSvg
                testID="searchsvg"
                width={40}
                height={40}
                stroke={COLORS.SMOKE_WHITE}
                fill={COLORS.SMOKE_WHITE}
              />
            ),
          }}
        />
        <Drawer.Screen
          name={Screens.SETTINGS_SCREEN}
          component={SettingsWithSuspense}
          options={{
            drawerIcon: (props) => (
              <SettingSvg
                testID="settingsvg"
                width={40}
                height={40}
                stroke={COLORS.SMOKE_WHITE}
                fill={props.color}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  drawer: {
    backgroundColor: COLORS.TRANSPARENT,
    borderRightColor: COLORS.TRANSPARENT,
    width: scaleUxToDp(100),
  },
  imageIcon: {
    width: scaleUxToDp(30),
    height: scaleUxToDp(30),
    tintColor: COLORS.SMOKE_WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
  },
});

export default AppDrawer;
