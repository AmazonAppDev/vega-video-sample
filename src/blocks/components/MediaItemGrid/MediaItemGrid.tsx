// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useMemo, useState } from 'react';
import {
  DataProvider,
  GridLayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { Text } from 'react-native';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { MediaItem } from '../../types';
import { MediaItemGridProps } from '../MediaItemGrid/MediaItemGridProps';
import { useMediaItemGridStyle } from '../MediaItemGrid/useMediaItemGridStyle';
import { MediaItemTile } from '../MediaItemTile';

const createGridLayoutProvider = (
  showDescription: boolean | undefined,
  height: number,
  numberOfColumns = 4,
) => {
  return new GridLayoutProvider(
    numberOfColumns,
    () => {
      return showDescription ? 1 : 0;
    },
    () => 1,
    () => {
      return showDescription
        ? height + COMMON_STYLES.mediaItemTileSeparator
        : height;
    },
  );
};

export const MediaItemGrid = ({
  items,
  showPlaylistName,
  playlistName = '',
  mediaItemStyleConfig,
  wrapperLayout,
  onItemFocused,
  onItemSelected,
  mediaItemTileColumnNumber,
  gridWrapperStyle,
}: MediaItemGridProps) => {
  const ITEM_FOCUS_SCALE = 1.03;
  const { style, listItemHeight, listItemWidth } =
    useMediaItemGridStyle(wrapperLayout);
  const [dataProvider] = useState(
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(items),
  );
  const layoutProvider = useMemo(
    () =>
      createGridLayoutProvider(
        mediaItemStyleConfig?.mediaItemTileShowDescription,
        listItemHeight,
        mediaItemTileColumnNumber,
      ),
    [
      listItemHeight,
      mediaItemStyleConfig?.mediaItemTileShowDescription,
      mediaItemTileColumnNumber,
    ],
  );

  const renderMediaTiles = (type: string | number, item: MediaItem) => {
    return (
      <MediaItemTile
        item={item}
        listItemWidth={listItemWidth}
        onItemFocused={(focusedItem: MediaItem) => {
          onItemFocused?.(focusedItem);
        }}
        onItemSelected={(selectedItem: MediaItem, viewRef?: any) => {
          onItemSelected?.(selectedItem, viewRef);
        }}
        mediaItemStyleConfig={mediaItemStyleConfig}
        itemFocusScale={ITEM_FOCUS_SCALE}
      />
    );
  };

  return (
    <TVFocusGuideView style={[style.gridWrapper, gridWrapperStyle]} autoFocus>
      {showPlaylistName && playlistName && (
        <Text style={style.gridTitle}>{playlistName}</Text>
      )}
      <RecyclerListView
        style={style.gridRecyclerListView}
        canChangeSize={true}
        rowRenderer={renderMediaTiles}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
      />
    </TVFocusGuideView>
  );
};
