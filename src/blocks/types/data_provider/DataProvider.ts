// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { MediaItem } from '../media/MediaItem';
import { MediaPlaylist } from '../media/MediaPlaylist';
import { DataProviderFilteringCriteria } from './DataProviderFilteringCriteria';

/**
 * DataProvider defines the methods that different data sources need to implement
 * in order to be integrated with kepler blocks.
 */
export interface DataProvider {
  /**
   * Returns an array of MediaPlaylist that contains the different media items (video, audio) to play in the app
   * without any filtering
   * @returns list of MediaPlaylist
   */
  getContent(): Promise<MediaPlaylist[]>;
  /**
   * Returns an array of MediaPlaylist that contains the different media items (video, audio) to play in the app
   * filtered by a DataProviderFilteringCriteria
   * @param dataProviderFilteringCriteria filtering criteria, for example containing a keyword
   * @returns list of MediaPlaylist
   */
  getContentByCriteria(
    dataProviderFilteringCriteria: DataProviderFilteringCriteria,
  ): Promise<MediaPlaylist[]>;
  /**
   * Given a playlist name and a MediaItem being rendered, it returns an array of MediaItem
   * related to the content that is being rendered
   * @param mediaItem MediaItem that is being rendered
   * @param playlistName the playlist the item being rendered belongs to
   * @returns list of related MediaItem
   */
  getRelatedContent(
    mediaItem: MediaItem,
    playlistName?: string,
  ): Promise<MediaItem[]>;
}
