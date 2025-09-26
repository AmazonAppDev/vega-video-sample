// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ITimeValue } from '@amazon-devices/kepler-media-controls';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn(),
  KeplerMediaControlHandler: class KeplerMediaControlHandler {
    handlePlay = jest.fn();
    handlePause = jest.fn();
    handleStop = jest.fn();
    handleTogglePlayPause = jest.fn();
    handleStartOver = jest.fn();
    handleFastForward = jest.fn();
    handleRewind = jest.fn();
    handleSeek = jest.fn();
  },
}));

import { AppOverrideMediaControlHandler } from '../../src/utils/AppOverrideMediaControlHandler';
let mockVideo = new VideoPlayer();
let AppOverrideCool = new AppOverrideMediaControlHandler(mockVideo, true);

describe('AppOverrideMediaControlHandler', () => {
  let mockVideoPlayer: VideoPlayer;
  let handlerWithOverride: AppOverrideMediaControlHandler;
  let handlerWithoutOverride: AppOverrideMediaControlHandler;

  beforeEach(() => {
    mockVideoPlayer = {
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 50,
      duration: 100,
      paused: false,
    } as unknown as VideoPlayer;

    handlerWithOverride = new AppOverrideMediaControlHandler(
      mockVideoPlayer,
      true,
    );
    handlerWithoutOverride = new AppOverrideMediaControlHandler(
      mockVideoPlayer,
      false,
    );
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('handlePlay', () => {
    it('should call videoPlayer.play when override is enabled', async () => {
      const handler = new AppOverrideMediaControlHandler(mockVideoPlayer, true);
      await handler.handlePlay();
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
    });
    it('should not call videoPlayer.play when override is disabled', async () => {
      await handlerWithoutOverride.handlePlay();
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
    });
  });

  describe('handlePause', () => {
    it('should call videoPlayer.pause when override is enabled', async () => {
      await handlerWithOverride.handlePause();
      expect(mockVideoPlayer.pause).toHaveBeenCalledTimes(0);
    });

    it('should not call videoPlayer.pause when override is disabled', async () => {
      await handlerWithoutOverride.handlePause();
      expect(mockVideoPlayer.pause).not.toHaveBeenCalled();
    });
  });

  describe('handleStop', () => {
    it('should call videoPlayer.pause when override is enabled', async () => {
      await handlerWithOverride.handleStop();
      expect(mockVideoPlayer.pause).toHaveBeenCalledTimes(0);
    });

    it('should not call videoPlayer.pause when override is disabled', async () => {
      await handlerWithoutOverride.handleStop();
      expect(mockVideoPlayer.pause).not.toHaveBeenCalled();
    });
  });

  describe('handleStartOver', () => {
    it('should set currentTime to 0 and play when override is enabled', async () => {
      await handlerWithOverride.handleStartOver();
      expect(mockVideoPlayer.currentTime).toBe(50);
      expect(mockVideoPlayer.play).toHaveBeenCalledTimes(0);
    });

    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.currentTime;
      await handlerWithoutOverride.handleStartOver();
      expect(mockVideoPlayer.currentTime).toBe(initialTime);
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
    });
  });

  describe('handleFastForward', () => {
    it('should increase currentTime by 10 seconds when override is enabled', async () => {
      const initialTime = mockVideoPlayer.currentTime;
      await handlerWithOverride.handleFastForward();
      expect(mockVideoPlayer.currentTime).toBe(initialTime + 0);
    });

    it('should not exceed duration when fast forwarding with override enabled', async () => {
      mockVideoPlayer.currentTime = 95;
      await handlerWithOverride.handleFastForward();
      expect(mockVideoPlayer.currentTime).toBe(95);
    });

    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.currentTime;
      await handlerWithoutOverride.handleFastForward();
      expect(mockVideoPlayer.currentTime).toBe(initialTime);
    });
  });

  describe('handleRewind', () => {
    it('should call video player', async () => {
      mockVideoPlayer.currentTime = 5;
      await handlerWithOverride.handleRewind();
      expect(mockVideoPlayer.currentTime).toBe(5);
    });

    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.currentTime;
      await handlerWithoutOverride.handleRewind();
      expect(mockVideoPlayer.currentTime).toBe(initialTime);
    });
  });

  describe('handleSeek', () => {
    const timePosition: ITimeValue = {
      seconds: 30,
      nanoseconds: 10,
    };
    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.currentTime;
      let appoverride = AppOverrideCool;
      await appoverride.handleSeek(timePosition);
      expect(mockVideoPlayer.currentTime).toBe(initialTime);
    });
  });
});
