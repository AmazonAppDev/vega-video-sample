// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';

export const verticalNavigationBarStyle = () => {
  return StyleSheet.create({
    verticalNavBar: {
      height: '100%',
      justifyContent: 'center',
      position: 'absolute',
      minWidth: COMMON_STYLES.sidebarWidth,
    },
    verticalNavBarContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      marginLeft: 55,
    },
    verticalNavBarLogo: {
      alignSelf: 'center',
      marginTop: 30,
    },
  });
};
