// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { scaleUxToDp } from '../../helpers/pixelUtils';
import { COLORS } from '../../styles/Colors';

export const searchResultsStyles = () => {
  return StyleSheet.create({
    searchResutsWrapper: {
      flex: 1,
    },
    searchResultsHeader: {
      position: 'absolute',
      width: '100%',
      height: COMMON_STYLES.headerHeight,
      marginBottom: 25,
      marginLeft: 25,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    backButtonWrapper: {
      marginHorizontal: scaleUxToDp(20),
      borderRadius: 25,
      width: 50,
      height: 50,
    },
    focusedBackButtonWrapper: {
      backgroundColor: COLORS.OFF_WHITE,
    },
    dotsWrapperView: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      tintColor: COLORS.WHITE,
      alignItems: 'center',
    },
    focusedBacIcon: {
      tintColor: COLORS.BLACK,
    },
    searchText: {
      color: 'white',
      marginTop: 20,
      fontSize: 28,
    },
    keywordWrapper: {
      height: 60,
      width: COMMON_STYLES.searchInputContainerWidth,
      borderRadius: 22,
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 18,
      flexDirection: 'row',
      backgroundColor: COLORS.DOVE_GRAY,
    },
    searchIcon: {
      width: 28,
      height: 28,
      marginRight: 22,
    },
    keywordText: {
      fontSize: 28,
      color: COLORS.WHITE,
    },
    keywordTextContent: {
      maxWidth: scaleUxToDp(760),
    },
    searchResultsContent: {
      flex: 1,
    },
    gridWrapperStyle: {
      marginTop: scaleUxToDp(180),
    },
  });
};
