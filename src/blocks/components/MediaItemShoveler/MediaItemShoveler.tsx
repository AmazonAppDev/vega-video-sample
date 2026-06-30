// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useCallback } from 'react';

import { Carousel, CarouselRenderInfo } from '@amazon-devices/vega-carousel';
import { Text } from 'react-native';
import { MediaItem } from '../../types';
import { MediaItemShovelerProps } from '../MediaItemShoveler';
import { useMediaItemShovelerStyle } from '../MediaItemShoveler/useMediaItemShovelerStyle';
import { MediaItemTile } from '../MediaItemTile';

const TILE_MARGIN_TOP_FEATURE = 190;
const TILE_MARGIN_TOP = 80;

export const MediaItemShoveler = ({
  items,
  featured,
  showPlaylistName,
  playlistName,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
}: MediaItemShovelerProps) => {
  const { listItemWidth, style } = useMediaItemShovelerStyle(
    featured,
    mediaItemStyleConfig?.mediaItemTileImageAspectRatio,
  );

  const getItem = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        return items[index];
      }
      return undefined;
    },
    [items],
  );

  const getItemCount = useCallback(() => {
    return items.length;
  }, [items]);

  const getItemKey = useCallback(
    (info: CarouselRenderInfo<MediaItem>) => {
      return `${playlistName}-${info.index}`;
    },
    [playlistName],
  );

  const notifyDataError = useCallback(() => {
    return false;
  }, []);

  const renderItem = useCallback(({ item }: CarouselRenderInfo<MediaItem>) => {
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
        dataAdapter={{
          getItem,
          getItemCount,
          getItemKey,
          notifyDataError,
        }}
        renderItem={renderItem}
        testID={'playlist_native_shoveler'}
        itemStyle={{
          itemPadding: 0,
          selectedItemScaleFactor: 1.1,
        }}
      />
    </>
  );
};
