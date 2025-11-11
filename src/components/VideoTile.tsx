// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { memo, RefObject, useCallback, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { focusManager } from '../utils/FocusManager';
import { areComponentPropsEqual } from '../utils/lodashHelper';

import {
  ContentIdNamespaces,
  ContentInteractionType,
  ContentPersonalizationServer,
} from '@amazon-devices/kepler-content-personalization';
import { Card } from '@amazon-devices/kepler-ui-components';
import { useNavigation } from '@amazon-devices/react-navigation__native';
import { isContentPersonalizationEnabled } from '../config/AppConfig';
import {
  getMockContentID,
  getMockContentInteraction,
} from '../personalization/mock/ContentPersonalizationMocks';
import { TitleData } from '../types/TitleData';
import { HomeScreenNavigationProps, Screens } from './navigation/types';

/**
 * VideoTile Component
 *
 * A reusable video content tile that displays a video thumbnail in a card format.
 * This component handles focus management, navigation to video details, and integrates
 * with content personalization for user interaction tracking.
 *
 * Key Features:
 * - Displays video thumbnail in a responsive card layout
 * - Handles keyboard/remote focus navigation (perfect for TV apps)
 * - Navigates to video details screen when pressed
 * - Tracks user interactions for content personalization
 * - Optimized performance with React.memo
 * - Special handling for the first tile in grids for focus management
 *
 * @example
 * // Basic usage in a video grid
 * <VideoTile
 *   index={0}
 *   data={{
 *     id: '123',
 *     title: 'My Video',
 *     thumbnail: 'https://example.com/thumb.jpg'
 *   }}
 *   onFocus={(title) => setFocusedTitle(title)}
 *   row={0}
 * />
 *
 * @example
 * // First tile with special focus reference
 * <VideoTile
 *   index={0}
 *   data={videoData}
 *   row={0}
 *   firstElementRef={firstTileRef}
 *   onFocus={handleTileFocus}
 *   onBlur={handleTileBlur}
 * />
 */

/**
 * Props for the VideoTile component
 */
export interface VideoTileProps {
  /**
   * Position index of this tile (0-based). Used for focus management
   * and identifying the first tile in a grid layout.
   */
  index: number;

  /**
   * Video content data containing title, thumbnail URL, and other metadata.
   * Must include at minimum: id, title, and thumbnail properties.
   */
  data: TitleData;

  /**
   * Optional callback fired when the tile receives focus.
   * Useful for updating preview content or UI state.
   * @param title - The video data for the focused tile
   */
  onFocus?: (title?: TitleData) => void;

  /**
   * Optional callback fired when the tile loses focus.
   * Useful for cleanup or resetting UI state.
   * @param title - The video data for the blurred tile
   */
  onBlur?: (title?: TitleData) => void;

  /**
   * Row index of this tile in a grid layout (0-based).
   * Used with index to identify the very first tile (index=0, row=0).
   */
  row?: number;

  /**
   * Reference to the first focusable element in the entire grid.
   * Only provide this for the first tile (index=0, row=0).
   * Required for proper focus restoration when returning from detail screens.
   */
  firstElementRef?: RefObject<any> | null;
}

const VideoTile = ({
  data,
  onFocus,
  onBlur,
  index,
  row,
  firstElementRef,
}: VideoTileProps) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const focusableElementRef = useRef<any>(null);

  /**
   * Reports content interaction to the personalization service when enabled.
   * This tracks when users navigate to video details for recommendation improvements.
   */
  const reportContentNavigation = useCallback(() => {
    // Only track interactions if content personalization is enabled in app config
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    const contentInteraction = getMockContentInteraction(
      ContentInteractionType.DETAIL_VIEW,
      getMockContentID(data.title, ContentIdNamespaces.NAMESPACE_CDF_ID),
    );
    console.info(
      `k_content_per: Reporting new content interaction. Accessing detailed information for selected title : ${data.title}`,
    );
    ContentPersonalizationServer.reportNewContentInteraction(
      contentInteraction,
    );
  }, [data.title]);

  /**
   * Handles focus restoration when returning from the details screen.
   * Ensures the correct tile regains focus based on its position in the grid.
   */
  const handleFocusOnBack = useCallback(
    (id: number | string) => {
      if (id === data.id) {
        // Special handling for the first tile (top-left) in the grid
        if (index === 0 && row === 0) {
          firstElementRef?.current?.requestTVFocus();
        } else {
          // Regular tiles use their own focus reference
          focusableElementRef.current?.requestTVFocus();
        }
      }
    },
    [data.id, firstElementRef, index, row],
  );

  /**
   * Navigates to the video details screen and reports the interaction.
   * Also sets up focus restoration callback for when user returns.
   */
  const navigateToDetailsScreen = useCallback(async () => {
    // Track user interaction for personalization
    reportContentNavigation();

    // Register focus restoration callback
    const focusKey = `tile_${data.id}`;
    focusManager.registerFocusCallback(focusKey, () => {
      handleFocusOnBack(data.id);
    });

    // Navigate to details screen
    navigation.push(Screens.DETAILS_SCREEN, {
      data: data,
      focusId: data.id, // Pass the ID for focus restoration instead of function
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, navigation, index, row, handleFocusOnBack]);

  /**
   * Handles focus events and calls the optional onFocus callback.
   */
  const onFocusHandler = useCallback(() => {
    // Call parent component's focus handler if provided
    onFocus?.(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  /**
   * Helper function to blur the first tile using its special reference.
   */
  const firstTileBlur = useCallback(() => {
    firstElementRef?.current?.blur();
  }, [firstElementRef]);

  /**
   * Handles blur events with special logic for the first tile.
   * Calls the optional onBlur callback after handling focus management.
   */
  const onBlurHandler = useCallback(() => {
    // Handle blur differently for first tile vs regular tiles
    if (index === 0 && row === 0) {
      firstTileBlur();
    } else {
      focusableElementRef.current?.blur();
    }
    // Call parent component's blur handler if provided
    onBlur?.(data);
  }, [data, firstTileBlur, index, onBlur, row]);

  return (
    <Animated.View
      ref={index === 0 && row === 0 ? firstElementRef : focusableElementRef}
      testID={`tileContainer${data.id}`}
      style={[styles.container]}
      // @ts-ignore - Animated.View doesn't have onFocus in types but supports it at runtime for TV navigation
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}>
      <Card
        orientation={'vertical'}
        size="md"
        testID={`card${data.id}`}
        onPress={navigateToDetailsScreen}>
        <Card.Image
          source={{
            uri: data.thumbnail,
          }}
          edgeToEdge
        />
      </Card>
    </Animated.View>
  );
};

/**
 * Custom comparison function for React.memo optimization.
 * Only re-renders the component when the video data actually changes,
 * improving performance in large video grids.
 */
const areVideoTilePropsEqual = (
  prevProps: VideoTileProps,
  nextProps: VideoTileProps,
) => {
  return areComponentPropsEqual(prevProps.data, nextProps.data);
};

// Export memoized component for better performance in video grids
export default memo(VideoTile, areVideoTilePropsEqual);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
