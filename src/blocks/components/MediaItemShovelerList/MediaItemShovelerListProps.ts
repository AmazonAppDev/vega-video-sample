// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ViewStyle } from 'react-native';
import { WrapperLayout } from '../../constants/layouts';
import { MediaPlaylist } from '../../types/media/MediaPlaylist';
import { MediaItemEventData } from '../MediaContent';
import { BaseMediaItemTileProps } from '../MediaItemTile/MediaItemTileProps';

export interface MediaItemShovelerListProps {
  playlists: MediaPlaylist[];
  wrapperLayout?: WrapperLayout;
  onItemFocused?: (mediaItemEventData: MediaItemEventData) => void;
  onItemSelected?: (
    mediaItemEventData: MediaItemEventData,
    viewRef?: any,
  ) => void;
  featuredCategory?: string;
  mediaItemStyleConfig?: BaseMediaItemTileProps;
  shovelerWrapperStyle?: ViewStyle;
}
