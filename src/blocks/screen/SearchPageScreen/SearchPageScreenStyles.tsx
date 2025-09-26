// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { WrapperLayout } from '../../constants/layouts';
import { scaleUxToDp } from '../../helpers/pixelUtils';

export function getSearchPageScreenStyles(wrapperLayout: WrapperLayout) {
  return StyleSheet.create({
    searchPageContainer: {
      marginTop: wrapperLayout === 'narrow' ? 0 : scaleUxToDp(150),
      marginLeft:
        wrapperLayout === 'narrow' ? COMMON_STYLES.contentLeftMarginNarrow : 0,
      paddingHorizontal:
        wrapperLayout === 'wide'
          ? COMMON_STYLES.contentLeftPaddingWide
          : COMMON_STYLES.contentLeftPaddingNarrow,
      paddingVertical: 68,
      height: '100%',
    },
    searchPageScreenWrapper: {
      display: 'flex',
      flex: 1,
    },
  });
}
