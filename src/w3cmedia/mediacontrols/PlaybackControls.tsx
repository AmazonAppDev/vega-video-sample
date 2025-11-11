import {
  ContentPersonalizationServer,
  PlaybackState,
} from '@amazon-devices/kepler-content-personalization';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { isContentPersonalizationEnabled } from '../../config/AppConfig';
import { getMockPlaybackEventForVideo } from '../../personalization/mock/ContentPersonalizationMocks';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import { PLAYER_BUTTON_SIZE } from '../../utils/videoPlayerValues';
import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';

const DEFAULT_SEEK_TIME = 10;

export interface PlaybackControlsProps {
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  onBlur?: () => void;
  playerControlType?: string;
}

export const seek = (
  seekSeconds: number,
  videoRef: React.MutableRefObject<VideoPlayer | null>,
) => {
  if (typeof videoRef.current?.currentTime === 'number') {
    const { currentTime, duration } = videoRef.current;
    let newTime = currentTime + seekSeconds;
    if (newTime > duration) {
      newTime = duration;
    } else if (newTime < 0) {
      newTime = 0;
    }
    videoRef.current.currentTime = newTime;
    if (videoRef.current.paused) {
      videoRef.current.play();
    }
  } else {
    return;
  }
};

const seekForward = (videoRef: React.MutableRefObject<VideoPlayer | null>) => {
  seek(DEFAULT_SEEK_TIME, videoRef);
};
const seekBackward = (videoRef: React.MutableRefObject<VideoPlayer | null>) => {
  seek(-DEFAULT_SEEK_TIME, videoRef);
};

export let throttling = false;
export const throttleSeek = (func: () => void, delay: number) => {
  if (!throttling) {
    throttling = true;
    func();
    setTimeout(() => {
      throttling = false;
    }, delay);
  }
};

const PlaybackControls = ({ videoRef }: PlaybackControlsProps) => {
  const playPauseRef = useRef<any>(null);
  const skipBackwardRef = useRef<TouchableOpacity>(null);
  const skipForwardRef = useRef<TouchableOpacity>(null);

  const onBlurPlayPause = () => {
    playPauseRef?.current?.blur();
  };
  const onBlurBackwardSeek = () => {
    skipBackwardRef?.current?.blur();
  };

  const onBlurForwardSeek = () => {
    skipForwardRef?.current?.blur();
  };
  useEffect(() => {
    playPauseRef?.current?.requestTVFocus();
  }, []);

  const handleSeekBackward = useCallback(() => {
    console.info('k_content_per: calling seekBackward');
    throttleSeek(() => {
      seekBackward(videoRef);
    }, 500);
    try {
      if (isContentPersonalizationEnabled()) {
        const playbackEvent = getMockPlaybackEventForVideo(
          videoRef,
          videoRef.current!.currentSrc,
          PlaybackState.PLAYING,
        );
        ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
        console.log(
          `k_content_per: Seek Backwards : Reporting new playback event : ${JSON.stringify(
            playbackEvent,
          )}`,
        );
      }
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
  }, [videoRef]);

  const handleSeekForward = useCallback(() => {
    console.info('k_content_per: calling seekForward');
    throttleSeek(() => {
      seekForward(videoRef);
    }, 500);
    try {
      if (isContentPersonalizationEnabled()) {
        const playbackEvent = getMockPlaybackEventForVideo(
          videoRef,
          videoRef.current!.currentSrc,
          PlaybackState.PLAYING,
        );
        ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
        console.log(
          `k_content_per: Seek Forwards : Reporting new playback event : ${JSON.stringify(
            playbackEvent,
          )}`,
        );
      }
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
  }, [videoRef]);
  return (
    <View style={styles.playbackControls}>
      <PlayerButton
        key={'player-btn-seek-backward'}
        ref={skipBackwardRef}
        onBlur={onBlurBackwardSeek}
        onPress={handleSeekBackward}
        icon={'replay-10'}
        testID="player-btn-seek-backward"
        size={PLAYER_BUTTON_SIZE}
      />

      <PlayPauseButton
        videoRef={videoRef}
        hasTVPreferredFocus
        onBlur={onBlurPlayPause}
        size={PLAYER_BUTTON_SIZE}
      />
      <PlayerButton
        key={'player-btn-seek-forward'}
        onPress={handleSeekForward}
        icon={'forward-10'}
        testID="player-btn-seek-forward"
        size={PLAYER_BUTTON_SIZE}
        ref={skipForwardRef}
        onBlur={onBlurForwardSeek}
      />
    </View>
  );
};

export const arePlaybackControlsPropsEqual = (
  prevProps: PlaybackControlsProps,
  nextProps: PlaybackControlsProps,
) => {
  return areComponentPropsEqual(prevProps.videoRef, nextProps.videoRef);
};
export default React.memo(PlaybackControls, arePlaybackControlsPropsEqual);

const styles = StyleSheet.create({
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
