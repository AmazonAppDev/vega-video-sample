/**
 * HomeScreen Component
 *
 * This is the main home screen of the streaming application that displays:
 * - A rotating banner/hero section at the top
 * - Multiple rows of movie/content grids below
 * - Content preview when items are focused (D-pad mode)
 * - Touch-optimized layout for touch devices
 *
 * The component handles different input methods (D-pad vs touch) and integrates
 * with various Kepler services for channel tuning, content personalization,
 * and account management.
 */

// Kepler Channel Services - Handle live TV channel functionality
import { ChannelServerComponent2 } from '@amazon-devices/kepler-channel';

// Content Personalization - Manages user preferences and recommendations
import {
  ContentPersonalizationServer,
  CustomerListType,
} from '@amazon-devices/kepler-content-personalization';
import {
  ContentLauncherServerComponent,
  ContentLauncherStatusType,
  IContentLauncherHandler,
  IContentSearch,
  ILaunchContentOptionalFields,
  ILauncherResponse,
} from '@amazon-devices/kepler-media-content-launcher';
import {
  IComponentInstance,
  IKeplerAppStateManager,
  useKeplerAppStateManager,
} from '@amazon-devices/react-native-kepler';
import {
  useFocusEffect,
  useIsFocused,
} from '@amazon-devices/react-navigation__core';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Event handling for live channel events
import { EventRegister } from 'react-native-event-listeners';

// Redux state management
import { useDispatch, useSelector } from 'react-redux';

// Account login functionality
import {
  AccountLoginWrapperInstance,
  onStartService as onStartAccountLoginService,
  onStopService as onStopAccountLoginService,
} from '../AccountLoginWrapper';

// UI Components
import ContentPreview from '../components/ContentPreview';
import MovieGrid from '../components/MovieGrid';
import {
  AppStackScreenProps,
  LiveChannelEventPayload,
  Screens,
} from '../components/navigation/types';
import { OptionType } from '../components/RadioPicker';
import AutoRotator from '../components/rotator/AutoRotator';
import { MovieRotatorGrid } from '../components/touchOptimized/MovieRotatorGrid';

// Configuration and feature flags
import {
  isAccountLoginEnabled,
  isContentPersonalizationEnabled,
  isDpadControllerSupported,
} from '../config/AppConfig';

// Constants and data sources
import { LoginStatus } from '../constants';
import { getClassics } from '../data/local/classics';
import { getLatestHits } from '../data/local/latestHits';
import { getNewHits } from '../data/local/newHits';
import { getPremiumCollection } from '../data/local/premiumCollection';
import { getRecommendations } from '../data/local/recommendations';
import { getRotator } from '../data/local/rotator';
import { getTrends } from '../data/local/trends';
import { tileData } from '../data/tileData';

// Live TV functionality
import channelTunerHandler from '../livetv/channelTunerHandler';
import { getMockedCurrentTitleDataForChannel } from '../livetv/mock/MockSource';

// Redux store slices
import { setCurrentFocus } from '../store/focus/focusSlice';
import {
  setCountryCode,
  settingsSelectors,
} from '../store/settings/SettingsSlice';

// Styling and utilities
import { COLORS } from '../styles/Colors';
import { MovieGridData } from '../types/MovieGridData';
import { TitleData } from '../types/TitleData';
import { areComponentPropsEqual } from '../utils/lodashHelper';
import { scaleUxToDp } from '../utils/pixelUtils';
import { getSelectedLocale } from '../utils/translationHelper';

// Data for the rotating banner/hero section at the top of the screen
const AutoRotatorData = getRotator();

/**
 * Configuration for movie grid rows displayed on the home screen
 * Each row represents a different category of content with:
 * - heading: Display name for the row
 * - testID: Identifier for automated testing
 * - data: Function that returns the content for that row
 */
const data: MovieGridData[] = [
  {
    heading: 'Latest Hits',
    testID: 'latest_hits',
    data: getLatestHits,
  },
  {
    heading: 'Classics',
    testID: 'classics',
    data: getClassics,
  },
  {
    heading: 'Recommendation',
    testID: 'recommendations',
    data: getRecommendations,
  },
  {
    heading: 'Premium Collection',
    testID: 'premium_collection',
    data: getPremiumCollection,
  },
  {
    heading: 'New hits',
    testID: 'new_hits',
    data: getNewHits,
  },
  {
    heading: 'Trends',
    testID: 'trends',
    data: getTrends,
  },
];

/**
 * Props interface for the HomeScreen component
 */
interface HomeProps {
  navigation: any;
}

/**
 * HomeScreen Component
 *
 * Main home screen that adapts its layout based on input method:
 * - D-pad mode: Shows content preview area + movie grid
 * - Touch mode: Shows combined rotator + movie grid that scrolls together
 */
const HomeScreen = ({
  navigation,
}: AppStackScreenProps<Screens.HOME_SCREEN>) => {
  // Redux hooks for state management
  const dispatch = useDispatch();
  const countryCode = useSelector(settingsSelectors.countryCode);

  // Local state for tracking the currently selected/focused title
  const [selectedTitle, setSelectedTitle] = useState<TitleData | undefined>(
    undefined,
  );

  // Reference to the first tile for focus management
  const firstTileRef = React.useRef<any>(null);

  // Event listener reference for cleanup
  let listener: string | boolean;

  // Delay before navigating to player screen (allows for smooth transitions)
  const NAVIGATION_DELAY = 700;

  // Initialize country code from locale if not already set
  if (!countryCode) {
    const selectedLocale = getSelectedLocale();
    if (selectedLocale) {
      dispatch(setCountryCode(selectedLocale as OptionType));
    }
  }

  /**
   * Refreshes the customer's watchlist data for personalization
   * Only executes if content personalization feature is enabled
   */
  const callCustomerListRefresh = () => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    console.log(
      '[ HomeScreen.tsx ] - callCustomerListRefresh - k_content_per: Calling Report Refreshed Customer List',
    );
    ContentPersonalizationServer.reportRefreshedCustomerList(
      CustomerListType.WATCHLIST,
    );
  };

  // Hook to track if this screen is currently focused/active
  const isFocused = useIsFocused();

  /**
   * Focus effect hook - runs when screen gains/loses focus
   * Updates the global focus state to track which screen is currently active
   */
  useFocusEffect(
    useCallback(() => {
      // Set this screen as the currently focused screen
      dispatch(
        setCurrentFocus({
          currentFocusedScreen: Screens.HOME_SCREEN,
        }),
      );

      // Cleanup function - clear focus state when screen loses focus
      return () => {
        dispatch(
          setCurrentFocus({
            currentFocusedScreen: '',
          }),
        );
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  /**
   * Refreshes content entitlements data for personalization
   * This updates what content the user has access to view
   */
  const callContentEntitlementsRefresh = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    console.log(
      '[ HomeScreen.tsx ] - callContentEntitlementsRefresh - k_content_per: Calling Report Refreshed Content Entitlements',
    );
    ContentPersonalizationServer.reportRefreshedContentEntitlements();
  }, []);

  /**
   * Refreshes playback events data for personalization
   * This updates the user's viewing history and preferences
   */
  const callPlaybackEventsRefresh = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    console.log(
      '[ HomeScreen.tsx ] - callPlaybackEventsRefresh - k_content_per: Calling Report Refreshed PlaybackEvents',
    );
    ContentPersonalizationServer.reportRefreshedPlaybackEvents();
  }, []);

  /**
   * Navigates to the player screen with optional live channel data
   *
   * @param payload - Optional live channel event data containing channel info
   *
   * Process:
   * 1. Waits for NAVIGATION_DELAY to ensure smooth transition
   * 2. Gets mocked EPG data for the channel (if live TV)
   * 3. Combines tile data with channel data
   * 4. Navigates to player screen with the combined data
   * 5. Records analytics event for the navigation
   */
  const navigateToPlayer = useCallback(
    (payload?: LiveChannelEventPayload) => {
      setTimeout(async () => {
        // Try to match the changeChannelResponseData with a specific EPG program
        const mockedData = await getMockedCurrentTitleDataForChannel(
          payload?.matchString ?? '',
        );

        // Combine base tile data with channel-specific data
        const videoData = { ...tileData, ...mockedData };

        // Prepare navigation parameters
        const params = {
          data: videoData,
          onChannelTuneSuccess: payload?.onChannelTuneSuccess,
          onChannelTuneFailed: payload?.onChannelTuneFailed,
        };

        try {
          // Navigate to player screen
          navigation.navigate(Screens.PLAYER_SCREEN, params);
        } catch {
          // If navigation fails, go back to previous screen
          navigation.goBack();
        }
      }, NAVIGATION_DELAY); // Delay simulates loading time for smooth UX
    },
    [navigation],
  );

  /**
   * Callback function triggered when a movie tile receives focus
   * Updates the selected title state to show content preview
   *
   * @param title - The title data of the focused tile
   */
  const onTileFocus = useCallback(
    (title?: TitleData) => {
      setSelectedTitle(title);
    },
    [setSelectedTitle],
  );

  /**
   * Sets focus to the first movie tile when transitioning from the rotator
   * Used in D-pad navigation to move focus from banner to content grid
   */
  const setFocusDestinationFromRotator = () => {
    firstTileRef?.current?.requestTVFocus();
  };
  const keplerAppStateManager: IKeplerAppStateManager =
    useKeplerAppStateManager();
  // Get component instance for Kepler services integration
  const componentInstance: IComponentInstance =
    keplerAppStateManager.getComponentInstance();

  /**
   * Effect: Initialize channel tuning and personalization services
   *
   * Sets up:
   * 1. Channel tuning handler
   * 2. Content personalization data refresh
   *
   * Note: ChannelServerComponent2 API is not supported in Simulator
   */
  useEffect(() => {
    // Use v2 channel server with component instance
    ChannelServerComponent2.getOrMakeServer().setHandlerForComponent(
      channelTunerHandler,
      componentInstance,
    );

    // Initialize personalization data
    callCustomerListRefresh();
    callContentEntitlementsRefresh();
    callPlaybackEventsRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect: Setup content launcher and live channel event handling
   *
   * Configures:
   * 1. Content launcher handler for external content launch requests
   * 2. Live channel event listener for channel tuning
   *
   * The content launcher allows external systems to launch content in the app
   */
  useEffect(() => {
    const factory = new ContentLauncherServerComponent();

    /**
     * Content launcher handler - processes external content launch requests
     *
     * @param contentSearch - Search parameters for the content to launch
     * @param autoPlay - Whether to start playing immediately (quickplay) or show details
     * @param _optionalFields - Additional optional launch parameters
     * @returns Promise with launcher response indicating success/failure
     */
    const contentLauncherHandler: IContentLauncherHandler = {
      async handleLaunchContent(
        contentSearch: IContentSearch,
        autoPlay: boolean,
        _optionalFields: ILaunchContentOptionalFields,
      ): Promise<ILauncherResponse> {
        console.log(
          '[ HomeScreen.tsx ] - HeadlessLaunchContentHandler handleLaunchContent invoked.',
        );
        console.log('LaunchContentHandler handleLaunchContent invoked.');

        // Parse and log search parameters for debugging
        let searchParameters = contentSearch.getParameterList();
        if (searchParameters.length > 0) {
          console.log(
            `[ HomeScreen.tsx ] - Content Launcher: Search param List Length: ${searchParameters.length}`,
          );

          let searchString = '';
          // Iterate through search parameters
          for (var j = 0; j < searchParameters.length; j++) {
            let additionalInfoList = searchParameters[j].getExternalIdList();
            console.log(
              `[ HomeScreen.tsx ] - Content Launcher: additionalInfoList.length : ${additionalInfoList.length}`,
            );

            // Build search string from external IDs
            for (var i = 0; i < additionalInfoList.length; i++) {
              searchString += '\n';
              searchString += additionalInfoList[i].getName();
              searchString += ' : ';
              searchString += additionalInfoList[i].getValue();
              console.log(
                `[ HomeScreen.tsx ] -  Content Launcher: Search Str in additionalInfoList  ${i} : ${searchString}`,
              );
            }
            searchString += '\n\n';
            console.log(
              `[ HomeScreen.tsx ] -  Content Launcher: Final Search str ${searchString}`,
            );
          }

          // Log launch type (quickplay vs in-app search)
          console.log(
            '[ HomeScreen.tsx ] -  Content Launcher: Going to tell launch type',
          );
          if (autoPlay) {
            console.log(
              `[ HomeScreen.tsx ] -  Content Launcher: Quickplay ${searchString}`,
            );
          } else {
            console.log(
              `[ HomeScreen.tsx ] -  Content Launcher: In-App search ${searchString}`,
            );
          }
        } else {
          console.log(
            '[ HomeScreen.tsx ] -  Content Launcher: Error fetching search string',
          );
        }

        console.log(
          '[ HomeScreen.tsx ] -  HeadlessLaunchContentHandler handleLaunchContent invoked.',
        );

        // Build successful response
        const launcherResponse = factory
          .makeLauncherResponseBuilder()
          .contentLauncherStatus(ContentLauncherStatusType.SUCCESS)
          .build();

        // Navigate to player if launch was successful
        if (
          launcherResponse.getContentLauncherStatus() ===
          ContentLauncherStatusType.SUCCESS
        ) {
          navigateToPlayer();
        }
        return Promise.resolve(launcherResponse);
      },
    };

    // Set up the content launcher server with our handler
    const contentLauncherServer = factory.getOrMakeServer();
    contentLauncherServer.setHandler(contentLauncherHandler);

    // Register listener for live channel events
    // eslint-disable-next-line react-hooks/exhaustive-deps
    listener = EventRegister.addEventListener(
      'LiveChannelEvent',
      navigateToPlayer,
    );

    // Cleanup function - remove event listener when component unmounts
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, []);

  /**
   * Effect: Initialize account login service if enabled
   *
   * Manages the account login wrapper service lifecycle:
   * 1. Starts the service when component mounts
   * 2. Sets initial login status to signed in
   * 3. Stops the service when component unmounts
   */
  useEffect(() => {
    // Only run if account login feature is enabled
    if (!isAccountLoginEnabled()) {
      return;
    }

    /**
     * Async function to start the account login service
     * Sets up authentication and updates login status
     */
    const startAccountLoginInstance = async () => {
      console.info('AccountLoginWrapper - Home Screen: Start service');
      await onStartAccountLoginService(componentInstance);
      AccountLoginWrapperInstance.updateStatus(LoginStatus.SIGNED_IN);
    };

    // Start the account login service
    startAccountLoginInstance();

    // Cleanup function - stop the service when component unmounts
    return () => {
      console.info('AccountLoginWrapper - Home Screen: Stop service');
      onStopAccountLoginService();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * TOUCH MODE LAYOUT
   *
   * For devices without D-pad support (touch devices):
   * - Renders a combined rotator + movie grid that scrolls as one unit
   * - Optimized for touch/swipe interactions
   * - No separate content preview area needed
   */
  if (!isDpadControllerSupported()) {
    return (
      <View style={styles.movieGridContainer}>
        <MovieRotatorGrid rotatorData={AutoRotatorData} movieGridData={data} />
      </View>
    );
  }

  /**
   * D-PAD MODE LAYOUT
   *
   * For devices with D-pad support (TV remotes, game controllers):
   * - Top area: Shows content preview when tile is focused, or auto-rotator when nothing is focused
   * - Bottom area: Movie grid with focus-based navigation
   * - Allows users to see details of focused content before selecting
   */
  return (
    <View style={styles.container}>
      {/* Top section: Content preview or auto-rotator */}
      <View style={styles.contentPreviewAndRotatorContainer}>
        {selectedTitle ? (
          // Show preview of the currently focused title
          <ContentPreview tile={selectedTitle} />
        ) : (
          // Show auto-rotating banner when no title is focused
          <AutoRotator
            data={AutoRotatorData}
            onFocus={setFocusDestinationFromRotator}
          />
        )}
      </View>

      {/* Bottom section: Movie grid with multiple content rows */}
      <View style={styles.movieGridContainer}>
        <MovieGrid
          key={`movie-grid-${isFocused}`} // Re-render when screen focus changes
          data={data} // Array of movie grid row configurations
          initialColumnsToRender={6} // Performance optimization - render 6 columns initially
          onTileFocus={onTileFocus} // Callback when a tile receives focus
          ref={firstTileRef} // Reference for focus management
          testID={'movieGrid'} // Test identifier
        />
      </View>
    </View>
  );
};

/**
 * Props comparison function for React.memo optimization
 * Prevents unnecessary re-renders by comparing previous and next props
 *
 * @param prevProps - Previous component props
 * @param nextProps - New component props
 * @returns true if props are equal (skip re-render), false if different (re-render)
 */
const areHomePropsEqual = (prevProps: HomeProps, nextProps: HomeProps) => {
  return areComponentPropsEqual(prevProps, nextProps);
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(HomeScreen, areHomePropsEqual);

/**
 * Stylesheet for HomeScreen component
 *
 * Defines layouts for both D-pad and touch modes:
 * - container: Main wrapper for D-pad mode (two-section layout)
 * - contentPreviewAndRotatorContainer: Top section for preview/rotator
 * - movieGridContainer: Bottom section for movie grid (used in both modes)
 */
const styles = StyleSheet.create({
  // Main container for D-pad mode layout
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },

  // Top section: Content preview and auto-rotator area
  contentPreviewAndRotatorContainer: {
    flex: 0.8, // Takes 80% of available height
    paddingLeft: scaleUxToDp(29), // Left padding scaled for different screen sizes
    marginBottom: 20, // Space between preview and movie grid
  },

  // Bottom section: Movie grid area (used in both D-pad and touch modes)
  movieGridContainer: {
    flex: 1, // Takes remaining available space
    width: '100%',
    height: '100%',
    marginBottom: scaleUxToDp(30), // Bottom margin scaled for different screen sizes
    backgroundColor: COLORS.BLACK,
  },
});
