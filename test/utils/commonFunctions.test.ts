import { throttleFactory } from '../../src/utils/commonFunctions';

const THROTTLE_INTERVAL_MS = 1000;

const mockFunction = jest.fn();

describe('throttleFactory', () => {
  jest.useFakeTimers();

  let throttler;

  const setupThrottler = (intervalInMs = THROTTLE_INTERVAL_MS) => {
    throttler = throttleFactory(intervalInMs, mockFunction);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupThrottler(); // setup throttler before each test
  });

  it('should call the function immediately on the first call', () => {
    throttler.throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should not call the function again within the delay period', () => {
    throttler.throttledFunction();
    throttler.throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(THROTTLE_INTERVAL_MS / 2); // simulate half of throttle passing

    throttler.throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should call the function again after the delay period', () => {
    throttler.throttledFunction();
    jest.advanceTimersByTime(THROTTLE_INTERVAL_MS); // simulate throttle interval passing

    throttler.throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to the throttled function', () => {
    throttler.throttledFunction('arg1', 'arg2');

    expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use the correct delay value from the factory', () => {
    setupThrottler(2 * THROTTLE_INTERVAL_MS); // override throttler delay time

    throttler.throttledFunction();
    jest.advanceTimersByTime(THROTTLE_INTERVAL_MS); // simulate throttle interval passing

    throttler.throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(THROTTLE_INTERVAL_MS); // simulate throttle interval passing

    throttler.throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(2);
  });
});
