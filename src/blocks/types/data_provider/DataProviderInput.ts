// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { MediaItem } from '../media/MediaItem';
import { DataProviderFilteringCriteria } from './DataProviderFilteringCriteria';

interface GetContentDataProviderInput {
  type: 'getContent';
}
interface SearchByCriteriaDataProviderInput {
  type: 'search_by_criteria';
  searchCriteria: DataProviderFilteringCriteria;
}
interface GetRelatedContentDataProviderInput {
  type: 'get_related_content';
  mediaItem: MediaItem;
  playlistName?: string;
}
export type DataProviderInput =
  | GetContentDataProviderInput
  | SearchByCriteriaDataProviderInput
  | GetRelatedContentDataProviderInput;
