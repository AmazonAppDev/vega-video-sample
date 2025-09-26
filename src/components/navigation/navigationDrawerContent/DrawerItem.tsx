// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import isEqual from 'lodash/isEqual';
import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../../styles/Colors';
import { scaleUxToDp } from '../../../utils/pixelUtils';

export interface DrawerItemProps {
  icon?: (props?: {
    color: string;
    size: number;
    focused: boolean;
  }) => React.ReactNode;
  label?: string;
  isSelected: boolean;
  isFocused: boolean;
  isDrawerInFocus: boolean;
  drawerWidth: number;
  routeName: string;
  onPress: (routeName: string) => void;
}

const DrawerItem = ({
  icon,
  label,
  isSelected,
  isFocused,
  isDrawerInFocus,
  drawerWidth,
  onPress,
  routeName,
}: DrawerItemProps) => {
  const Icon = icon
    ? icon({
        color: isSelected ? COLORS.WHITE : COLORS.TRANSPARENT,
        size: 2,
        focused: isFocused,
      })
    : null;

  const computedStyle = StyleSheet.create({
    drawerItemContainer: {
      width: drawerWidth - scaleUxToDp(20),
      flexDirection: 'row',
      alignItems: 'center',
      padding: scaleUxToDp(20),
      marginLeft: scaleUxToDp(10),
      marginRight: scaleUxToDp(10),
      marginBottom: scaleUxToDp(10),
    },
  });

  const viewStyles: StyleProp<ViewStyle>[] = [
    computedStyle.drawerItemContainer,
  ];
  if (isSelected && !isDrawerInFocus) {
    viewStyles.push(styles.selectedElement);
  }
  if (isDrawerInFocus && isFocused) {
    viewStyles.push(styles.focusElement);
  }

  const handleTouch = (event: GestureResponderEvent) => {
    event.preventDefault();
    onPress(routeName);
  };

  return (
    /*
      Parent takes care of focus management, therefore we would
      explicitly tell the focus manager to not give us focus.
    */
    <View
      style={viewStyles}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleTouch}
      testID="touchableView">
      {Icon}
      <Animated.Text numberOfLines={1} style={[styles.labelText]}>
        {label}
      </Animated.Text>
    </View>
  );
};

const areDrawerItemPropsEqual = (
  prevProps: DrawerItemProps,
  nextProps: DrawerItemProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(DrawerItem, areDrawerItemPropsEqual);

const styles = StyleSheet.create({
  focusElement: {
    borderColor: COLORS.ORANGE,
    borderWidth: 4,
  },
  selectedElement: {
    borderColor: COLORS.ORANGE,
    borderBottomWidth: 8,
    backgroundColor: COLORS.DARK_GRAY,
  },
  labelText: {
    marginLeft: scaleUxToDp(32.5),
    textAlignVertical: 'center',
    color: COLORS.SMOKE_WHITE,
    fontWeight: '400',
    fontSize: scaleUxToDp(28),
  },
});
