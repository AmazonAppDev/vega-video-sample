// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { act, renderHook } from '@testing-library/react-native';
import { useMediaControls } from '../../../src/w3cmedia/mediacontrols/types/useMediaControls';

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('useMediaControls', () => {
  const mockSetShowMediaControls = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('should return correct functions', () => {
    const { result } = renderHook(() =>
      useMediaControls(false, mockSetShowMediaControls),
    );

    expect(result.current.handleShowControls).toBeDefined();
    expect(result.current.handleShowControlsOnKeyEvent).toBeDefined();
    expect(result.current.cancelTimer).toBeDefined();
  });

  it('should show controls when handleShowControls is called', () => {
    const { result } = renderHook(() =>
      useMediaControls(false, mockSetShowMediaControls),
    );

    act(() => {
      result.current.handleShowControls();
    });

    expect(mockSetShowMediaControls).toHaveBeenCalledWith(true);
  });

  it('should start timer to dismiss controls when showMediaControls becomes true', () => {
    const { rerender } = renderHook(
      ({ showMediaControls }) =>
        useMediaControls(showMediaControls, mockSetShowMediaControls),
      { initialProps: { showMediaControls: false } },
    );

    // Change showMediaControls to true
    rerender({ showMediaControls: true });

    // Fast-forward time to trigger the timer
    act(() => {
      jest.advanceTimersByTime(5000); // DISMISS_CONTROLS_DELAY
    });

    expect(mockSetShowMediaControls).toHaveBeenCalledWith(false);
  });

  it('should cancel timer when cancelTimer is called', () => {
    const { result } = renderHook(() =>
      useMediaControls(true, mockSetShowMediaControls),
    );

    act(() => {
      result.current.cancelTimer();
    });

    // Fast-forward time - timer should not fire
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Should not have been called to dismiss controls
    expect(mockSetShowMediaControls).not.toHaveBeenCalledWith(false);
  });

  it('should handle showControlsOnKeyEvent when controls are not visible', () => {
    const { result } = renderHook(() =>
      useMediaControls(false, mockSetShowMediaControls),
    );

    act(() => {
      result.current.handleShowControlsOnKeyEvent();
    });

    expect(mockSetShowMediaControls).toHaveBeenCalledWith(true);
  });

  it('should handle showControlsOnKeyEvent when controls are visible', () => {
    const { result } = renderHook(() =>
      useMediaControls(true, mockSetShowMediaControls),
    );

    act(() => {
      result.current.handleShowControlsOnKeyEvent();
    });

    // Should not immediately call setShowMediaControls
    expect(mockSetShowMediaControls).not.toHaveBeenCalled();
  });

  it('should throttle dismiss controls when showControlsOnKeyEvent is called with visible controls', () => {
    const { result } = renderHook(() =>
      useMediaControls(true, mockSetShowMediaControls),
    );

    // Call multiple times rapidly
    act(() => {
      result.current.handleShowControlsOnKeyEvent();
      result.current.handleShowControlsOnKeyEvent();
      result.current.handleShowControlsOnKeyEvent();
    });

    // Fast-forward through throttle delay
    act(() => {
      jest.advanceTimersByTime(3000); // WAIT_FOR_EVENTS
    });

    // Fast-forward through dismiss delay
    act(() => {
      jest.advanceTimersByTime(5000); // DISMISS_CONTROLS_DELAY
    });

    expect(mockSetShowMediaControls).toHaveBeenCalledWith(false);
  });

  it('should cancel timer on cleanup', () => {
    const { unmount } = renderHook(() =>
      useMediaControls(true, mockSetShowMediaControls),
    );

    unmount();

    // Fast-forward time - timer should not fire after unmount
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockSetShowMediaControls).not.toHaveBeenCalledWith(false);
  });

  it('should handle timer cancellation when timer is null', () => {
    const { result } = renderHook(() =>
      useMediaControls(false, mockSetShowMediaControls),
    );

    // Should not throw error when timer is null
    act(() => {
      result.current.cancelTimer();
    });

    expect(() => result.current.cancelTimer()).not.toThrow();
  });

  it('should handle rapid show/hide state changes', () => {
    const { rerender } = renderHook(
      ({ showMediaControls }) =>
        useMediaControls(showMediaControls, mockSetShowMediaControls),
      { initialProps: { showMediaControls: false } },
    );

    // Rapid state changes
    rerender({ showMediaControls: true });
    rerender({ showMediaControls: false });
    rerender({ showMediaControls: true });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockSetShowMediaControls).toHaveBeenCalledWith(false);
  });

  it('should handle throttling edge cases', () => {
    const { result } = renderHook(() =>
      useMediaControls(true, mockSetShowMediaControls),
    );

    // First call should work
    act(() => {
      result.current.handleShowControlsOnKeyEvent();
    });

    // Immediate second call should be throttled
    act(() => {
      result.current.handleShowControlsOnKeyEvent();
    });

    // Wait for throttle delay
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Now another call should work
    act(() => {
      result.current.handleShowControlsOnKeyEvent();
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockSetShowMediaControls).toHaveBeenCalledWith(false);
  });
});
