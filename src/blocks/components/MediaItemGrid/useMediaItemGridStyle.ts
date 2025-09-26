// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { WrapperLayout } from '../../constants/layouts';
import { scaleUxToDp } from '../../helpers/pixelUtils';
import { COLORS } from '../../styles/Colors';

export function useMediaItemGridStyle(wrapperLayout?: WrapperLayout) {
  return {
    listItemWidth: COMMON_STYLES.gridListItemWidth,
    listItemHeight: scaleUxToDp(342),
    style: StyleSheet.create({
      gridWrapper: {
        flex: 1,
        justifyContent: 'center',
        marginLeft:
          wrapperLayout === 'narrow' ? scaleUxToDp(110) : scaleUxToDp(80),
        marginRight:
          wrapperLayout === 'narrow' ? scaleUxToDp(30) : scaleUxToDp(80),
        marginTop: scaleUxToDp(30),
      },
      gridTitle: {
        fontSize: 28,
        color: COLORS.WHITE,
        paddingLeft: scaleUxToDp(30),
        paddingTop: scaleUxToDp(25),
        marginBottom: scaleUxToDp(20),
        alignSelf: 'flex-start',
      },
      gridRecyclerListView: {
        width: '100%',
        minHeight: 1,
      },
    }),
  };
}
