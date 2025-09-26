// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ViewStyle } from 'react-native';
import { WrapperLayout } from '../../constants/layouts';
import { MediaItem } from '../../types';
import { BaseMediaItemTileProps } from '../MediaItemTile/MediaItemTileProps';

export interface MediaItemGridProps {
  items: MediaItem[];
  showPlaylistName?: boolean;
  playlistName?: string;
  mediaItemTileColumnNumber: number;
  wrapperLayout?: WrapperLayout;
  onItemFocused?: (videoItem: MediaItem) => void;
  onItemSelected?: (videoItem: MediaItem, viewRef?: any) => void;
  mediaItemStyleConfig?: BaseMediaItemTileProps;
  gridWrapperStyle?: ViewStyle;
}
