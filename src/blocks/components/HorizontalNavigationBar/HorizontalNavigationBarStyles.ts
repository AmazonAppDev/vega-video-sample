// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';

export function horizontalNavigationBarStyles(navBarBackgroundColor?: string) {
  return StyleSheet.create({
    horizontalNavBarContainer: {
      backgroundColor: navBarBackgroundColor,
      width: '100%',
      height: COMMON_STYLES.headerHeight,
      marginVertical: 'auto',
      position: 'absolute',
      justifyContent: 'center',
    },
    horizontalNavBarWrapper: {
      display: 'flex',
      flexDirection: 'row',
      marginHorizontal: 100,
    },
    horizontalNavBarMenu: {
      flex: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    horizontalNavBarItemSeparator: {
      width: 30,
    },
    horizontalNavBarLogo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });
}
