// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * For references with the usage of the SeekBar component please visit:
 * https://developer.amazon.com/docs/kepler-tv-api/seekbar.html
 */

import { SeekBar as KUICSeekbar } from '@amazon-devices/kepler-ui-components';
import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { getImageForVideoSecond } from '../services/bif/bifService';
import { FrameImageSource } from '../services/bif/FrameImageSource';
import { COLORS } from '../styles/Colors';
import { TitleData } from '../types/TitleData';
import { formatTime } from '../utils/commonFunctions';
import { scaleUxToDp } from '../utils/pixelUtils';
import FastForwardRewindIcon from './seekbar/ForwardBackwardIcon';
import ThumbIcon from './seekbar/ThumbIcon';

//1 Second expressed in ms
const SECOND_IN_MILIS = 1000;

//Default values
const DEFAULT_TIME_TEXT = '00:00';
const TRANSPARENT_IMAGE_URL =
  'data:image/png;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

// Seekbar configuration constants
const SEEKBAR_STEP = 10;
const STEP_MULTIPLIER_FACTOR = 1;
const STEP_MULTIPLIER_INTERVAL = 1000;
const LONG_PRESS_INTERVAL_DURATION = 200;
const LONG_PRESS_DELAY = 1000;
const MAX_STEP_VALUE = 50;
const ANIMATION_DURATION = 200;

const Seekbar = ({
  videoRef,
  videoData,
  bifFrameImagesRef,
  testID,
  handleShowControlsOnKeyEvent,
}: {
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  videoData: TitleData;
  bifFrameImagesRef: React.MutableRefObject<FrameImageSource | null>;
  testID?: string;
  handleShowControlsOnKeyEvent;
}) => {
  const [progress, setProgress] = useState<number>(
    videoRef.current?.currentTime || 0,
  );
  const [isSkipping, setIsSkipping] = useState(false);
  const isSkippingRef = useRef(false);
  const totalValue = videoRef.current?.duration;
  const disableThumbnail = !isSkipping;
  const thumbnailImageNotAvailable =
    !videoData?.thumbnailUrl && !bifFrameImagesRef?.current;
  const thumbnailStyle = thumbnailImageNotAvailable
    ? styles.thumbnailContainerTransparent
    : {};

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current && !isSkippingRef.current) {
        setProgress(videoRef.current?.currentTime);
      }
    };
    const intervalProgress = setInterval(updateProgress, 1000);
    return () => clearInterval(intervalProgress);
  }, [videoRef]);

  /**
   * Seeks to a specific position in the video and resumes playback.
   *
   * @description
   * This function performs video seeking operations in sequence:
   * - Validates that the video reference exists and currentTime is accessible
   * - Updates the seekbar progress state to reflect the new position
   * - Disables the skipping state (both useState and useRef) to hide thumbnails and return to normal playback
   * - Calls the fastSeek function to seek to the target time
   * - Automatically resumes video playback after seeking
   *
   * @param {number} value - Target time position in seconds to seek to
   *
   */
  const seek = (value: number) => {
    if (typeof videoRef.current?.currentTime === 'number') {
      setProgress(value);
      videoRef.current.fastSeek(value);
      videoRef.current.play();
      isSkippingRef.current = false;
    }
  };

  /**
   * Pauses the video if it's currently playing.
   *
   * @description
   * This utility function safely pauses the video by:
   * - Verifying that the video is not already paused
   * - Only calling pause() if the video is currently playing
   *
   */
  const pauseVideo = () => {
    if (!videoRef?.current?.paused) {
      videoRef.current?.pause();
    }
  };

  /**
   * Handles the start of sliding interaction when user begins seeking with D-Pad.
   *
   * @description
   * This function is triggered when the user starts sliding/seeking on the seekbar:
   * - Pauses the video to prevent playback during seeking operations
   * - Sets the skipping state to true (both useState and useRef) which enables thumbnail display
   *
   */
  const handleOnSlidingStart = () => {
    pauseVideo();
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles the end of sliding interaction when user finishes seeking.
   *
   * @description
   * This function is called when the sliding/seeking interaction ends:
   * - Maintains the skipping state (both useState and useRef) to keep thumbnails visible
   * - Keeps the video paused until user confirms the seek position
   * - Allows user to continue fine-tuning the seek position
   *
   * The video remains paused until the user presses the select or play/pause button
   * to confirm their desired seek position.
   */
  const handleOnSlidingEnd = () => {
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles rewind button (<<) press events from the remote control.
   *
   * @description
   * This function manages backward seeking operations:
   * - Pauses the video to prevent playback during rewind interaction
   * - Activates skipping mode (both useState and useRef) to enable thumbnail previews
   * - Prepares the seekbar for backward navigation
   *
   * @Note
   * Internally the seek bar component simulates a long press interaction when
   * the (<<) skip backward button is pressed (key up).
   *
   */
  const onRewindPressHandler = () => {
    pauseVideo();
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles fast forward button (>>) press events from the remote control.
   *
   * @description
   * This function manages forward seeking operations:
   * - Pauses the video to prevent playback during fast forward interaction
   * - Activates skipping mode (both useState and useRef) to enable thumbnail previews
   * - Prepares the seekbar for forward navigation
   *
   * @Note
   * Internally the seek bar component simulates a long press interaction when
   * the (>>) skip forward button is pressed (key up).
   *
   */
  const onFastForwardPressHandler = () => {
    pauseVideo();
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles value changes during seekbar interaction to manage control visibility.
   *
   * @description
   * This memoized callback function:
   * - Monitors seekbar value changes during user interaction
   * - Prevents controls from auto-hiding while user is actively seeking
   * - Uses useRef for efficient state checking without causing re-renders
   * - Only triggers when the user is in skipping/seeking mode
   *
   * @dependencies {function} handleShowControlsOnKeyEvent - Function to show controls
   */
  const onChangeValueHandler = useCallback(() => {
    if (isSkippingRef.current) {
      handleShowControlsOnKeyEvent();
    }
  }, [handleShowControlsOnKeyEvent]);

  /**
   * Handles select button press events with debouncing to prevent multiple seek operations.
   *
   * @description
   * This function manages the final seek confirmation when user presses select
   *
   * @param {number} value - Target seek position in seconds
   *
   */
  const onPressSelectButtonHandler = (value: number) => {
    if (isSkippingRef.current) {
      setIsSkipping(false);
      seek(value);
    } else {
      videoRef.current?.paused
        ? videoRef.current?.play()
        : videoRef.current?.pause();
    }
  };

  /**
   * Handles playpause button press events with debouncing to prevent multiple seek operations.
   *
   * @description
   * This function manages the final seek confirmation when user presses playpause
   *
   * @param {number} value - Target seek position in seconds
   *
   */
  const onPressPlayPauseButtonHandler = (value: number) => {
    if (isSkippingRef.current) {
      setIsSkipping(false);
      seek(value);
    }
  };

  /**
   * Retrieves the appropriate thumbnail image source for video seeking preview.
   *
   * @description
   * This memoized function implements a priority-based approach to determine
   * the thumbnail source for the current seek position:
   *
   * 1. **Skipping State Check**: Uses useRef to check if actively seeking without causing re-renders
   * 2. **Video Thumbnail URL**: Primary source - uses server-generated thumbnails
   *    - Adds 10 seconds offset to the timestamp for better frame selection
   *    - Calls getImageForVideoSecond service to get the appropriate frame
   * 3. **BIF Frame Data**: Secondary source - uses locally stored BIF frames
   *    - Converts seconds to milliseconds for BIF frame lookup
   *    - Retrieves base64 encoded image data from BIF frame source
   * 4. **Fallback**: Returns transparent image if no sources are available
   *
   * @param {number} thumbValue - Current timestamp in seconds for thumbnail lookup
   * @returns {ImageSourcePropType} Image source object with URI for React Native Image
   *
   * @dependencies {boolean} isSkipping - Current seeking state
   * @dependencies {string} videoData?.thumbnailUrl - Server thumbnail URL
   * @dependencies {FrameImageSource} bifFrameImagesRef - BIF frame data reference
   *
   */
  const getThumbnailImageSource = useCallback(
    (thumbValue: number): ImageSourcePropType => {
      try {
        // Priority 1: Use video thumbnail URL if available
        if (videoData?.thumbnailUrl) {
          return {
            uri: getImageForVideoSecond(
              thumbValue + 10,
              videoData.thumbnailUrl,
            ),
          };
        }

        // Priority 2: Use BIF frame data if available
        if (bifFrameImagesRef.current) {
          const bifImage = bifFrameImagesRef.current.getBase64Image(
            thumbValue * SECOND_IN_MILIS,
          );
          if (bifImage) {
            return { uri: bifImage };
          }
        }
      } catch (error) {
        console.error('[Seekbar.tsx] - Error getting thumbnail:', error);
      }

      // Fallback to default thumbnail
      return { uri: TRANSPARENT_IMAGE_URL };
    },
    [videoData?.thumbnailUrl, bifFrameImagesRef],
  );

  /**
   * Returns the thumb icon component for the seekbar handle.
   *
   * @description
   * This function provides the visual representation of the seekbar thumb/handle:
   * - Receives focus state from the seekbar component
   * - Returns a ThumbIcon component with appropriate styling
   * - The icon appearance changes based on focus state
   *
   * @param {boolean} params.focused - Whether the seekbar is currently focused
   * @returns {React.ReactElement} ThumbIcon component with focus styling
   *
   */
  const getThumbIcon = ({ focused }) => <ThumbIcon focused={focused} />;

  /**
   * Returns the appropriate color for the seekbar progress indicator.
   *
   * @description
   * This function determines the visual color of the seekbar progress indicator:
   *
   * @param {boolean} focusedValue - Whether the seekbar is currently focused
   * @returns {string} Color value from COLORS constants
   *
   */
  const getIndicatorColor = (focusedValue: boolean) =>
    focusedValue ? COLORS.ORANGE : COLORS.GRAY;

  /**
   * Formats the thumbnail label to display human-readable time.
   *
   * @description
   * This function converts the numeric timestamp into a formatted time string:
   * - Takes a time value in seconds
   * - Uses the formatTime utility to convert to MM:SS or HH:MM:SS format
   * - Provides consistent time formatting across the seekbar interface
   * - Displays the time label above the thumbnail during seeking
   *
   * @param {number} thumbnailLabel - Time value in seconds to format
   * @returns {string} Formatted time string (e.g., "2:30", "1:23:45")
   *
   */
  const getThumbnailLabel = (thumbnailLabel: number) =>
    formatTime(thumbnailLabel);

  return totalValue ? (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View>
          <Text style={styles.time}>
            {progress ? formatTime(progress) : DEFAULT_TIME_TEXT}
          </Text>
        </View>
        <TVFocusGuideView
          hasTVPreferredFocus={true}
          autoFocus
          style={styles.seekbar}>
          <KUICSeekbar
            currentValue={progress}
            totalValue={totalValue}
            disabledWhenNotFocused={true}
            disableThumbnail={disableThumbnail}
            thumbnailStyle={thumbnailStyle}
            step={SEEKBAR_STEP}
            stepMultiplierFactor={STEP_MULTIPLIER_FACTOR}
            stepMultiplierFactorInterval={STEP_MULTIPLIER_INTERVAL}
            longPressIntervalDuration={LONG_PRESS_INTERVAL_DURATION}
            longPressDelay={LONG_PRESS_DELAY}
            maxStepValue={MAX_STEP_VALUE}
            trapFocus
            enableSkipForwardBackwardAcceleration={true}
            enableLongPressAcceleration={true}
            enableAnimations={true}
            animationDuration={ANIMATION_DURATION}
            displayAboveThumb={FastForwardRewindIcon}
            thumbIcon={getThumbIcon}
            thumbnailLabel={getThumbnailLabel}
            currentValueIndicatorColor={getIndicatorColor}
            thumbnailImageSource={getThumbnailImageSource}
            onValueChange={onChangeValueHandler}
            onSlidingStart={handleOnSlidingStart}
            onSlidingEnd={handleOnSlidingEnd}
            onFastForwardPress={onFastForwardPressHandler}
            onRewindPress={onRewindPressHandler}
            onPress={onPressSelectButtonHandler}
            onPlayPause={onPressPlayPauseButtonHandler}
            testID={testID || 'kui-seekbar'}
          />
        </TVFocusGuideView>
        <View>
          <Text style={styles.time}>{formatTime(totalValue)}</Text>
        </View>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  controls: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    padding: scaleUxToDp(25),
    marginBottom: scaleUxToDp(50),
    zIndex: 2,
  },
  seekbar: {
    width: '90%',
    marginBottom: scaleUxToDp(10),
  },
  time: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(25),
    marginHorizontal: 30,
  },
  hiddenBar: {
    backgroundColor: 'transparent',
    height: scaleUxToDp(10),
    width: '90%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  aboveThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 120,
    display: 'flex',
    flexDirection: 'row',
  },
  thumbnailContainerTransparent: {
    backgroundColor: COLORS.TRANSPARENT,
  },
});

export default React.memo(Seekbar, (prevProps, nextProps) => {
  return (
    prevProps.videoRef === nextProps.videoRef &&
    prevProps.videoData === nextProps.videoData &&
    prevProps.bifFrameImagesRef === nextProps.bifFrameImagesRef
  );
});
