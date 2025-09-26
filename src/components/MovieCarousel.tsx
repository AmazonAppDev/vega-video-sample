// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * MovieCarousel Component
 *
 * A horizontal scrolling carousel that displays a row of movie/video tiles with a heading.
 * This component is optimized for TV/streaming interfaces and supports focus navigation,
 * lazy loading, and responsive scaling.
 *
 * Key Features:
 * - Horizontal scrolling with smooth animations
 * - Focus-based navigation (great for TV remotes)
 * - Lazy loading for performance optimization
 * - Responsive tile sizing
 * - Accessibility support with proper test IDs
 *
 * Common Use Cases:
 * - "Continue Watching" rows
 * - "Recommended for You" sections
 * - Genre-based movie collections
 * - Featured content carousels
 *
 * Example Usage:
 * ```tsx
 * <MovieCarousel
 *   heading="Continue Watching"
 *   data={movieList}
 *   cardDimensions={{ width: 200, height: 300 }}
 *   onTileFocus={(movie) => console.log('Focused:', movie?.title)}
 *   testID="continue-watching-carousel"
 * />
 * ```
 */

import {
  Carousel,
  CarouselRenderInfo,
  ItemInfo,
  Typography,
} from '@amazon-devices/kepler-ui-components';
import isEqual from 'lodash/isEqual';
import React, { memo, RefObject, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCarouselData } from '../hooks/useCarouselData';
import { COLORS } from '../styles/Colors';
import { TitleData } from '../types/TitleData';
import { scaleUxToDp } from '../utils/pixelUtils';
import VideoTile from './VideoTile';

/**
 * Props for the MovieCarousel component
 */
interface MovieCarouselProps {
  /** The title/heading displayed above the carousel (e.g., "Continue Watching", "Action Movies") */
  heading: String;

  /** Optional row number for tracking purposes (useful for analytics) */
  row?: number;

  /** Array of movie/video data to display in the carousel */
  data: TitleData[];

  /** Callback fired when the carousel is fully rendered (used for performance tracking) */
  reportFullyDrawn?: () => void;

  /** Number of tiles to render initially for performance optimization (default: 5) */
  initialColumnsToRender?: number;

  /** Size of each movie tile in pixels { width: 200, height: 300 } */
  cardDimensions: { width: number; height: number };

  /** Callback when a tile receives focus (useful for updating background or showing details) */
  onTileFocus?: (title?: TitleData) => void;

  /** Callback when a tile loses focus */
  onTileBlur?: (title?: TitleData) => void;

  /** Reference to the first focusable element (for accessibility and navigation) */
  firstElementRef?: RefObject<View> | null;

  /** Test ID for automated testing (e.g., "home-carousel-1") */
  testID?: string;

  /** Whether this row should load immediately (true for above-the-fold content) */
  isPriorityRow?: boolean;

  /** Whether this is the last carousel on the page (affects bottom margin) */
  isLastItem?: boolean;
}

// Visual spacing constants - these control the layout and feel of the carousel
const cardVerticalMargin = scaleUxToDp(2); // Small vertical margin around each tile

const SPACING = {
  itemPadding: scaleUxToDp(12), // Space between each movie tile
  firstItemOffset: scaleUxToDp(50), // Left margin to align with other UI elements
};

/**
 * MovieCarousel Component
 *
 * Renders a horizontal scrolling row of movie tiles with optimized performance.
 * Handles focus management, lazy loading, and responsive behavior.
 */
const MovieCarousel = ({
  data,
  heading,
  row,
  cardDimensions,
  reportFullyDrawn,
  onTileFocus,
  onTileBlur,
  firstElementRef,
  testID,
  isPriorityRow = false,
  initialColumnsToRender = 5,
  isLastItem = false,
}: MovieCarouselProps) => {
  // Custom hook that handles data optimization and lazy loading
  // Only renders visible tiles + a few extra for smooth scrolling
  const { visibleData } = useCarouselData({
    data,
    isPriorityRow,
    initialTilesToRender: initialColumnsToRender,
    reportFullyDrawn,
  });

  // Handles when a tile receives focus (e.g., user navigates with remote/keyboard)
  // This is where you might trigger background updates or detail panels
  const onCarouselTileInFocus = useCallback(
    (title: TitleData | undefined) => {
      if (onTileFocus) {
        onTileFocus(title);
      }
    },
    [onTileFocus],
  );

  // Renders each individual movie tile in the carousel
  // Memoized for performance - only re-renders when dependencies change
  const ItemView = useCallback(
    ({ item, index }: CarouselRenderInfo<TitleData>): JSX.Element => {
      return (
        <VideoTile
          row={row}
          index={index}
          data={item}
          onFocus={(title: TitleData | undefined) =>
            onCarouselTileInFocus(title)
          }
          onBlur={onTileBlur}
          firstElementRef={firstElementRef}
        />
      );
    },
    [firstElementRef, onCarouselTileInFocus, onTileBlur, row],
  );

  // Configuration for the carousel's item dimensions
  // Includes padding so tiles don't touch each other
  const viewInfos: ItemInfo[] = useMemo(
    () => [
      {
        view: ItemView,
        dimension: {
          width: cardDimensions.width + SPACING.itemPadding * 2, // Add padding to width
          height: cardDimensions.height,
        },
      },
    ],
    [ItemView, cardDimensions],
  );

  // Required by the Carousel component - returns the item renderer
  const getItemForIndex = useCallback(() => ItemView, [ItemView]);

  // Dynamic styles based on props - computed once and memoized for performance

  // Removes bottom margin for the last carousel to prevent extra spacing
  const computedStyleMargin = useMemo(() => {
    return StyleSheet.create({
      lastItem: {
        marginBottom: isLastItem ? 0 : scaleUxToDp(20),
      },
    });
  }, [isLastItem]);

  // Sets the carousel container height based on tile dimensions
  const computedStyle = useMemo(() => {
    return StyleSheet.create({
      listView: {
        height: cardDimensions.height + cardVerticalMargin * 2,
      },
    });
  }, [cardDimensions.height]);

  return (
    <View nativeID="carousel-container" testID={testID}>
      {/* Carousel heading/title */}
      <Typography
        variant="body"
        style={[styles.heading, { marginLeft: SPACING.firstItemOffset }]}>
        {heading}
      </Typography>

      {/* Main carousel container */}
      <View style={[styles.carouselContainer, computedStyleMargin.lastItem]}>
        {visibleData.length > 0 && (
          <Carousel
            testID={`carousel-${testID}-${heading}`}
            containerStyle={computedStyle.listView}
            data={visibleData}
            orientation="horizontal"
            itemDimensions={viewInfos}
            itemPadding={SPACING.itemPadding}
            renderItem={ItemView}
            getItemForIndex={getItemForIndex}
            keyProvider={(item, index) => `${item.title}-${index}`} // Unique key for each tile
            focusIndicatorType="fixed" // Shows focus outline for TV navigation
            firstItemOffset={SPACING.firstItemOffset} // Aligns with heading
            itemSelectionExpansion={{
              widthScale: 1.1, // Grows 10% when focused
              heightScale: 1.1, // Creates nice hover/focus effect
            }}
            itemScrollDelay={0.3} // Smooth scrolling animation duration
          />
        )}
      </View>
    </View>
  );
};

// Static styles for the carousel layout
const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
    paddingBottom: scaleUxToDp(35), // Space between carousel rows
  },
  heading: {
    fontSize: scaleUxToDp(25), // Large, readable text
    color: COLORS.LIGHT_GRAY, // Subtle color that doesn't compete with tiles
    padding: 0,
    margin: 0,
    paddingBottom: scaleUxToDp(10), // Space between heading and tiles
  },
});

/**
 * Performance optimization: Only re-render the carousel when these specific props change
 * This prevents unnecessary re-renders when parent components update other unrelated state
 *
 * We check:
 * - data: The movie list (most common change)
 * - row: Row position (affects analytics)
 * - isPriorityRow: Loading priority (affects performance)
 */
const areMovieCarouselPropsEqual = (
  prevProps: MovieCarouselProps,
  nextProps: MovieCarouselProps,
) => {
  return (
    isEqual(prevProps.data, nextProps.data) &&
    prevProps.row === nextProps.row &&
    prevProps.isPriorityRow === nextProps.isPriorityRow
  );
};

// Export the memoized component for optimal performance
export default memo(MovieCarousel, areMovieCarouselPropsEqual);
