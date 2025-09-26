import { useEffect, useRef, useState } from 'react';
import { TitleData } from '../types/TitleData';

/**
 * Props for the useCarouselData hook
 */
interface UseCarouselDataProps {
  /** Array of title data to display in the carousel */
  data: TitleData[];
  /** Whether this is a priority row that should load faster (default: false) */
  isPriorityRow?: boolean;
  /** Number of tiles to render initially for priority rows (default: 5) */
  initialTilesToRender?: number;
  /** Callback function to report when the carousel is fully drawn */
  reportFullyDrawn?: () => void;
}

/**
 * useCarouselData Hook
 *
 * A React hook that manages progressive loading of carousel data to optimize performance.
 * This hook implements a smart loading strategy where priority rows load faster with
 * initial tiles, while non-priority rows have a slight delay to prevent UI blocking.
 *
 * ## How it works:
 * 1. **Priority Rows**: Load a few tiles immediately (default: 5), then load the rest after 100ms
 * 2. **Regular Rows**: Load all tiles after a 300ms delay to stagger rendering
 * 3. **Performance Tracking**: Optionally reports when fully loaded for performance metrics
 *
 * ## Use Cases:
 * - Movie/TV show carousels that need to load quickly
 * - Content grids where the first row should appear faster
 * - Any list component that benefits from progressive loading
 *
 * ## Example Usage:
 * ```tsx
 * const { visibleData, isFullyLoaded } = useCarouselData({
 *   data: movieList,
 *   isPriorityRow: true, // This row loads faster
 *   initialTilesToRender: 3, // Show 3 tiles immediately
 *   reportFullyDrawn: () => console.log('Carousel fully loaded!')
 * });
 *
 * return (
 *   <div>
 *     {visibleData.map(movie => <MovieTile key={movie.id} data={movie} />)}
 *     {!isFullyLoaded && <LoadingSpinner />}
 *   </div>
 * );
 * ```
 *
 * @param props - Configuration object for the carousel data loading
 * @returns Object containing visibleData array and isFullyLoaded boolean
 */
export const useCarouselData = ({
  data,
  isPriorityRow = false,
  initialTilesToRender = 5,
  reportFullyDrawn,
}: UseCarouselDataProps) => {
  // State to track which data items are currently visible/rendered
  const [visibleData, setVisibleData] = useState<TitleData[]>([]);

  // State to track if all data has been loaded and rendered
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // Ref to track if component is still mounted (prevents memory leaks)
  const isMounted = useRef(false);

  // Ref to store timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;

    if (isPriorityRow) {
      // PRIORITY ROW STRATEGY:
      // 1. Immediately show the first few tiles for faster perceived loading
      setVisibleData(data.slice(0, initialTilesToRender));

      // 2. After 100ms, load the remaining tiles
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setVisibleData(data); // Show all data
          setIsFullyLoaded(true);

          // Report performance metric for TTFD (Time To Fully Drawn)
          // This helps track how long it takes for the carousel to fully render
          if (reportFullyDrawn) {
            reportFullyDrawn();
          }
        }
      }, 100);
    } else {
      // REGULAR ROW STRATEGY:
      // Wait 300ms before loading to stagger rendering and prevent UI blocking
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setVisibleData(data); // Show all data at once
          setIsFullyLoaded(true);
        }
      }, 300);
    }

    // Cleanup function to prevent memory leaks and race conditions
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, isPriorityRow, initialTilesToRender, reportFullyDrawn]);

  // Return the current state for the consuming component
  return {
    /** Array of title data that should currently be rendered */
    visibleData,
    /** Boolean indicating if all data has been loaded and is visible */
    isFullyLoaded,
  };
};
