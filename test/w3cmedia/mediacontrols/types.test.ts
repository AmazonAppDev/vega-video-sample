// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import type {
  CaptionButtonProps,
  CaptionMenuItemProps,
  CaptionMenuProps,
  CaptionOptionProps,
} from '../../../src/w3cmedia/mediacontrols/types/Captions';
import { PlayerControlType } from '../../../src/w3cmedia/mediacontrols/types/ControlBar';

describe('MediaControls Types', () => {
  describe('PlayerControlType enum', () => {
    it('should have correct enum values', () => {
      expect(PlayerControlType.PLAY).toBe('play');
      expect(PlayerControlType.PAUSE).toBe('pause');
      expect(PlayerControlType.PLAYPAUSE).toBe('playpause');
      expect(PlayerControlType.SKIPBACKWARD).toBe('skip_backward');
      expect(PlayerControlType.SKIPFORWARD).toBe('skip_forward');
    });

    it('should have all expected enum keys', () => {
      const enumKeys = Object.keys(PlayerControlType);
      expect(enumKeys).toContain('PLAY');
      expect(enumKeys).toContain('PAUSE');
      expect(enumKeys).toContain('PLAYPAUSE');
      expect(enumKeys).toContain('SKIPBACKWARD');
      expect(enumKeys).toContain('SKIPFORWARD');
    });

    it('should have correct number of enum values', () => {
      const enumValues = Object.values(PlayerControlType);
      expect(enumValues).toHaveLength(5);
    });

    it('should be able to use enum in switch statement', () => {
      const getControlAction = (controlType: PlayerControlType): string => {
        switch (controlType) {
          case PlayerControlType.PLAY:
            return 'Playing';
          case PlayerControlType.PAUSE:
            return 'Paused';
          case PlayerControlType.PLAYPAUSE:
            return 'Toggle PlayPause';
          case PlayerControlType.SKIPBACKWARD:
            return 'Skip Backward';
          case PlayerControlType.SKIPFORWARD:
            return 'Skip Forward';
          default:
            return 'Unknown';
        }
      };

      expect(getControlAction(PlayerControlType.PLAY)).toBe('Playing');
      expect(getControlAction(PlayerControlType.PAUSE)).toBe('Paused');
      expect(getControlAction(PlayerControlType.PLAYPAUSE)).toBe(
        'Toggle PlayPause',
      );
      expect(getControlAction(PlayerControlType.SKIPBACKWARD)).toBe(
        'Skip Backward',
      );
      expect(getControlAction(PlayerControlType.SKIPFORWARD)).toBe(
        'Skip Forward',
      );
    });
  });

  describe('Caption Types', () => {
    it('should be able to create objects matching the interfaces', () => {
      // Mock video player object
      const mockVideo = {
        play: jest.fn(),
        pause: jest.fn(),
        seekTo: jest.fn(),
      } as any;

      // Test CaptionButtonProps interface
      const captionButtonProps: CaptionButtonProps = {
        onPress: jest.fn(),
        video: mockVideo,
        captionMenuVisibility: true,
        testID: 'test-caption-button',
        playerControlType: PlayerControlType.PLAYPAUSE,
        isCaptionButtonFocused: true,
      };

      expect(captionButtonProps.onPress).toBeDefined();
      expect(captionButtonProps.video).toBe(mockVideo);
      expect(captionButtonProps.captionMenuVisibility).toBe(true);
      expect(captionButtonProps.testID).toBe('test-caption-button');
      expect(captionButtonProps.playerControlType).toBe(
        PlayerControlType.PLAYPAUSE,
      );
      expect(captionButtonProps.isCaptionButtonFocused).toBe(true);
    });

    it('should handle optional properties in CaptionButtonProps', () => {
      const mockVideo = { play: jest.fn() } as any;

      const captionButtonProps: CaptionButtonProps = {
        onPress: jest.fn(),
        video: mockVideo,
        captionMenuVisibility: false,
        testID: 'test-id',
        isCaptionButtonFocused: null,
        // playerControlType is optional
      };

      expect(captionButtonProps.playerControlType).toBeUndefined();
      expect(captionButtonProps.isCaptionButtonFocused).toBeNull();
    });

    it('should create CaptionOptionProps objects', () => {
      const mockVideo = { play: jest.fn() } as any;
      const mockEnableCaption = jest.fn();

      const captionOptionProps: CaptionOptionProps = {
        video: mockVideo,
        enableCaption: mockEnableCaption,
        selectedCaptionId: 'en-US',
      };

      expect(captionOptionProps.video).toBe(mockVideo);
      expect(captionOptionProps.enableCaption).toBe(mockEnableCaption);
      expect(captionOptionProps.selectedCaptionId).toBe('en-US');
    });

    it('should handle null selectedCaptionId in CaptionOptionProps', () => {
      const mockVideo = { play: jest.fn() } as any;

      const captionOptionProps: CaptionOptionProps = {
        video: mockVideo,
        enableCaption: jest.fn(),
        selectedCaptionId: null,
      };

      expect(captionOptionProps.selectedCaptionId).toBeNull();
    });

    it('should create CaptionMenuItemProps objects', () => {
      const captionMenuItemProps: CaptionMenuItemProps = {
        text: 'English',
        index: '0',
        selected: true,
        onPress: jest.fn(),
        testID: 'caption-item-en',
      };

      expect(captionMenuItemProps.text).toBe('English');
      expect(captionMenuItemProps.index).toBe('0');
      expect(captionMenuItemProps.selected).toBe(true);
      expect(captionMenuItemProps.onPress).toBeDefined();
      expect(captionMenuItemProps.testID).toBe('caption-item-en');
    });

    it('should handle optional properties in CaptionMenuItemProps', () => {
      const captionMenuItemProps: CaptionMenuItemProps = {
        text: 'Spanish',
        onPress: jest.fn(),
        // index, selected, and testID are optional
      };

      expect(captionMenuItemProps.index).toBeUndefined();
      expect(captionMenuItemProps.selected).toBeUndefined();
      expect(captionMenuItemProps.testID).toBeUndefined();
    });

    it('should create CaptionMenuProps objects', () => {
      const mockVideo = { play: jest.fn() } as any;

      const captionMenuProps: CaptionMenuProps = {
        captionMenuVisibility: true,
        video: mockVideo,
        setSelectedCaption: jest.fn(),
        setCaptionMenuVisibility: jest.fn(),
      };

      expect(captionMenuProps.captionMenuVisibility).toBe(true);
      expect(captionMenuProps.setCaptionMenuVisibility).toBeDefined();
      expect(captionMenuProps.video).toBe(mockVideo);
      expect(captionMenuProps.setSelectedCaption).toBeDefined();
    });
  });
});
