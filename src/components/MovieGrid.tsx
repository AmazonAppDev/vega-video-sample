// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useReportFullyDrawn } from '@amazon-devices/kepler-performance-api';
import { useTheme } from '@amazon-devices/kepler-ui-components';
import { useHideSplashScreenCallback } from '@amazon-devices/react-native-kepler';
import { FlashList } from '@amazon-devices/shopify__flash-list';
import React, { memo, RefObject, useCallback, useMemo, useRef } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import MovieCarousel from '../components/MovieCarousel';
import { getVerticalCardDimensionsMd } from '../styles/ThemeAccessors';
import { MovieGridData } from '../types/MovieGridData';
import { TitleData } from '../types/TitleData';

/**
 * MovieGrid Component Documentation
 *
 * The MovieGrid is a high-performance, scrollable grid component that displays multiple rows of movie content.
 * Each row contains a horizontal carousel of movie tiles. This component is optimized for both TV and mobile
 * platforms and includes performance features like lazy loading and Time to Fully Drawn reporting.
 *
 * Key Features:
 * - Vertical scrolling list of horizontal movie carousels
 * - Platform-specific optimizations (TV vs Mobile)
 * - Performance monitoring with Time to Fully Drawn metrics
 * - Focus management for TV navigation
 * - Lazy loading for optimal memory usage
 *
 * Usage Example:
 * ```tsx
 * const movieData = [
 *   {
 *     heading: "Popular Movies",
 *     testID: "popular-movies",
 *     data: () => popularMoviesArray
 *   },
 *   {
 *     heading: "New Releases",
 *     testID: "new-releases",
 *     data: () => newReleasesArray
 *   }
 * ];
 *
 * <MovieGrid
 *   data={movieData}
 *   testID="home-movie-grid"
 *   onTileFocus={(title, rowIndex) => console.log('Focused:', title?.name)}
 *   onTileBlur={(title) => console.log('Blurred:', title?.name)}
 *   initialColumnsToRender={4}
 * />
 * ```
 */

/**
 * Props interface for the MovieGrid component
 */
interface MovieGridProps {
  /**
   * Array of movie grid data objects. Each object represents a row in the grid.
   * Each row contains a heading and a function that returns movie data.
   *
   * Example:
   * ```tsx
   * [{
   *   heading: "Popular Movies",
   *   testID: "popular-movies",
   *   data: () => getPopularMovies()
   * }]
   * ```
   */
  data: MovieGridData[];

  /**
   * Number of columns to render initially for performance optimization.
   * Higher numbers show more content immediately but may impact initial load time.
   * Recommended: 3-6 for most use cases.
   *
   * @default undefined (FlashList determines automatically)
   */
  initialColumnsToRender?: number;

  /**
   * Callback fired when a movie tile receives focus (important for TV navigation).
   * Receives the focused title data and the row index.
   *
   * @param title - The movie/title data that received focus
   * @param rowIndex - The index of the row containing the focused tile (0-based)
   */
  onTileFocus?: (title?: TitleData, rowIndex?: number) => void;

  /**
   * Callback fired when a movie tile loses focus.
   * Useful for cleaning up UI states or analytics tracking.
   *
   * @param title - The movie/title data that lost focus
   */
  onTileBlur?: (title?: TitleData) => void;

  /**
   * Unique identifier for testing purposes. Used by automated tests to locate this component.
   * Should be descriptive and unique within the screen.
   *
   * Example: "home-movie-grid", "search-results-grid"
   */
  testID: string;

  /**
   * Optional navigation destinations configuration.
   * Currently not actively used in the component but reserved for future navigation features.
   */
  destinations?: Record<string, any>;
}

// Performance constants
/** The row index at which we report "fully drawn" for performance metrics */
const ROW_INDEX_TO_FULLY_DRAWN = 1;
/** Number of rows typically visible on screen at once */
const ROWS_SHOWN_ON_SCREEN = 2;

/**
 * MovieGrid Component
 *
 * A performant, scrollable grid of movie carousels optimized for both TV and mobile platforms.
 * Uses FlashList for efficient rendering of large datasets and includes built-in performance monitoring.
 *
 * Platform Differences:
 * - TV: Disables horizontal scrolling within carousels, relies on focus navigation
 * - Mobile: Enables horizontal scrolling within carousels for touch interaction
 *
 * Performance Features:
 * - Reports "Time to Fully Drawn" metrics when the second row is rendered
 * - Automatically hides splash screen when content is ready
 * - Uses FlashList for efficient memory usage with large datasets
 * - Supports lazy loading with initialColumnsToRender
 */
const MovieGrid = React.forwardRef<View, MovieGridProps>(
  ({ data, initialColumnsToRender, onTileFocus, onTileBlur, testID }, ref) => {
    // Platform detection for conditional behavior
    const isTV = Platform.isTV || false;

    // Performance monitoring hooks
    // This callback emits the trace needed for the calculation of Time to Fully Drawn KPI
    const reportFullyDrawnCallback = useReportFullyDrawn();

    // This callback hides the Splash Screen programmatically when the app is ready to use
    const hideSplashScreenCallback = useHideSplashScreenCallback();

    // Prevent multiple "fully drawn" reports
    const hasReportedFullyDrawn = useRef(false);

    // Theme and styling
    const theme = useTheme();

    // Memoized card dimensions to prevent unnecessary recalculations
    const cardDimensionsInner = useMemo(
      () => getVerticalCardDimensionsMd(theme),
      [theme],
    );

    /**
     * Reports that the component is fully drawn and ready for user interaction.
     * This is called when the second row is rendered, indicating the main content is visible.
     * Only reports once to avoid duplicate metrics.
     */
    const reportFullyDrawn = useCallback(() => {
      if (!hasReportedFullyDrawn.current) {
        hideSplashScreenCallback();
        reportFullyDrawnCallback();
        hasReportedFullyDrawn.current = true;
      }
    }, [hideSplashScreenCallback, reportFullyDrawnCallback]);

    /**
     * Handles focus events from individual carousel tiles.
     * Wraps the external onTileFocus callback to include row index information.
     *
     * @param rowIndex - The index of the row containing the focused tile
     * @param title - The movie/title data that received focus
     */
    const handleCarouselTileFocus = useCallback(
      (rowIndex: number, title?: TitleData) => {
        onTileFocus?.(title, rowIndex);
      },
      [onTileFocus],
    );

    const renderCarousel = useCallback(
      (item: MovieGridData, index: number) => (
        <ScrollView
          key={`movie_carousel_${item.testID}`}
          horizontal={isTV ? false : true}
          scrollEnabled={Platform.isTV ? false : true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          nestedScrollEnabled={false}>
          <MovieCarousel
            heading={item.heading}
            data={item.data()}
            testID={`${item.testID}`}
            row={index}
            reportFullyDrawn={
              index === ROW_INDEX_TO_FULLY_DRAWN ? reportFullyDrawn : undefined
            }
            initialColumnsToRender={initialColumnsToRender}
            cardDimensions={cardDimensionsInner}
            onTileFocus={(title) => handleCarouselTileFocus(index, title)}
            onTileBlur={onTileBlur}
            firstElementRef={index === 0 ? (ref as RefObject<View>) : null}
            isPriorityRow={index < ROWS_SHOWN_ON_SCREEN}
            isLastItem={index === data.length - 1}
          />
        </ScrollView>
      ),
      [
        cardDimensionsInner,
        data.length,
        handleCarouselTileFocus,
        initialColumnsToRender,
        isTV,
        onTileBlur,
        ref,
        reportFullyDrawn,
      ],
    );

    return (
      <View style={styles.scrollView}>
        <FlashList
          testID={testID}
          data={data}
          renderItem={({ item, index }) => renderCarousel(item, index)}
          keyExtractor={(item) => item.testID}
          estimatedItemSize={cardDimensionsInner.height}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },

  carouselContainer: {
    paddingHorizontal: 8, // Add padding for horizontal scroll
  },
});

export default memo(MovieGrid);
