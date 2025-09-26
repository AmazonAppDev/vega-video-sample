// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { consoleInfoSpy } from '../../../jest.setup';
import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';
import { PLAYER_BUTTON_SIZE } from '../../../src/utils/videoPlayerValues';
import PlaybackControls, {
  PlaybackControlsProps,
  seek,
  throttleSeek,
  throttling,
} from '../../../src/w3cmedia/mediacontrols/PlaybackControls';
import { PlayerControlType } from '../../../src/w3cmedia/mediacontrols/types/ControlBar';

jest.mock('@amazon-devices/kepler-content-personalization', () => ({
  __esModule: true,
  ContentPersonalizationServer: {
    reportNewPlaybackEvent: jest.fn(),
  },
}));

jest.mock('@amazon-devices/react-native-device-info', () => ({
  getModel: jest.fn(() => 'simulator'),
}));

jest.mock('../../../src/utils/lodashHelper', () => ({
  areComponentPropsEqual: jest.fn(() => false),
}));

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    onCaptionViewDestroyed: jest.fn(),
    currentTime: 0,
    duration: 1000,
    readyState: 3,
    play: jest.fn(),
    pause: jest.fn(),
    clearSurfaceHandle: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentSrc: '',
  } as unknown as VideoPlayer,
};

const updatedVideoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    onCaptionViewDestroyed: jest.fn(),
    currentTime: 3,
    duration: 1000,
    readyState: 3,
    play: jest.fn(),
    pause: jest.fn(),
    clearSurfaceHandle: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentSrc: '',
  } as unknown as VideoPlayer,
};

const renderPlaybackControls = (props?: Partial<PlaybackControlsProps>) => {
  return <PlaybackControls videoRef={videoRef} {...props} />;
};

describe('PlaybackControls tests', () => {
  it('component renders correctly', () => {
    const component = render(renderPlaybackControls());
    expect(component).toMatchSnapshot();
  });

  it('component renders correctly: PlayerControlType.PLAYPAUSE', () => {
    const component = render(
      renderPlaybackControls({
        playerControlType: PlayerControlType.PLAYPAUSE,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('component renders correctly: PlayerControlType.SKIPBACKWARD', () => {
    const component = render(
      renderPlaybackControls({
        playerControlType: PlayerControlType.SKIPBACKWARD,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('component renders correctly: PlayerControlType.SKIPFORWARD', () => {
    const component = render(
      renderPlaybackControls({
        playerControlType: PlayerControlType.SKIPFORWARD,
      }),
    );
    expect(component).toMatchSnapshot();
  });
});

describe('PlaybackControls onPress tests', () => {
  it('Seek Backward renders correctly', () => {
    const { getByTestId } = render(renderPlaybackControls());
    const playerButton = getByTestId('player-btn-seek-backward');
    expect(playerButton).toBeDefined();
  });

  it('Seek Forward renders correctly', () => {
    const { getByTestId } = render(renderPlaybackControls());
    const playerButton = getByTestId('player-btn-seek-forward');
    expect(playerButton).toBeDefined();
  });

  it('Play Pause renders correctly', () => {
    const { getByTestId } = render(renderPlaybackControls());
    const playerPause = getByTestId('player-btn-play-pause');
    expect(playerPause).toBeDefined();
  });
});

describe('Check if functions called properly', () => {
  it('Seek Backward onPress gets called properly', () => {
    jest.spyOn(React, 'useRef');
    const { getByTestId } = render(renderPlaybackControls());
    fireEvent.press(getByTestId('player-btn-seek-backward'));
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: calling seekBackward',
    );
  });

  it('Seek Forward onPress gets called properly', () => {
    const { getByTestId } = render(renderPlaybackControls());
    fireEvent.press(getByTestId('player-btn-seek-forward'));
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: calling seekForward',
    );
  });

  it('Seek Backward onBlur gets called properly', () => {
    const screen = render(renderPlaybackControls());
    const component = screen.getByTestId('player-btn-seek-backward');

    fireEvent(component, 'focus');
    expect(component?.props.style).toEqual(
      expect.objectContaining({ borderRadius: PLAYER_BUTTON_SIZE }),
    );
    fireEvent(component, 'blur');
    expect(component?.props.style).not.toEqual(
      expect.objectContaining({ borderRadius: PLAYER_BUTTON_SIZE }),
    );
  });

  it('Seek Forward onBlur gets called properly', () => {
    const { getByTestId } = render(renderPlaybackControls());
    const component = getByTestId('player-btn-seek-forward');

    fireEvent(component, 'focus');
    expect(component?.props.style).toEqual(
      expect.objectContaining({ borderRadius: PLAYER_BUTTON_SIZE }),
    );
    fireEvent(component, 'blur');
    expect(component?.props.style).not.toEqual(
      expect.objectContaining({ borderRadius: PLAYER_BUTTON_SIZE }),
    );
  });

  it('Play Pause onBlur gets called properly', () => {
    const { getByTestId } = render(renderPlaybackControls());
    const component = getByTestId('player-btn-play-pause');

    fireEvent(component, 'focus');
    expect(component?.props.style).toEqual(
      expect.objectContaining({ borderRadius: PLAYER_BUTTON_SIZE }),
    );
    fireEvent(component, 'blur');
    expect(component?.props.style).not.toEqual(
      expect.objectContaining({ borderRadius: PLAYER_BUTTON_SIZE }),
    );
  });
});

describe('seek function', () => {
  it('should seek forward within video duration', () => {
    const seekSeconds = 10;
    const initialTime = videoRef.current!.currentTime;
    seek(seekSeconds, videoRef);
    expect(videoRef.current!.currentTime).toBe(initialTime + seekSeconds);
  });

  it('should not update currentTime if videoRef does not have currentTime', () => {
    const seekSeconds = 10;
    videoRef.current = null;
    seek(seekSeconds, videoRef);
    expect(videoRef.current).toBe(null);
  });
});

describe('throttle function', () => {
  jest.useFakeTimers();
  it('should update throttling value when seek forward/backward get called', () => {
    const delay = 500;
    throttleSeek(() => {}, delay);
    expect(throttling).toBe(true);
  });
});

describe('React.memo behavior for PlaybackControl', () => {
  it('does not re-render when videoRef is unchanged', () => {
    const { rerender } = render(<PlaybackControls videoRef={videoRef} />);
    rerender(<PlaybackControls videoRef={videoRef} />);

    expect(areComponentPropsEqual).toHaveBeenCalledWith(videoRef, videoRef);
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-render when videoRef is unchanged', () => {
    const { rerender } = render(<PlaybackControls videoRef={videoRef} />);
    rerender(<PlaybackControls videoRef={updatedVideoRef} />);

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      videoRef,
      updatedVideoRef,
    );
  });
});
