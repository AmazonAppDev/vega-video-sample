// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { MediaContentLayout, WrapperLayout } from '../../constants/layouts';

import { ViewStyle } from 'react-native';
import { MediaPlaylist } from '../../types/media/MediaPlaylist';
import { BaseMediaItemTileProps } from '../MediaItemTile/MediaItemTileProps';
import { MediaItemEventData } from './MediaItemEventData';

export interface MediaContentProps {
  playlists: MediaPlaylist[];
  layout: MediaContentLayout;
  featuredCategory?: string;
  showPlaylistName?: boolean;
  nextFocusLeftFirstItem?: number;
  disableNextFocusDown?: boolean;
  mediaItemTileColumnNumber?: number;
  wrapperLayout?: WrapperLayout;
  onItemFocused?: (mediaItemEventData: MediaItemEventData) => void;
  onItemSelected?: (
    mediaItemEventData: MediaItemEventData,
    viewRef?: any,
  ) => void;
  mediaItemStyleConfig?: BaseMediaItemTileProps;
  gridStyle?: ViewStyle;
  shovelerStyle?: ViewStyle;
}
