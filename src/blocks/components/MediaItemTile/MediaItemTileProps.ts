// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { TextStyle } from 'react-native';
import { MediaItem } from '../../types/media/MediaItem';

export interface BaseMediaItemTileProps {
  /** When true, the description for each result item will be shown */
  mediaItemTileShowDescription?: boolean;
  /** When true, use rounded corners for the image */
  mediaItemTileImageRoundedCorner?: boolean;
  /** Aspect ratio to use for the image bounding box */
  mediaItemTileImageAspectRatio?: 'widescreen' | 'square';
}

export interface MediaItemTileProps {
  item: MediaItem;
  testID?: string | undefined;
  listItemWidth: number;
  onItemFocused?: (mediaItem: MediaItem, index?: number) => void;
  onItemSelected?: (mediaItem: MediaItem, viewRef?: any) => void;
  onItemBlurred?: () => void;
  itemFocusScale?: number;
  mediaItemStyleConfig?: BaseMediaItemTileProps;
  cardTitleStyle?: TextStyle;
}
