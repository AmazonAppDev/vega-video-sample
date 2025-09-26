import { useCallback, useEffect, useRef } from 'react';
import {
  DISMISS_CONTROLS_DELAY,
  WAIT_FOR_EVENTS,
} from '../../../utils/videoPlayerValues';

export function useMediaControls(
  showMediaControls: boolean,
  setShowMediaControls: (show: boolean) => void,
) {
  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);
  const throttlingRef = useRef(false);

  const cancelTimer = useCallback(() => {
    if (timer.current) {
      throttlingRef.current = false;
      clearTimeout(timer.current);
    }
  }, []);

  const dismissControls = useCallback(() => {
    setShowMediaControls(false);
  }, [setShowMediaControls]);

  const showControls = useCallback(() => {
    setShowMediaControls(true);
  }, [setShowMediaControls]);

  const throttleDismissControls = useCallback(
    (func: () => void, delay: number) => {
      if (!throttlingRef.current) {
        throttlingRef.current = true;
        func();
        setTimeout(() => {
          throttlingRef.current = false;
        }, delay);
      }
    },
    [],
  );

  const startTimerToDismissControls = useCallback(() => {
    timer.current = setTimeout(() => {
      dismissControls();
    }, DISMISS_CONTROLS_DELAY);
  }, [dismissControls]);

  useEffect(() => {
    if (showMediaControls) {
      cancelTimer();
      startTimerToDismissControls();
    }

    return () => {
      cancelTimer();
    };
  }, [showMediaControls, startTimerToDismissControls, cancelTimer]);

  const handleShowControls = useCallback(() => {
    showControls();
  }, [showControls]);

  const handleShowControlsOnKeyEvent = useCallback(() => {
    if (!showMediaControls) {
      handleShowControls();
    } else {
      cancelTimer();
      throttleDismissControls(startTimerToDismissControls, WAIT_FOR_EVENTS);
    }
  }, [
    cancelTimer,
    throttleDismissControls,
    handleShowControls,
    startTimerToDismissControls,
    showMediaControls,
  ]);

  return {
    handleShowControls,
    handleShowControlsOnKeyEvent,
    cancelTimer,
  };
}
