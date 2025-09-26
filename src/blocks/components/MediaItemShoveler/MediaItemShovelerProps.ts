// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WrapperLayout } from '../../constants/layouts';
import { MediaItem } from '../../types';
import { BaseMediaItemTileProps } from '../MediaItemTile/MediaItemTileProps';

export interface MediaItemShovelerProps {
  items: MediaItem[];
  featured: boolean;
  showPlaylistName: boolean;
  playlistName: string;
  wrapperLayout?: WrapperLayout;
  onItemFocused?: (videoItem: MediaItem, index?: number) => void;
  onItemSelected?: (videoItem: MediaItem, viewRef?: any) => void;
  shovelerHeight?: number;
  mediaItemStyleConfig?: BaseMediaItemTileProps;
}
