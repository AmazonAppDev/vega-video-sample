// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Carousel } from '@amazon-devices/kepler-ui-components';
import React, { useCallback } from 'react';
import { MediaItem, MediaPlaylist } from '../../types';

import { Text } from 'react-native';

import { View } from '@amazon-devices/react-native-kepler';
import { MediaItemShoveler } from '../MediaItemShoveler';
import { MediaItemShovelerListProps } from '../MediaItemShovelerList/MediaItemShovelerListProps';
import { BaseMediaItemTileProps } from '../MediaItemTile';
import { createItemShovelerListStyle } from './MediaItemShovelerListStyle';

const SHOVELER_WIDTH = 489 * 4; // 489 is the width of a single image
const FEATURED_SHOVELER_HEIGHT = 530;
const REGULAR_SHOVELER_HEIGHT = 410;

interface ShovelerWrapperProps {
  playlist: MediaPlaylist;
  onItemFocused?: (videoItem: MediaItem, index?: number) => void;
  onItemSelected?: (videoItem: MediaItem, viewRef?: any) => void;
  mediaItemStyleConfig?: BaseMediaItemTileProps;
  featured?: boolean;
}

const RegularShoveler = ({
  playlist,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
}: ShovelerWrapperProps) => {
  return (
    <MediaItemShoveler
      key={playlist.playlistName}
      items={playlist.medias}
      featured={false}
      showPlaylistName={true}
      playlistName={playlist.playlistName}
      mediaItemStyleConfig={mediaItemStyleConfig}
      shovelerHeight={REGULAR_SHOVELER_HEIGHT}
      onItemFocused={onItemFocused}
      onItemSelected={onItemSelected}
    />
  );
};

const FeaturedShoveler = ({
  playlist,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
}: ShovelerWrapperProps) => {
  return (
    <MediaItemShoveler
      key={playlist.playlistName}
      items={playlist.medias}
      featured={true}
      showPlaylistName={true}
      playlistName={playlist.playlistName}
      mediaItemStyleConfig={mediaItemStyleConfig}
      shovelerHeight={FEATURED_SHOVELER_HEIGHT}
      onItemFocused={onItemFocused}
      onItemSelected={onItemSelected}
    />
  );
};

const WrapperShoveler = ({
  playlist,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
  featured,
}: ShovelerWrapperProps) => {
  return featured ? (
    <FeaturedShoveler
      playlist={playlist}
      mediaItemStyleConfig={mediaItemStyleConfig}
      onItemFocused={onItemFocused}
      onItemSelected={onItemSelected}
    />
  ) : (
    <>
      <Text style={{ color: 'white', fontSize: 50 }} />
      <RegularShoveler
        playlist={playlist}
        mediaItemStyleConfig={mediaItemStyleConfig}
        onItemFocused={onItemFocused}
        onItemSelected={onItemSelected}
      />
    </>
  );
};

export const MediaItemShovelerList = ({
  playlists,
  featuredCategory,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
  wrapperLayout,
  shovelerWrapperStyle,
}: MediaItemShovelerListProps) => {
  const { style } = createItemShovelerListStyle(wrapperLayout);

  // featured category should always be the first one
  const getPlaylistsWithFeaturedFirst = React.useMemo(() => {
    return playlists.sort((a, b) => {
      if (a.playlistName === featuredCategory) {
        return -1;
      }
      if (b.playlistName === featuredCategory) {
        return 1;
      }
      return 0;
    });
  }, [playlists, featuredCategory]);

  const renderShoveler = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const playlist = item as MediaPlaylist;
      return (
        <WrapperShoveler
          featured={index === 0}
          playlist={playlist}
          mediaItemStyleConfig={mediaItemStyleConfig}
          onItemFocused={(videoItem: MediaItem) => {
            onItemFocused?.({
              playlistName: playlist.playlistName,
              mediaItem: videoItem,
            });
          }}
          onItemSelected={(videoItem: MediaItem, viewRef?: any) => {
            onItemSelected?.(
              {
                playlistName: playlist.playlistName,
                mediaItem: videoItem,
              },
              viewRef,
            );
          }}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const viewInfos = [
    {
      view: FeaturedShoveler,
      dimension: {
        width: SHOVELER_WIDTH,
        height: FEATURED_SHOVELER_HEIGHT,
      },
    },
    {
      view: RegularShoveler,
      dimension: {
        width: SHOVELER_WIDTH,
        height: REGULAR_SHOVELER_HEIGHT,
      },
    },
  ];

  const getViewForIndex = useCallback((index: number) => {
    return index === 0 ? FeaturedShoveler : RegularShoveler;
  }, []);

  return (
    <View style={[style.shovelerWrapper, shovelerWrapperStyle]}>
      <Carousel
        data={getPlaylistsWithFeaturedFirst}
        orientation={'vertical'}
        focusIndicatorType={'fixed'}
        itemDimensions={viewInfos}
        itemPadding={0}
        renderItem={renderShoveler}
        getItemForIndex={getViewForIndex}
        keyProvider={(item, index) => `${index}`}
      />
    </View>
  );
};
