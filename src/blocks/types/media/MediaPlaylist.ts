// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { MediaItem } from './MediaItem';

/**
 * List of grouped media items
 */
export interface MediaPlaylist {
  /**
   * Name for the playlist
   */
  playlistName: string;

  /**
   * Media items contained in the playlist
   */
  medias: MediaItem[];
}
