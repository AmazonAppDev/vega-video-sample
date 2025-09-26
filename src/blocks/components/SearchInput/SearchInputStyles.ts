// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { COLORS } from '../../styles/Colors';

export const searchInputStyles = () => {
  return StyleSheet.create({
    inputContainer: {
      minHeight: 64,
      width: COMMON_STYLES.searchInputContainerWidth,
      borderRadius: 22,
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 18,
      marginBottom: 40,
      flexDirection: 'row',
    },
    imageSearch: {
      width: 28,
      height: 28,
      marginRight: 22,
    },
    textInput: {
      flex: 1,
      fontSize: 28,
      color: COLORS.WHITE,
    },
  });
};
