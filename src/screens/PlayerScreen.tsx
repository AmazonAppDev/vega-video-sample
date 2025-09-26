import {
  ChangeChannelStatus,
  ChannelServerComponent2,
  OperationError,
} from '@amazon-devices/kepler-channel';
import {
  ContentPersonalizationServer,
  PlaybackState,
} from '@amazon-devices/kepler-content-personalization';
import {
  BackHandler,
  HWEvent,
  IComponentInstance,
  IKeplerAppStateManager,
  KeplerAppStateChangeData,
  KeplerAppStateEvent,
  useKeplerAppStateManager,
  useTVEventHandler,
} from '@amazon-devices/react-native-kepler';
import {
  KeplerCaptionsView,
  KeplerVideoSurfaceView,
  VideoPlayer,
} from '@amazon-devices/react-native-w3cmedia';
import isEqual from 'lodash/isEqual';
import React, { useCallback, useEffect, useRef } from 'react';
import ErrorView from '../components/ErrorView';

import { SafeAreaView } from '@amazon-devices/react-native-safe-area-context';
import { RouteProp } from '@amazon-devices/react-navigation__core';
import { StackNavigationProp } from '@amazon-devices/react-navigation__stack';
import {
  AppStateStatus,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import BufferingWindow from '../components/BufferingWindow';
import {
  AppStackParamList,
  AppStackScreenProps,
  Screens,
} from '../components/navigation/types';
import { isContentPersonalizationEnabled } from '../config/AppConfig';
import { CAPTION_DISABLE_ID, EVENT_KEY_DOWN } from '../constants';
import { getMockPlaybackEventForVideo } from '../personalization/mock/ContentPersonalizationMocks';
import { getBifFrameImageSource } from '../services/bif/bifService';
import { FrameImageSource } from '../services/bif/FrameImageSource';
import { COLORS } from '../styles/Colors';
import { VideoHandler } from '../utils/VideoHandler';
import VideoPlayerUI from '../w3cmedia/mediacontrols/VideoPlayerUI';
import { ShakaPlayer } from '../w3cmedia/shakaplayer/ShakaPlayer';

const BACKGROUND_STATE: AppStateStatus = 'background';

interface PlayerProps {
  navigation: StackNavigationProp<AppStackParamList, Screens.PLAYER_SCREEN>;
  route: RouteProp<AppStackParamList, Screens.PLAYER_SCREEN>;
}

const PlayerScreen = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.PLAYER_SCREEN>) => {
  const { data, sendDataOnBack, onChannelTuneSuccess, onChannelTuneFailed } =
    route.params;
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();
  const addKeplerAppStateListenerCallback = (
    eventType: KeplerAppStateEvent,
    handler: (state: KeplerAppStateChangeData) => void,
  ) => keplerAppStateManager.addAppStateListener(eventType, handler);
  const [showBuffering, setShowBuffering] = React.useState<boolean>(true);

  // After media initialization once media loads isVideoInitialized will change to true.
  const [isVideoInitialized, setIsVideoInitialized] =
    React.useState<boolean>(false);
  const surfaceHandle = useRef<string | null>(null);
  const captionViewHandle = useRef<string | null>(null);

  const captionStatus = useRef<boolean | null>(null);
  const setCaptionStatus = (status: boolean) => {
    captionStatus.current = status;
  };
  const [captionID, setCaptionID] = React.useState<string>(CAPTION_DISABLE_ID);
  const setSelectedCaptionInVideoPlayer = (id: string) => {
    setCaptionID(id);
  };
  const [isVideoEnded, setVideoEnded] = React.useState<boolean>(false);
  const [isVideoError, setVideoError] = React.useState<boolean>(false);
  const [videoPlayElapsedTimeM, setVideoPlayElapsedTimeM] =
    React.useState<number>(0);
  const timer = useRef<null | ReturnType<typeof setTimeout> | number>(null);

  const videoRef = useRef<VideoPlayer | null>(null);
  const player = useRef<ShakaPlayer | null>(null);
  const bifFrameImagesRef = useRef<FrameImageSource | null>(null);

  const TIME_TO_GO_BACK_IF_VIDEO_ENDS = 2300;
  const BACK_NAVIGATION_DELAY = 700;
  const showVideoPlayerUI = !isVideoError;
  const keplerAppStateManager: IKeplerAppStateManager =
    useKeplerAppStateManager();
  const componentInstance: IComponentInstance =
    keplerAppStateManager.getComponentInstance();

  const videoHandler = new VideoHandler(
    videoRef,
    player,
    data,
    setIsVideoInitialized,
    setVideoEnded,
    setVideoError,
    setVideoPlayElapsedTimeM,
    setShowBuffering,
  );

  useTVEventHandler((evt: HWEvent) => {
    if (!Platform.isTV) {
      return;
    }
    if (evt && evt.eventKeyAction === EVENT_KEY_DOWN) {
      if (isVideoEnded) {
        clearTimeout(Number(timer.current));
        setVideoEnded(false);
      }
    }
  });

  useEffect(() => {
    if (!isVideoEnded) {
      return;
    }
    timer.current = setTimeout(() => {
      navigateBack();
    }, TIME_TO_GO_BACK_IF_VIDEO_ENDS);

    return () => clearTimeout(Number(timer.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoEnded]);

  useEffect(() => {
    console.log(
      '[PlayerScreen.tsx] - Initialize media player: componentInstance',
      componentInstance,
    );
    console.log(
      '[PlayerScreen.tsx] - Video Handler invoke preBufferVideo',
      videoHandler.data,
    );
    videoHandler.preBufferVideo(componentInstance);
    setupEventListeners();
    const changeSubscription = addKeplerAppStateListenerCallback(
      'change',
      handleAppStateChange,
    );
    return () => {
      changeSubscription.remove();
      clearTimeout(Number(timer.current));
      removeEventListeners();
      sendDataOnBack();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isVideoError) {
      setShowBuffering(false);
    }
  }, [isVideoError]);

  /**
   * Function to report the video player screen exit.
   */
  const reportVideoExit = () => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    try {
      console.info(
        '[PlayerScreen.tsx] - reportVideoExit - k_content_per: Creating playbackEvent object on exit',
      );
      const playbackEvent = getMockPlaybackEventForVideo(
        videoRef,
        videoRef.current!.currentSrc,
        PlaybackState.EXIT,
      );
      ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
      console.info(
        `[PlayerScreen.tsx] - reportVideoexit - k_content_per: Exit : Reporting new playback event :${JSON.stringify(
          playbackEvent,
        )}`,
      );
    } catch (e) {
      console.error(
        `[PlayerScreen.tsx] - reportVideoexit - k_content_per: ${e}`,
      );
    }
  };

  useEffect(() => {
    return () => {
      /**
       * When the player is unmounted we check if the instance was destroyed correctly,
       * if not, it is destroyed (commonly used with integrations like EPG).
       */
      if (videoRef?.current) {
        surfaceHandle.current = null;
        captionViewHandle.current = null;
        videoRef.current?.clearSurfaceHandle('');
        videoRef?.current?.clearCaptionViewHandle('');
        videoHandler.destroyVideoElements();
        videoRef.current = null;
        clearTimeout(Number(timer.current));
      }

      if (bifFrameImagesRef) {
        bifFrameImagesRef.current?.clearCache();
        bifFrameImagesRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateBack = useCallback(() => {
    if (captionStatus.current) {
      captionStatus.current = false;
      return true;
    }

    reportVideoExit();

    surfaceHandle.current = null;
    captionViewHandle.current = null;
    videoRef?.current?.clearSurfaceHandle('');
    videoRef?.current?.clearCaptionViewHandle('');
    videoHandler.destroyVideoElements();
    videoRef.current = null;
    clearTimeout(Number(timer.current));

    //Approx delay added to destroy media instance
    setTimeout(() => navigation.goBack(), BACK_NAVIGATION_DELAY);
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppStateChange = useCallback(
    (nextAppState: KeplerAppStateChangeData): void => {
      console.log(
        '[PlayerScreen.tsx] - handleAppStateChange - k_content_per: handleAppStateChange',
      );
      if (nextAppState === BACKGROUND_STATE) {
        setShowBuffering(false);
        navigateBack();
      }
    },
    [navigateBack],
  );

  const setupEventListeners = useCallback(() => {
    if (Platform.isTV) {
      BackHandler.addEventListener('hardwareBackPress', navigateBack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Platform.isTV]);

  const removeEventListeners = useCallback(() => {
    if (Platform.isTV) {
      BackHandler.removeEventListener('hardwareBackPress', navigateBack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Platform.isTV]);

  const reportVideoPlaying = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    try {
      const playbackEvent = getMockPlaybackEventForVideo(
        videoRef,
        videoRef.current!.currentSrc,
        PlaybackState.PLAYING,
      );
      console.info(
        `[PlayerScreen.tsx] - reportVideoPlaying -  k_content_per: Reported playback event : ${JSON.stringify(
          playbackEvent,
        )}`,
      );
      ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
    } catch (e) {
      console.error(
        `[PlayerScreen.tsx] - reportVideoPlaying -  k_content_per: ${e}`,
      );
    }
  }, [videoRef]);

  useEffect(() => {
    if (videoPlayElapsedTimeM === 0) {
      return;
    }
    console.info(
      '[PlayerScreen.tsx] - reportVideoPlaying - k_content_per: Reporting playback event for Continued PLAYING',
    );

    reportVideoPlaying();
  }, [reportVideoPlaying, videoPlayElapsedTimeM]);

  const playVideo = useCallback(async () => {
    try {
      // Hide buffer view and Play the video if allowed...
      await videoRef?.current?.play();
      setShowBuffering(false);
      console.debug(
        '[PlayerScreen.tsx] - playVideo -  Video playing successfully',
      );
      if (onChannelTuneSuccess) {
        const channelResponse =
          ChannelServerComponent2.makeChannelResponseBuilder()
            .status(ChangeChannelStatus.SUCCESS)
            .data(data.title)
            .build();
        onChannelTuneSuccess(channelResponse);
      }
      console.info(
        '[PlayerScreen.tsx] - playVideo - k_content_per: Reporting new playback event',
      );
      reportVideoPlaying();
    } catch (error) {
      console.error(
        '[PlayerScreen.tsx] - playVideo - Error occurred while playing video {}',
        error,
      );
      if (onChannelTuneFailed) {
        onChannelTuneFailed(
          new OperationError(
            `[PlayerScreen.tsx] - playVideo - Video content could not be played due to error ${error}`,
          ),
        );
      }
      navigateBack();
    }
  }, [
    videoRef,
    data.title,
    navigateBack,
    onChannelTuneFailed,
    onChannelTuneSuccess,
    reportVideoPlaying,
  ]);

  const setSurface = useCallback(async () => {
    if (surfaceHandle.current) {
      videoRef.current?.setSurfaceHandle(surfaceHandle.current);

      //Get bif file if apply
      if (data?.bifUrl) {
        bifFrameImagesRef.current = await getBifFrameImageSource(data.bifUrl);
      }

      // Play video once surface has created and set to media reference
      playVideo();
    }
  }, [data.bifUrl, playVideo]);

  const onSurfaceViewCreated = useCallback(
    (_surfaceHandle: string): void => {
      console.info(
        '[PlayerScreen.tsx] - onSurfaceViewCreated - Creating video surface',
      );
      surfaceHandle.current = _surfaceHandle;
      setSurface();
    },
    [setSurface],
  );

  const onSurfaceViewDestroyed = useCallback((_surfaceHandle: string): void => {
    // Clear surface on screen unmount
    videoRef.current?.clearSurfaceHandle(_surfaceHandle);
  }, []);

  const onCaptionViewCreated = useCallback((captionsHandle: string): void => {
    console.info(
      '[PlayerScreen.tsx] - onCaptionViewCreated - Creating video captions',
    );
    captionViewHandle.current = captionsHandle;
    setCaptionViewHandle();
  }, []);

  const setCaptionViewHandle = () => {
    console.info(
      '[PlayerScreen.tsx] - setCaptionViewHandle - setting captionViewHandle on video',
    );
    if (videoRef.current !== null && captionViewHandle.current !== null) {
      (videoRef.current as VideoPlayer).setCaptionViewHandle(
        captionViewHandle.current,
      );
    }
  };
  const onCaptionViewDestroyed = (captionsHandle: string): void => {
    console.log(
      `[PlayerScreen.tsx] - onCaptionViewDestroyed - Destroying captionsHandle=${captionsHandle}`,
    );
    if (videoRef.current !== null) {
      (videoRef.current as VideoPlayer).clearCaptionViewHandle(captionsHandle);
    }
    captionViewHandle.current = null;
  };

  return (
    <SafeAreaView style={styles.playerContainer} testID="safe-area-view">
      <View
        style={[
          styles.surfaceContainer,
          {
            width: deviceWidth,
            height: deviceHeight,
          },
        ]}
        testID="touchable-opacity">
        {isVideoInitialized && (
          <>
            <KeplerVideoSurfaceView
              style={styles.videoSurface}
              onSurfaceViewCreated={onSurfaceViewCreated}
              onSurfaceViewDestroyed={onSurfaceViewDestroyed}
              testID="kepler-video-surface-view"
            />
            <KeplerCaptionsView
              onCaptionViewCreated={onCaptionViewCreated}
              onCaptionViewDestroyed={onCaptionViewDestroyed}
              style={styles.captions}
              show={captionID !== CAPTION_DISABLE_ID}
              testID="kepler-captions-view"
            />
          </>
        )}

        {showBuffering && (
          <BufferingWindow backgroundColor={COLORS.SEMI_TRANSPARENT} />
        )}
        {showVideoPlayerUI && (
          <VideoPlayerUI
            videoRef={videoRef}
            navigateBack={navigateBack}
            title={route.params.data.title}
            setCaptionStatus={setCaptionStatus}
            setSelectedCaptionInVideoPlayer={setSelectedCaptionInVideoPlayer}
            bifFrameImagesRef={bifFrameImagesRef}
            videoData={data}
          />
        )}
        {isVideoError && <ErrorView navigateBack={navigateBack} />}
      </View>
    </SafeAreaView>
  );
};

const arePlayerPropsEqual = (
  prevProps: PlayerProps,
  nextProps: PlayerProps,
) => {
  return isEqual(prevProps, nextProps);
};
export default React.memo(PlayerScreen, arePlayerPropsEqual);

export const styles = StyleSheet.create({
  captions: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  playerContainer: { backgroundColor: COLORS.GRAY, height: '100%' },
  surfaceContainer: { backgroundColor: COLORS.BLACK, alignItems: 'stretch' },

  videoSurface: { zIndex: 0 },
});
