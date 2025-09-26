// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  DrawerActions,
  useNavigation,
  useNavigationState,
} from '@amazon-devices/react-navigation__core';
import { DrawerContentComponentProps } from '@amazon-devices/react-navigation__drawer/lib/typescript/src/types';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import NavBackgroundGradient from '../../../assets/nav_drawer_background_gradient.png';
import { COLORS } from '../../../styles/Colors';
import { scaleUxToDp } from '../../../utils/pixelUtils';
import DrawerItemList from './DrawerItemList';
const drawerAverageWidth = scaleUxToDp(100);
const drawerExpandedWidth = scaleUxToDp(300);

const DrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation();

  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index]?.name,
  );

  const [isDrawerInFocus, setDrawerInFocus] = useState(false);
  const drawerWidth = isDrawerInFocus
    ? drawerExpandedWidth
    : drawerAverageWidth;

  const onFocusHandler = () => {
    setDrawerInFocus(true);
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const onBlurHandler = () => {
    setDrawerInFocus(false);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <ImageBackground
      key={currentRouteName}
      source={NavBackgroundGradient}
      style={[styles.drawerBackground, { width: drawerWidth }]}>
      <DrawerItemList
        isDrawerInFocus={isDrawerInFocus}
        onDrawerListFocus={onFocusHandler}
        onDrawerListBlur={onBlurHandler}
        drawerWidth={drawerWidth}
        {...props}
      />
    </ImageBackground>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerBackground: {
    height: '100%',
    backgroundColor: COLORS.DARK_GRAY,
    position: 'absolute',
  },
});
