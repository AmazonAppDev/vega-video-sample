// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { MediaItem } from '../../types';

export interface MediaItemEventData {
  playlistName: string;
  mediaItem: MediaItem;
}
