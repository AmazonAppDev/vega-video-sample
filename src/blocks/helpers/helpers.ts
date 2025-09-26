// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { DEFAULT_ERROR, NETWORK_ERROR } from '../constants/messages';
import { COLORS } from '../styles/Colors';
import { KeplerBlocksError, MediaPlaylist } from '../types';

import { MediaContentLayout } from '../constants/layouts';

const INVALID_FORMATTED_TIME = '--:--';

export const convertSecondsToFormattedTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity) {
    return INVALID_FORMATTED_TIME;
  }
  const hours = `${Math.floor(seconds / (60 * 60))}`.padStart(2, '0');
  const minutes = `${Math.floor((seconds / 60) % 60)}`.padStart(2, '0');
  const secondsLeft = `${Math.floor(seconds % 60)}`.padStart(2, '0');

  if (hours === '00') {
    return `${minutes}:${secondsLeft}`;
  } else {
    return `${hours}:${minutes}:${secondsLeft}`;
  }
};
export const getLayout = (
  data: MediaPlaylist[] | undefined,
): MediaContentLayout => {
  if (data?.length === 1) {
    return 'grid';
  }
  return 'shoveler';
};

export const calculateProgressPercentage = (
  duration: number,
  progress: number,
) => {
  if (isNaN(duration) || duration === Infinity || duration === 0) {
    return 100;
  }
  return (progress / duration) * 100;
};

export const getErrorMessage = (error?: KeplerBlocksError) => {
  return error?.type === 'NETWORK'
    ? NETWORK_ERROR
    : error?.message || DEFAULT_ERROR;
};

export type ImageAspectRatios = 'square' | 'widescreen' | undefined;

/**
 * Returns the aspect ratio fraction in the Y direction associated with the given aspect ratio name.
 * @param aspectRatio
 */
export const getImageYRatio = (aspectRatio: ImageAspectRatios): number => {
  switch (aspectRatio) {
    case 'square':
      return 1;
    case 'widescreen':
      return 9 / 16;
    default:
      return 1;
  }
};

export const generateImageSources = (backgroundImageUri?: string) => {
  if (backgroundImageUri) {
    return { enabled: { uri: backgroundImageUri } };
  }
};

export const generateColorOverlayStyle = (
  backgroundImageUri?: string,
  backgroundColor?: string,
) => {
  if (backgroundImageUri) {
    return { backgroundColor: backgroundColor || COLORS.WHITE, opacity: 0 };
  }
};

export const generateBackgroundStyle = (
  backgroundImageUri?: string,
  backgroundColor?: string,
  backgroundColorOverlay?: boolean,
) => {
  if (!backgroundImageUri) {
    return {
      backgroundColor: backgroundColor || COLORS.WHITE,
      opacity: backgroundColorOverlay ? 0.7 : 1,
    };
  }
};
