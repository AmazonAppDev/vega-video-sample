import { IComponentInstance } from '@amazon-devices/react-native-kepler';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { VideoFileTypes } from '../data/videos';
import { TitleData } from '../types/TitleData';
import {
  ShakaPlayer,
  ShakaPlayerSettings,
} from '../w3cmedia/shakaplayer/ShakaPlayer';
import { AppOverrideMediaControlHandler } from './AppOverrideMediaControlHandler';
import { SKIP_INTERVAL_SECONDS } from './videoPlayerValues';

// Default video resolution settings based on platform (TV vs mobile/web)
const DEFAULT_ABR_WIDTH: number = Platform.isTV ? 3840 : 1919;
const DEFAULT_ABR_HEIGHT: number = Platform.isTV ? 2160 : 1079;

// Status types returned when deinitializing the media player
type MediaPlayerDeInitStatus = 'success' | 'timedout' | 'invalid';

/**
 * VideoHandler Class
 *
 * This class manages video playback functionality including:
 * - Video player initialization and destruction
 * - Loading different video formats (MP4, HLS, DASH)
 * - Handling video events (play, pause, seek, error, etc.)
 * - Managing subtitles and text tracks
 * - Buffering state management
 * - Integration with Kepler Media Controls (KMC)
 *
 * The class supports both static media (MP4) and adaptive streaming (HLS/DASH)
 * using the Shaka Player for adaptive content.
 */
export class VideoHandler {
  // Core video player references
  /** Reference to the main video player instance */
  public videoRef: React.MutableRefObject<VideoPlayer | null>;

  /** Reference to the Shaka player for adaptive streaming content */
  public player: React.MutableRefObject<ShakaPlayer | null>;

  /** Current video format type (MP4, HLS, DASH, etc.) */
  public selectedFileType: string;

  /** Video metadata and source information */
  public data: TitleData;

  // State management functions passed from React components
  /** Updates video initialization status */
  public setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>;

  /** Updates video ended status */
  public setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>;

  /** Updates video error status */
  public setIsVideoError: React.Dispatch<React.SetStateAction<boolean>>;

  /** Updates elapsed playback time in minutes */
  public setVideoPlayElapsedTimeM: React.Dispatch<React.SetStateAction<number>>;

  /** Updates buffering indicator visibility */
  public setShowBuffering: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Constructor - Initializes the VideoHandler with required dependencies
   *
   * @param videoRef - Reference to the video player instance
   * @param player - Reference to the Shaka player for adaptive streaming
   * @param data - Video metadata including URI, format, and text tracks
   * @param setIsVideoInitialized - Function to update video initialization state
   * @param setIsVideoEnded - Function to update video ended state
   * @param setIsVideoError - Function to update video error state
   * @param setVideoPlayElapsedTimeM - Function to update elapsed time in minutes
   * @param setShowBuffering - Function to update buffering indicator state
   */
  constructor(
    videoRef: React.MutableRefObject<VideoPlayer | null>,
    player: React.MutableRefObject<ShakaPlayer | null>,
    data: TitleData,
    setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoError: React.Dispatch<React.SetStateAction<boolean>>,
    setVideoPlayElapsedTimeM: React.Dispatch<React.SetStateAction<number>>,
    setShowBuffering: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.videoRef = videoRef;
    this.player = player;
    this.data = data;
    this.selectedFileType = data.format;
    this.setIsVideoInitialized = setIsVideoInitialized;
    this.setIsVideoEnded = setIsVideoEnded;
    this.setIsVideoError = setIsVideoError;
    this.setVideoPlayElapsedTimeM = setVideoPlayElapsedTimeM;
    this.setShowBuffering = setShowBuffering;
  }
  /**
   * Updates the media data and file type for the current video
   * Used when switching between different video sources
   *
   * @param mediaData - New video metadata to set
   */
  setMediaData = (mediaData: TitleData) => {
    this.data = mediaData;
    this.selectedFileType = mediaData.format;
  };

  /**
   * Prepares and initializes the video player for playback
   *
   * This method:
   * 1. Destroys any existing video elements
   * 2. Creates a new VideoPlayer instance if needed
   * 3. Sets up Kepler Media Controls (KMC) integration
   * 4. Initializes the video player
   * 5. Sets up event listeners
   * 6. Loads the video content
   *
   * @param componentInstance - Optional Kepler component for media control integration
   */
  preBufferVideo = useCallback(
    async (componentInstance?: IComponentInstance) => {
      await this.destroyVideoElements();
      console.info(
        '[VideoHandler.ts] - preBufferVideo - Attempt to prebuffer Video Player - ComponentInstance',
        componentInstance,
      );
      if (this.videoRef.current == null) {
        console.info(
          '[VideoHandler.ts] - preBufferVideo - Current video is null, create new Video Player',
        );
        this.videoRef.current = new VideoPlayer();
      }
      (global as any).gmedia = this.videoRef.current;

      // KMC (Kepler Media Controls) integration
      try {
        if (componentInstance) {
          console.info(
            '[VideoHandler.ts] - preBufferVideo - KMC :  set Media Control Focus',
          );

          await this.videoRef.current.setMediaControlFocus(
            componentInstance,
            new AppOverrideMediaControlHandler(
              this.videoRef.current as VideoPlayer,
              false,
            ),
          );
        } else {
          console.log(
            '[VideoHandler.ts] - preBufferVideo - KMC : Skipped setting KMC',
          );
        }
      } catch (error) {
        console.error('Error during KMC execution', error);
      }

      // Initialize the video player and set up content loading
      this.videoRef.current
        .initialize()
        .then(() => {
          console.log(
            '[VideoHandler.ts] - preBufferVideo - Video Player Initialized',
          );
          this.setupEventListeners();
          this.videoRef!!.current!!.autoplay = false;
          this.loadVideoElements();
        })
        .catch((error) => {
          console.error(
            '[VideoHandler.ts] - preBufferVideo - Failed to initialize Video',
          );
          console.error(error);
        });
    },
    [],
  );

  /**
   * Loads video content and configures player settings
   *
   * This method:
   * 1. Loads subtitles if available
   * 2. Configures player settings (autoplay, seek interval)
   * 3. Chooses appropriate player based on video format:
   *    - Static player for MP4 files
   *    - Adaptive player (Shaka) for streaming formats (HLS, DASH)
   */
  loadVideoElements = useCallback(() => {
    if (this.videoRef !== null && this.videoRef.current !== null) {
      try {
        this.loadSubtitles();
      } catch (error) {
        console.error(
          '[VideoHandler.ts] - loadVideoElements - Failed to load subtitles',
        );
        console.error(error);
      }
      this.videoRef.current.autoplay = false;
      this.videoRef.current.defaultSeekIntervalInSec = SKIP_INTERVAL_SECONDS;

      // Choose player type based on video format
      if (this.selectedFileType === VideoFileTypes.MP4) {
        this.loadStaticMediaPlayer(this.videoRef.current);
      } else {
        this.loadAdaptiveMediaPlayer();
      }
    }
  }, []);

  /**
   * Loads static media content (MP4 files)
   *
   * Used for simple video files that don't require adaptive streaming.
   * Sets the video source, pauses playback, and loads the content.
   *
   * @param video - Video player instance with basic playback controls
   */
  loadStaticMediaPlayer = useCallback(
    (video: {
      src: string;
      autoplay: boolean;
      pause: () => void;
      load: () => void;
    }) => {
      video.src = this.data.uri;
      video.pause();
      console.log(
        `[VideoHandler.ts] - loadStaticMediaPlayer - Loading static player with: ${video.src}`,
      );
      video.load();
    },
    [],
  );

  /**
   * Loads adaptive streaming content (HLS, DASH, etc.) using Shaka Player
   *
   * This method:
   * 1. Configures Shaka Player settings (ABR, resolution limits)
   * 2. Initializes the Shaka Player instance
   * 3. Loads the streaming content
   * 4. Handles any loading errors
   *
   * Used for streaming formats that support adaptive bitrate streaming.
   */
  loadAdaptiveMediaPlayer = useCallback(() => {
    if (this.videoRef?.current) {
      try {
        // Configure Shaka Player settings
        const settings: ShakaPlayerSettings = {
          secure: false,
          abrEnabled: false, // Adaptive bitrate disabled
          abrMaxWidth: DEFAULT_ABR_WIDTH,
          abrMaxHeight: DEFAULT_ABR_HEIGHT,
        };
        this.player.current = new ShakaPlayer(this.videoRef.current, settings);
        console.log(
          '[VideoHandler.ts] - Shaka player initialized successfully',
        );

        if (this.player.current) {
          try {
            this.player.current.load(this.data, false);
            console.log(
              `[VideoHandler.ts] - loadStaticMediaPlayer - Loading Adaptive Media player (Shaka) with: ${this.data}`,
            );
          } catch (loadError) {
            console.error(
              '[VideoHandler.ts] - Error during Shaka player load:',
              loadError,
            );
            this.setIsVideoError(true);
          }
        }
      } catch (error) {
        console.error(
          '[VideoHandler.ts] -Error initializing Shaka player:',
          error,
        );
        this.setIsVideoError(true);
      }
    } else {
      console.error('[VideoHandler.ts] - Video reference is not initialized');
      this.setIsVideoError(true);
    }
  }, []);

  /**
   * Loads subtitle tracks for the video
   *
   * Iterates through available text tracks in the video data and adds them
   * to the video player. Each subtitle track includes language, label, URI,
   * and MIME type information.
   */
  loadSubtitles = useCallback(() => {
    const source = this.data;
    if (source?.textTrack && source.textTrack.length > 0) {
      for (let i: number = 0; i < source.textTrack.length; i++) {
        console.log(
          `[VideoHandler.ts] - loadSubtitles - Loading subtitles from: ${source.uri} [${source.textTrack[i].language}]`,
        );
        this.videoRef.current?.addTextTrack(
          'subtitles',
          source.textTrack[i].label,
          source.textTrack[i].language,
          source.textTrack[i].uri,
          source.textTrack[i].mimeType,
        );
        console.log(
          `[VideoHandler.ts] - loadSubtitles -  Loaded ${
            this.videoRef.current?.textTracks.length || 0
          } subtitles:`,
        );
      }
    }
  }, []);

  // === VIDEO EVENT HANDLERS ===
  // These methods handle various video player events and update component state accordingly

  /**
   * Handles the 'loadedmetadata' event
   * Fired when video metadata (duration, dimensions, etc.) has been loaded
   */
  onLoadeMetaData = () => {
    if (this.videoRef.current) {
      console.log('[VideoHandler.ts] - onLoadeMetaData');
      this.setIsVideoInitialized(true);
    }
  };

  /**
   * Handles the 'ended' event
   * Fired when video playback has reached the end
   */
  onEnded = () => {
    if (this.videoRef.current?.ended) {
      console.log('[VideoHandler.ts] - onEnded');
      this.setIsVideoEnded(true);
    }
  };

  /**
   * Handles video playback errors
   *
   * Categorizes errors into different types (DRM, FORMAT, NETWORK, DECODE)
   * and logs detailed error information for debugging. Updates the error state
   * to notify the UI of playback issues.
   *
   * @param event - Error event from the video player
   */
  onError = (event: any) => {
    if (!event?.target) {
      console.error('[VideoHandler.ts] - Invalid error event');
      this.setIsVideoError(true);
      return;
    }
    const target = event.target;
    const error = target.mediaControlStateUtil?.mError;
    const errorMessage = error?.message_ || '';

    // Categorize the error type for better debugging
    let errorCategory = 'UNKNOWN';
    if (
      errorMessage.includes('kepler_viddec_hw_h264') ||
      errorMessage.includes('mediaxform')
    ) {
      errorCategory = 'DRM';
    } else if (errorMessage.includes('not-negotiated')) {
      errorCategory = 'FORMAT';
    } else if (error?.code_ === 2) {
      errorCategory = 'NETWORK';
    } else if (error?.code_ === 3) {
      errorCategory = 'DECODE';
    }

    // Log comprehensive error information
    console.error(
      '[VideoHandler.ts] - Streaming Error:\n' +
        `Category: ${errorCategory}\n` +
        `Format: ${this.selectedFileType}\n` +
        `Position: ${target.mediaControlStateUtil?.currentPosition || 0}\n` +
        `DRM Blocked: ${
          target.decryptionBlockedOnKey_ || target.playbackBlockedOnKey_
        }\n` +
        `Has DRM Keys: ${!!target.mediaKeys}\n` +
        `Details: ${errorMessage}\n` +
        `uri: ${this.data?.uri}`,
    );
    this.setIsVideoError(true);
  };

  /**
   * Handles the 'timeupdate' event
   *
   * Updates elapsed time in minutes and manages buffering state for static content.
   * For MP4 files, this event is used to hide buffering since other events
   * may not fire reliably.
   */
  onTimeUpdate = () => {
    // Update elapsed time in minutes
    if (this.videoRef.current) {
      const currentTimeInMinutes = Math.floor(
        this.videoRef.current.currentTime / 60,
      );
      this.setVideoPlayElapsedTimeM(currentTimeInMinutes);
    }

    // For static media (MP4), use timeupdate to hide buffering
    // since seeked/playing events may not fire reliably
    if (this.isStaticMediaContent()) {
      this.setShowBuffering(false);
    }
  };

  /**
   * Checks if the current content is static media (MP4)
   * @returns true if content is MP4, false for streaming formats
   */
  isStaticMediaContent = () => {
    return this.selectedFileType === VideoFileTypes.MP4;
  };

  /**
   * Handles the 'waiting' event - shows buffering indicator
   * Fired when playback stops due to lack of data
   */
  onWaiting = () => {
    this.setShowBuffering(true);
  };

  /**
   * Handles the 'seeking' event - shows buffering indicator
   * Fired when user starts seeking to a new position
   */
  onSeeking = () => {
    this.setShowBuffering(true);
  };

  /**
   * Handles the 'seeked' event - hides buffering indicator
   * Fired when seeking operation completes
   */
  onSeeked = () => {
    this.setShowBuffering(false);
  };

  /**
   * Handles the 'playing' event - hides buffering indicator
   * Fired when playback starts after being paused or delayed due to lack of data
   */
  onPlaying = () => {
    this.setShowBuffering(false);
  };

  // === EVENT LISTENER MANAGEMENT ===

  /**
   * Sets up all video event listeners
   *
   * Attaches event handlers for:
   * - loadedmetadata: Video metadata loaded
   * - timeupdate: Playback time changes
   * - ended: Video playback finished
   * - error: Playback errors
   * - waiting: Buffering started
   * - seeking: Seek operation started
   * - seeked: Seek operation completed
   * - playing: Playback resumed
   */
  setupEventListeners = useCallback(() => {
    this.videoRef.current?.addEventListener(
      'loadedmetadata',
      this.onLoadeMetaData,
    );
    this.videoRef.current?.addEventListener('timeupdate', this.onTimeUpdate);
    this.videoRef.current?.addEventListener('ended', this.onEnded);
    this.videoRef.current?.addEventListener('error', this.onError);
    this.videoRef.current?.addEventListener('waiting', this.onWaiting);
    this.videoRef.current?.addEventListener('seeking', this.onSeeking);
    this.videoRef.current?.addEventListener('seeked', this.onSeeked);
    this.videoRef.current?.addEventListener('playing', this.onPlaying);
  }, []);

  /**
   * Removes all video event listeners
   *
   * Cleans up event listeners to prevent memory leaks when the video
   * player is destroyed or when switching to new content.
   */
  removeEventListeners = useCallback(() => {
    this.videoRef.current?.removeEventListener(
      'loadedmetadata',
      this.onLoadeMetaData,
    );
    this.videoRef.current?.removeEventListener('timeupdate', this.onTimeUpdate);
    this.videoRef.current?.removeEventListener('ended', this.onEnded);
    this.videoRef.current?.removeEventListener('error', this.onError);
    this.videoRef.current?.removeEventListener('waiting', this.onWaiting);
    this.videoRef.current?.removeEventListener('seeking', this.onSeeking);
    this.videoRef.current?.removeEventListener('seeked', this.onSeeked);
    this.videoRef.current?.removeEventListener('playing', this.onPlaying);
  }, []);

  // === CLEANUP AND DESTRUCTION ===

  /**
   * Synchronously destroys the media player and cleans up resources
   *
   * This method performs a complete cleanup:
   * 1. Pauses current playback
   * 2. Removes all event listeners
   * 3. Unloads and destroys Shaka player (for streaming content)
   * 4. Deinitializes the video player with timeout
   * 5. Clears global references
   *
   * @param timeout - Maximum time to wait for deinitialization (default: 1500ms)
   * @returns true if destruction was successful, false otherwise
   */
  destroyMediaPlayerSync = (timeout: number = 1500): boolean => {
    console.log(
      '[VideoHandler.ts] - Starting synchronous media player destruction',
    );

    try {
      // Pause current playback
      if (this.videoRef.current) {
        console.log('[VideoHandler.ts]: pausing media');
        this.videoRef.current.pause();
      }

      // Remove all event listeners to prevent memory leaks
      this.removeEventListeners();

      // Destroy Shaka player for streaming content
      if (this.player.current) {
        console.log('[VideoHandler.ts] - destroying player');

        if (this.selectedFileType !== VideoFileTypes.MP4) {
          console.log(
            '[VideoHandler.ts] - destroying Adaptive Media Player (shaka)',
          );
          this.player.current.unload();
        }

        this.player.current = null;
        console.log('[VideoHandler.ts] - player destroyed successfully');
      }

      // Deinitialize the main video player
      if (this.videoRef.current) {
        console.log('[VideoHandler.ts] - deinitializing media synchronously');
        const result: MediaPlayerDeInitStatus =
          this.videoRef.current.deinitializeSync(timeout);

        if (result !== 'success') {
          console.error(
            `[VideoHandler.ts] - Deinitialize sync failed - ${result}`,
          );
          return false;
        }

        console.log(
          '[VideoHandler.ts] - Deinitialize sync completed successfully',
        );
        (global as any).gmedia = null;
        this.videoRef.current = null;
      }

      console.log('[VideoHandler.ts] - Sync destruction completed');
      return true;
    } catch (err) {
      console.error('[VideoHandler.ts] - Error during destruction: ', err);
      return false;
    }
  };

  /**
   * Destroys video elements and cleans up resources
   *
   * Public method to trigger video player cleanup. Checks if a video
   * reference exists before attempting destruction.
   *
   * @returns true if destruction was successful or no video to destroy, false on error
   */
  destroyVideoElements = (): boolean => {
    if (!this.videoRef.current) {
      console.log('[VideoHandler.ts] - No video reference to destroy');
      return false;
    }

    console.log(
      '[VideoHandler.ts] - Triggering synchronous video elements destruction',
    );
    return this.destroyMediaPlayerSync();
  };
}
