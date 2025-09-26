// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { getImageYRatio, ImageAspectRatios } from '../../helpers';
import { scaleUxToDp } from '../../helpers/pixelUtils';
import { COLORS } from '../../styles/Colors';

const MEDIA_ITEM_TILE_BORDER = 3;

export const MEDIA_ITEM_TILE_PADDING_LEFT = scaleUxToDp(
  (COMMON_STYLES.mediaItemTileSeparator + MEDIA_ITEM_TILE_BORDER * 2) / 2,
);

export function useMediaItemTileStyle(
  listItemWidth: number,
  aspectRatio: ImageAspectRatios,
) {
  return {
    imageSizes: {
      imageHeight: getImageYRatio(aspectRatio) * listItemWidth,
      imageWidth: listItemWidth + scaleUxToDp(MEDIA_ITEM_TILE_BORDER),
    },
    style: StyleSheet.create({
      cardWrapper: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        minWidth:
          listItemWidth + scaleUxToDp(COMMON_STYLES.mediaItemTileSeparator),
        height: getImageYRatio(aspectRatio) * listItemWidth + 180,
        alignSelf: 'center',
      },
      cardImage: {
        borderRadius: 0,
      },
      focusedCardImage: {
        padding: 0,
        borderColor: COLORS.WHITE,
        borderRadius: 0,
        borderWidth: scaleUxToDp(MEDIA_ITEM_TILE_BORDER),
      },
      cardTitle: {
        fontSize: 24,
        fontWeight: '400',
        color: COLORS.SILVER,
      },
      focusedCardTitle: {
        color: COLORS.WHITE,
      },
    }),
  };
}
