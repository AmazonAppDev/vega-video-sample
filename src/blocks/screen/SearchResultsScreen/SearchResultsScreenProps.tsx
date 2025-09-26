// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DataProvider, DataProviderFilteringCriteria } from '../../types';

import { MediaItemEventData } from '../../components/MediaContent';
import { BaseMediaItemTileProps } from '../../components/MediaItemTile/MediaItemTileProps';

export interface SearchResultsScreenProps {
  /** URL for the background image source */
  backgroundImageUri?: string;
  /** Property that, in case of being true, applies a scrim to the background to make it easier to read the text displayed. */
  backgroundColorOverlay?: boolean;
  /** Color for the screen background in hexadecimal */
  backgroundColor?: string;
  /** Data provider where the search results are being fetched */
  dataProvider: DataProvider;
  /** Search keyword for the data provider */
  searchKeyword: DataProviderFilteringCriteria;
  /** Category being featured in the results  */
  featuredCategory?: string;
  /** Attribute containing configuration for media item style */
  mediaItemStyleConfig?: BaseMediaItemTileProps;
  /** When true and the view is a grid, the playlist name will be visible. */
  showPlaylistName?: boolean;
  /** Action that will run when one item receives the focus. */
  onItemFocused?: (mediaItemEventData: MediaItemEventData) => void;
  /** Action that will run when one item is selected. */
  onItemSelected?: (
    mediaItemEventData: MediaItemEventData,
    viewRef?: any,
  ) => void;
  /** Action that will run when the search page button is pressed. */
  onSearchPageButtonPressed?: () => void;
}
