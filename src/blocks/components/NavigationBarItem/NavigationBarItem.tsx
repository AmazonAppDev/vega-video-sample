// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { ForwardedRef, useState } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import { COLORS } from '../../styles/Colors';
import { getItemColor } from './NavigationBarItemHelper';
import { NavigationBarItemProps } from './NavigationBarItemProps';
import { navigationBarItemStyle } from './NavigationBarItemStyle';

export const NavigationBarItem = React.forwardRef(
  (
    {
      item,
      isSelected,
      style,
      onFocus,
      onPress,
      showIcon,
      showText,
    }: NavigationBarItemProps,
    ref: ForwardedRef<TouchableHighlight>,
  ): React.ReactElement => {
    const [isFocused, setFocused] = useState<boolean>(false);
    const { itemColor, itemBgColor } = getItemColor(isFocused, isSelected);
    const styles = navigationBarItemStyle(itemBgColor);

    return (
      <TouchableHighlight
        style={[style]}
        ref={ref}
        underlayColor={COLORS.INVISIBLE_BLACK}
        onPress={onPress}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
        }}>
        <View style={styles.base}>
          {showIcon && (
            <View style={[styles.iconBg]}>
              <Image
                source={item.iconUri}
                style={[styles.icon, { tintColor: itemColor }]}
              />
            </View>
          )}
          {showText && (
            <View style={[styles.textBox]}>
              <Text style={[styles.text, { color: itemColor }]}>
                {item.text}
              </Text>
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  },
);

NavigationBarItem.defaultProps = {
  showText: true,
};
