// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { TextStyle } from 'react-native';
import { scaleUxToDp } from '../helpers/pixelUtils';
import { COLORS } from '../styles/Colors';

export const COMMON_STYLES = {
  contentLeftPaddingWide: scaleUxToDp(100),
  contentLeftPaddingNarrow: scaleUxToDp(160),
  contentLeftMarginNarrow: scaleUxToDp(60),
  headerHeight: scaleUxToDp(160),
  sidebarWidth: scaleUxToDp(190),
  mediaItemTileSeparator: scaleUxToDp(28),
  gridListItemWidth: scaleUxToDp(370),
  gridContentLeftPaddingNarrow: scaleUxToDp(105),
  searchInputContainerWidth: scaleUxToDp(856),
  featuredShovelerAdditionalHeight: scaleUxToDp(110),
  logoSize: scaleUxToDp(100),
  maxLinesLarge: 2,
  maxLinesShort: 1,
};
export const PRIMARY_TEXT_STYLE = {
  fontSize: scaleUxToDp(24),
  lineHeight: 38,
  fontWeight: '500',
  color: COLORS.GRAY,
  textAlign: 'left',
} as TextStyle;
