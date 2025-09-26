// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Media item to be rendered in the app. At this moment we only support `video` items
 */
export interface MediaItem {
  /**
   * Id of the item
   */
  id: string;

  /**
   * The title of the particular media item
   */
  title: string;

  /**
   * Short description describing the media item typically a sentence in length.
   */
  description: string;

  /** Author from the item */
  author?: string;

  /** Mime type for the item @example video/mp4 */
  mimeType?: string;

  /** URL for a thumbnail representing the media */
  thumbnail?: string;

  /** Number of seconds the media item */
  duration?: number;

  /** Original air date of the item, if applicable (i.e, for series episodes) */
  releaseDate?: string;

  /** MPAA rating as a string (following https://en.wikipedia.org/wiki/Motion_Picture_Association_film_rating_system ) */
  mpaaRating?: string;

  /** Specifies the star rating for the title (0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0) */
  rating?: string;

  /**
   * Number of reviews for the item
   */
  reviewCount?: number;

  /**
   * Type of the item. For now only `video` is supported
   */
  mediaType: 'video'; // | 'audio';

  /**
   * Origin of the item. For now we only support `url`
   */
  mediaSourceType: 'url'; // | 'api'
}
