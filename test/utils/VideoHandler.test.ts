// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React from 'react';
import { TitleData } from '../../src/types/TitleData';
import { VideoHandler } from '../../src/utils/VideoHandler';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn) => fn,
}));

jest.mock('@amazon-devices/react-native-w3cmedia');

jest.mock('../../src/utils/AppOverrideMediaControlHandler', () => ({
  AppOverrideMediaControlHandler: jest.fn(),
}));

describe('VideoHandler', () => {
  const createVideoHandler = () => {
    const mockVideoRef: React.MutableRefObject<VideoPlayer | null> = {
      current: null,
    };
    const mockPlayer: React.MutableRefObject<any | null> = { current: null };
    const mockSetIsVideoInitialized = jest.fn();
    const mockSetIsVideoEnded = jest.fn();
    const mockSetIsVideoError = jest.fn();
    const mockSetVideoPlayElapsedTimeM = jest.fn();
    const mockSetShowBuffering = jest.fn();

    // Mock data
    const mockData: TitleData = {
      id: '169313',
      title: 'Beautiful Whale Tail Uvita Costa Rica',
      description: 'Beautiful Whale Tail Uvita Costa Rica',
      duration: 86,
      thumbnail:
        'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
      posterUrl:
        'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
      uri: `boat-sailing.mp4`,
      thumbnailUrl: `boat-sailing-hd/`,
      categories: ['Costa Rica Islands'],
      channelID: '13454',
      mediaType: 'video',
      mediaSourceType: 'url',
      format: 'MP4',
      secure: false,
      uhd: false,
      rentAmount: '100',
    } as TitleData;

    return {
      mockVideoRef,
      mockPlayer,
      mockData,
      mockSetIsVideoInitialized,
      mockSetIsVideoEnded,
      mockSetIsVideoError,
      mockSetVideoPlayElapsedTimeM,
      mockSetShowBuffering,
      videoHandler: new VideoHandler(
        mockVideoRef,
        mockPlayer,
        mockData as any,
        mockSetIsVideoInitialized,
        mockSetIsVideoEnded,
        mockSetIsVideoError,
        mockSetVideoPlayElapsedTimeM,
        mockSetShowBuffering,
      ),
    };
  };

  describe('preBufferVideo', () => {
    it('should initialize video player and setup event listeners', async () => {
      const { mockVideoRef, videoHandler } = createVideoHandler();

      videoHandler.setupEventListeners = jest.fn();
      videoHandler.loadVideoElements = jest.fn();
      videoHandler.destroyVideoElements = jest.fn().mockResolvedValue(true);

      const mockInitialize = jest.fn().mockResolvedValue(undefined);
      mockVideoRef.current = {
        initialize: mockInitialize,
        setMediaControlFocus: jest.fn(),
      } as unknown as VideoPlayer;

      await videoHandler.preBufferVideo();

      expect(videoHandler.destroyVideoElements).toBeCalled();
      expect(mockInitialize).toHaveBeenCalled();
      expect(videoHandler.setupEventListeners).toBeCalled();
      expect(videoHandler.loadVideoElements).toBeCalled();
      expect(global.gmedia).toBe(mockVideoRef.current);
      expect(mockVideoRef.current.autoplay).toBe(false);
      expect(mockVideoRef.current).not.toBeNull();
    });
  });

  describe('destroyMediaPlayerSync', () => {
    it('should successfully destroy media player for MP4 content', () => {
      const { mockVideoRef, videoHandler } = createVideoHandler();

      const mockPause = jest.fn();
      const mockDeinitializeSync = jest.fn().mockReturnValue('success');

      mockVideoRef.current = {
        pause: mockPause,
        deinitializeSync: mockDeinitializeSync,
      } as unknown as VideoPlayer;

      videoHandler.removeEventListeners = jest.fn();

      (global as any).gmedia = mockVideoRef.current;

      const result = videoHandler.destroyMediaPlayerSync();

      expect(mockPause).toHaveBeenCalled();
      expect(videoHandler.removeEventListeners).toHaveBeenCalled();
      expect(mockDeinitializeSync).toHaveBeenCalledWith(1500);
      expect(mockVideoRef.current).toBeNull();
      expect(global.gmedia).toBeNull();
      expect(result).toBe(true);
    });

    it('should handle adaptive media player destruction', () => {
      const { mockVideoRef, mockPlayer, videoHandler } = createVideoHandler();

      videoHandler.selectedFileType = 'HLS';

      const mockPause = jest.fn();
      const mockDeinitializeSync = jest.fn().mockReturnValue('success');
      const mockUnload = jest.fn();

      mockVideoRef.current = {
        pause: mockPause,
        deinitializeSync: mockDeinitializeSync,
      } as unknown as VideoPlayer;

      mockPlayer.current = {
        unload: mockUnload,
      };

      videoHandler.removeEventListeners = jest.fn();

      const result = videoHandler.destroyMediaPlayerSync();

      expect(mockPause).toHaveBeenCalled();
      expect(videoHandler.removeEventListeners).toHaveBeenCalled();
      expect(mockUnload).toHaveBeenCalled();
      expect(mockPlayer.current).toBeNull();
      expect(mockDeinitializeSync).toHaveBeenCalledWith(1500);
      expect(result).toBe(true);
    });
  });
});
