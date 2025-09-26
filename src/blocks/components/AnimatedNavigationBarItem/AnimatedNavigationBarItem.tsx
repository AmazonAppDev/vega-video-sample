// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
  Animated,
  Image,
  TouchableHighlight,
  View,
} from '@amazon-devices/react-native-kepler';
import React, { ForwardedRef, useState } from 'react';

import { COLORS } from '../../styles/Colors';
import { navigationBarItemStyle } from '../NavigationBarItem/NavigationBarItemStyle';
import { AnimatedNavigationBarItemProps } from './AnimatedNavigationBarItemProps';
import { animatedNavigationBarItemStyle } from './AnimatedNavigationBarItemStyle';

export const AnimatedNavigationBarItem = React.forwardRef(
  (
    {
      item,
      isSelected = false,
      isActive,
      style,
      onFocusChangeListener,
      opacityAnimatedValue,
      onFocus,
      onPress,
      showIcon = true,
      showText = true,
    }: AnimatedNavigationBarItemProps,
    ref: ForwardedRef<TouchableHighlight>,
  ): React.ReactElement => {
    const [isFocused, setFocused] = useState<boolean>(false);
    const { animatedItemStyle, textColor, iconColor, iconBgColor } =
      animatedNavigationBarItemStyle(isFocused, isActive, isSelected);
    const defaultItemStyle = navigationBarItemStyle(iconBgColor);

    return (
      <TouchableHighlight
        style={[style]}
        ref={ref}
        underlayColor={COLORS.INVISIBLE_BLACK}
        onPress={onPress}
        onFocus={() => {
          setFocused(true);
          onFocusChangeListener(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
        }}>
        <View style={[animatedItemStyle.base]}>
          {showIcon && (
            <View style={[defaultItemStyle.iconBg, animatedItemStyle.iconBg]}>
              <Image
                source={item.iconUri}
                style={[defaultItemStyle.icon, { tintColor: iconColor }]}
              />
            </View>
          )}
          {showText && (
            <View style={animatedItemStyle.textBox}>
              <Animated.Text
                style={[
                  animatedItemStyle.text,
                  {
                    color: textColor,
                    opacity: opacityAnimatedValue,
                  },
                ]}>
                {item.text}
              </Animated.Text>
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  },
);
