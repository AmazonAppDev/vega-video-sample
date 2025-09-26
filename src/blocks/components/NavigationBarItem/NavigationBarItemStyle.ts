// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { StyleSheet } from 'react-native';
import { scaleUxToDp } from '../../helpers/pixelUtils';

export const navigationBarItemStyle = (iconBgColor?: string) => {
  return StyleSheet.create({
    icon: {
      height: 30,
      width: 30,
      resizeMode: 'cover',
    },
    base: {
      flexDirection: 'row',
      marginVertical: 10,
      marginRight: 30,
    },
    textBox: {
      backgroundColor: iconBgColor,
      justifyContent: 'center',
      borderRadius: scaleUxToDp(24),
    },
    text: {
      fontSize: 20,
      fontWeight: '700',
      textAlignVertical: 'center',
      textAlign: 'left',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    iconBg: {
      backgroundColor: iconBgColor,
      width: scaleUxToDp(55),
      height: scaleUxToDp(55),
      borderRadius: scaleUxToDp(55 / 2),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
