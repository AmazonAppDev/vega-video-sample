// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet, useWindowDimensions } from 'react-native';

import { scaleUxToDp } from '../../helpers/pixelUtils';
import { COLORS } from '../../styles/Colors';
import { MEDIA_ITEM_TILE_PADDING_LEFT } from '../MediaItemTile/useMediaItemTileStyle';

// percentage of dimension (e.g. of 1080) that shoveler item should use
const FEATURED_SHOVELER_MULTIPLER = 0.65;
const NON_FEATURED_SHOVELER_MULTIPLER = 0.45;

const FEATURED_SHOVELER_SQUARE_MULTIPLER = 0.35;
const NON_FEATURED_SHOVELER_SQUARE_MULTIPLER = 0.25;

export function useMediaItemShovelerStyle(
  isFeatured: boolean,
  aspectRatio?: 'widescreen' | 'square',
) {
  const { height, width } = useWindowDimensions();
  const SMALLER_DIMENSION = Math.min(height, width);
  const LIST_ITEM_WIDTH =
    SMALLER_DIMENSION *
    (isFeatured
      ? aspectRatio === 'square'
        ? FEATURED_SHOVELER_SQUARE_MULTIPLER
        : FEATURED_SHOVELER_MULTIPLER
      : aspectRatio === 'square'
      ? NON_FEATURED_SHOVELER_SQUARE_MULTIPLER
      : NON_FEATURED_SHOVELER_MULTIPLER);

  return {
    listItemWidth: LIST_ITEM_WIDTH,
    mediaTileWidth: LIST_ITEM_WIDTH + MEDIA_ITEM_TILE_PADDING_LEFT * 2,
    style: StyleSheet.create({
      playlistName: {
        fontSize: 28,
        color: COLORS.WHITE,
        paddingLeft: scaleUxToDp(30),
        paddingTop: scaleUxToDp(25),
        marginBottom: scaleUxToDp(10),
        alignSelf: 'flex-start',
      },
    }),
  };
}
