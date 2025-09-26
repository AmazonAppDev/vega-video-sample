// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useCallback } from 'react';

import { Carousel } from '@amazon-devices/kepler-ui-components';
import { Text } from 'react-native';
import { MediaItem } from '../../types';
import { MediaItemShovelerProps } from '../MediaItemShoveler';
import { useMediaItemShovelerStyle } from '../MediaItemShoveler/useMediaItemShovelerStyle';
import { MediaItemTile } from '../MediaItemTile';

const SHOVELER_DEFAULT_HEIGHT = 470;
const TILE_MARGIN_TOP_FEATURE = 190;
const TILE_MARGIN_TOP = 80;

export const MediaItemShoveler = ({
  items,
  featured,
  showPlaylistName,
  playlistName,
  mediaItemStyleConfig,
  shovelerHeight = SHOVELER_DEFAULT_HEIGHT,
  onItemFocused,
  onItemSelected,
}: MediaItemShovelerProps) => {
  const { mediaTileWidth, listItemWidth, style } = useMediaItemShovelerStyle(
    featured,
    mediaItemStyleConfig?.mediaItemTileImageAspectRatio,
  );
  const viewInfos = [
    {
      view: MediaItemTile,
      dimension: {
        width: mediaTileWidth,
        height: shovelerHeight,
      },
    },
  ];
  const getViewForIndex = useCallback(() => MediaItemTile, []);
  const renderItem = useCallback(({ item }: { item: MediaItem }) => {
    return (
      <MediaItemTile
        listItemWidth={listItemWidth}
        item={item}
        mediaItemStyleConfig={mediaItemStyleConfig}
        onItemSelected={(selectedItem: MediaItem, viewRef?: any) => {
          onItemSelected?.(selectedItem, viewRef);
        }}
        onItemFocused={onItemFocused}
        cardTitleStyle={
          featured
            ? { marginTop: TILE_MARGIN_TOP_FEATURE }
            : { marginTop: TILE_MARGIN_TOP }
        }
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showPlaylistName && playlistName && (
        <Text style={style.playlistName}>{playlistName}</Text>
      )}
      <Carousel
        data={items}
        renderItem={renderItem}
        itemDimensions={viewInfos}
        getItemForIndex={getViewForIndex}
        testID={'playlist_native_shoveler'}
        keyProvider={(item, index: number) => `${playlistName}-${index}`}
        itemPadding={0}
        itemSelectionExpansion={{
          widthScale: 1.1,
          heightScale: 1.1,
        }}
      />
    </>
  );
};
