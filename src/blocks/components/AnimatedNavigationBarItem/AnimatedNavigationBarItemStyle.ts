// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { getIconColors, getTextColor } from './AnimatedNavigationBarItemHelper';

import { StyleSheet } from 'react-native';
import { scaleUxToDp } from '../../helpers/pixelUtils';

export const animatedNavigationBarItemStyle = (
  isFocused: boolean,
  isActive: boolean,
  isSelected: boolean,
) => {
  const { iconColor, iconBgColor } = getIconColors(
    isFocused,
    isActive,
    isSelected,
  );
  return {
    textColor: getTextColor(isFocused, isActive),
    iconColor,
    iconBgColor,
    animatedItemStyle: StyleSheet.create({
      base: {
        flexDirection: 'row',
        marginVertical: 10,
      },
      textBox: {
        justifyContent: 'center',
        marginLeft: 20,
      },
      text: {
        fontSize: 18,
        fontWeight: '700',
        textAlignVertical: 'center',
        textAlign: 'left',
      },
      iconBg: {
        borderRadius: scaleUxToDp(8),
      },
    }),
  };
};
