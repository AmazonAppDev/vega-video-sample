// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { consoleInfoSpy } from '../../../jest.setup';
import { getMockPlaybackEventForVideo } from '../../../src/personalization/mock/ContentPersonalizationMocks';
import PlayPauseButton, {
  PlayPauseButtonProps,
} from '../../../src/w3cmedia/mediacontrols/PlayPauseButton';
const pauseMock = jest.fn();
const playMock = jest.fn();
const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    paused: true,
    ended: true,
    play: playMock,
    pause: pauseMock,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentSrc: 'PlayPause',
  } as unknown as VideoPlayer,
};
const renderCaptionButton = (props?: Partial<PlayPauseButtonProps>) => {
  return <PlayPauseButton videoRef={videoRef} size={80} {...props} />;
};
describe('PlayPauseButton tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
    const playerButton = component.getByTestId('player-btn-play-pause');
    fireEvent.press(playerButton);
    expect(playMock).toHaveBeenCalled();
  });
  it('component renders correctly with `paused` and `ended` negative', () => {
    const component = render(
      renderCaptionButton({
        videoRef: {
          current: {
            ...videoRef.current,
            paused: false,
            ended: false,
          } as unknown as VideoPlayer,
        },
      }),
    );
    expect(component).toMatchSnapshot();
    const playerButton = component.getByTestId('player-btn-play-pause');
    fireEvent.press(playerButton);
    expect(pauseMock).toHaveBeenCalled();
  });
});
const asMock = <T extends any = any, Y extends any[] = any[]>(
  obj: any,
): jest.Mock<T, Y> => obj as jest.Mock<T, Y>;
describe('PlayPauseButton event listeners', () => {
  test('Event `play`: Adds and Removes event listener correctly', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: videoRef });
    const { unmount } = render(renderCaptionButton());
    let captureOnPlaying;
    expect(videoRef.current?.addEventListener).toHaveBeenCalledWith(
      'play',
      expect.any(Function),
    );
    captureOnPlaying = asMock(videoRef.current?.addEventListener).mock
      .calls[0][1];
    expect(typeof captureOnPlaying).toBe('function');
    captureOnPlaying();
    unmount();
    expect(videoRef.current?.removeEventListener).toHaveBeenCalledWith(
      'play',
      captureOnPlaying,
    );
  });
  test('Event `pause`: Adds and Removes event listener correctly', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: videoRef });
    const { unmount } = render(renderCaptionButton());
    let captureOnPlaying;
    expect(videoRef.current?.addEventListener).toHaveBeenCalledWith(
      'pause',
      expect.any(Function),
    );
    captureOnPlaying = asMock(videoRef.current?.addEventListener).mock
      .calls[1][1];
    expect(typeof captureOnPlaying).toBe('function');
    captureOnPlaying();
    unmount();
    expect(videoRef.current?.removeEventListener).toHaveBeenCalledWith(
      'pause',
      captureOnPlaying,
    );
  });
  test('Event `ended`: Adds and Removes event listener correctly', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: videoRef });
    const { unmount } = render(renderCaptionButton());
    let captureOnPlaying;
    expect(videoRef.current?.addEventListener).toHaveBeenCalledWith(
      'ended',
      expect.any(Function),
    );
    captureOnPlaying = asMock(videoRef.current?.addEventListener).mock
      .calls[2][1];
    expect(typeof captureOnPlaying).toBe('function');
    captureOnPlaying();
    unmount();
    expect(videoRef.current?.removeEventListener).toHaveBeenCalledWith(
      'ended',
      captureOnPlaying,
    );
  });
});

describe('PlayPauseButton onPress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('function needs to be called on press with pause true', () => {
    const { getByTestId } = render(
      renderCaptionButton({
        videoRef: {
          current: {
            ...videoRef.current,
            paused: jest.fn(() => false),
            ended: jest.fn(() => false),
          } as unknown as VideoPlayer,
        },
      }),
    );
    playMock();
    fireEvent.press(getByTestId('player-btn-play-pause'));
    pauseMock();
    expect(videoRef.current?.pause).toHaveBeenCalled();
    expect(getMockPlaybackEventForVideo).toBeDefined();
  });
  it('function needs to be called on press', () => {
    const { getByTestId } = render(
      renderCaptionButton({
        videoRef: {
          current: {
            ...videoRef.current,
            paused: jest.fn(() => true),
            ended: jest.fn(() => true),
          } as unknown as VideoPlayer,
        },
      }),
    );
    fireEvent.press(getByTestId('player-btn-play-pause'));
    expect(videoRef.current?.play).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: Creating playbackEvent object in play',
    );
  });
});
