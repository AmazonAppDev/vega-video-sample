import {
  ContentPersonalizationServer,
  PlaybackState,
} from '@amazon-devices/kepler-content-personalization';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { isContentPersonalizationEnabled } from '../../config/AppConfig';
import { getMockPlaybackEventForVideo } from '../../personalization/mock/ContentPersonalizationMocks';
import PlayerButton from './PlayerButton';

export interface PlayPauseButtonProps {
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  onBlur?: () => void;
  hasTVPreferredFocus?: boolean;
  size: number;
}
const PlayPauseButton = React.forwardRef(
  (
    { videoRef, onBlur, hasTVPreferredFocus, size }: PlayPauseButtonProps,
    ref: React.ForwardedRef<TouchableOpacity>,
  ) => {
    const initalPlayingState =
      !videoRef.current?.paused && !videoRef.current?.ended;
    const [playing, setPlaying] = useState<boolean>(initalPlayingState);

    useEffect(() => {
      addEventListeners();
      return () => {
        removeEventListeners();
      };
    });

    const onEndedUpdate = useCallback(() => {
      if (videoRef.current) {
        //When the video ends, the play/pause icon does not change, and isPaused returns 0.
        //To handle that call, pause API when the video ends.
        videoRef.current.pause();
        setPlaying(false);
      }
    }, [videoRef]);

    const addEventListeners = () => {
      videoRef.current?.addEventListener('play', onPlay);
      videoRef.current?.addEventListener('pause', onPause);
      videoRef.current?.addEventListener('ended', onEndedUpdate);
    };

    const removeEventListeners = () => {
      videoRef.current?.removeEventListener('play', onPlay);
      videoRef.current?.removeEventListener('pause', onPause);
      videoRef.current?.removeEventListener('ended', onEndedUpdate);
    };

    const onPause = useCallback(() => {
      setPlaying(false);
    }, []);

    const onPlay = useCallback(() => {
      setPlaying(true);
    }, []);

    const pause = useCallback(() => {
      videoRef?.current?.pause();

      try {
        if (isContentPersonalizationEnabled()) {
          console.info('k_content_per: Creating playbackEvent object in pause');
          const playbackEvent = getMockPlaybackEventForVideo(
            videoRef,
            videoRef.current!.currentSrc,
            PlaybackState.PAUSED,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
          console.log(
            `k_content_per: Pause : Reporting new playback event :${JSON.stringify(
              playbackEvent,
            )}`,
          );
        }
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }, [videoRef]);

    const play = useCallback(() => {
      videoRef?.current?.play();
      try {
        if (isContentPersonalizationEnabled()) {
          console.info('k_content_per: Creating playbackEvent object in play');
          const playbackEvent = getMockPlaybackEventForVideo(
            videoRef,
            videoRef.current!.currentSrc,
            PlaybackState.PLAYING,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
          console.log(
            `k_content_per: Play: Reporting new playback event : ${JSON.stringify(
              playbackEvent,
            )}`,
          );
        }
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }, [videoRef]);
    return (
      <PlayerButton
        onPress={playing ? pause : play}
        icon={playing ? 'pause' : 'play-arrow'}
        size={size}
        ref={ref}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onBlur={onBlur}
        testID="player-btn-play-pause"
      />
    );
  },
);

export default PlayPauseButton;
