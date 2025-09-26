// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { MediaItem } from '../../types';
import { MediaItemGrid } from '../MediaItemGrid';
import { MediaItemShovelerList } from '../MediaItemShovelerList';
import { MediaContentProps } from './MediaContentProps';
import { MediaItemEventData } from './MediaItemEventData';

export const MediaContent = ({
  playlists,
  layout,
  showPlaylistName,
  featuredCategory,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
  wrapperLayout,
  gridStyle,
  shovelerStyle,
}: MediaContentProps) => {
  if (layout === 'grid') {
    const playlist = playlists[0];
    return (
      <MediaItemGrid
        items={playlist.medias}
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
        mediaItemTileColumnNumber={4}
        showPlaylistName={showPlaylistName}
        playlistName={playlist.playlistName}
        mediaItemStyleConfig={mediaItemStyleConfig}
        wrapperLayout={wrapperLayout}
        gridWrapperStyle={gridStyle}
      />
    );
  }
  return (
    <MediaItemShovelerList
      playlists={playlists}
      featuredCategory={featuredCategory}
      mediaItemStyleConfig={mediaItemStyleConfig}
      onItemFocused={(mediaItemEventData: MediaItemEventData) => {
        onItemFocused?.(mediaItemEventData);
      }}
      onItemSelected={(
        mediaItemEventData: MediaItemEventData,
        viewRef?: any,
      ) => {
        onItemSelected?.(mediaItemEventData, viewRef);
      }}
      wrapperLayout={wrapperLayout}
      shovelerWrapperStyle={shovelerStyle}
    />
  );
};
