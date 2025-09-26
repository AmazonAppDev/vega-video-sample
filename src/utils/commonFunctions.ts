export function customFormatDate(date: Date | null): string {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date object');
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const toHoursMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  return `${hours} hrs : ${minutesLeft < 10 ? '0' : ''}${minutesLeft} mins`;
};

/**
 * Formats a duration in seconds into a human-readable time string.
 *
 * @param totalSeconds - The total number of seconds to format. Can include decimal values,
 *                      which will be rounded to the nearest whole number.
 * @returns A formatted time string in either "MM:SS" format (for durations less than an hour)
 *          or "HH:MM:SS" format (for durations of an hour or more).
 *
 */
export const formatTime = (totalSeconds: number): string => {
  // Handle NaN, undefined, or negative values
  if (
    Number.isNaN(totalSeconds) ||
    totalSeconds === undefined ||
    totalSeconds < 0
  ) {
    totalSeconds = 0;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return totalSeconds >= 3600
    ? `${hours.toString().padStart(2, '0')}:${mm}:${ss}`
    : `${mm}:${ss}`;
};

/**
 * Creates a throttled version of a function that limits the rate at which the function can be called.
 * When the throttled function is called, it will only execute if enough time (specified by delay)
 * has passed since its last execution. Any calls made before the delay period has elapsed will
 * be ignored.
 *
 * @param {number} delayInMs - The minimum time (in milliseconds) that must pass between function calls.
 * @param {Function} functionToThrottle - The function to be throttled.
 * @returns {Object} An object containing:
 *   - lastFunctionCallTime: Tracks the timestamp of the last function execution
 *   - delayInMs: The specified delay in miliseconds between allowed function calls
 *   - functionToThrottle: The original function being throttled
 *   - throttledFunction: The throttled version of the original function
 *
 * @example
 * // Create a throttled console.log that can only be called once every 1000ms
 * const throttledLogger = throttleFactory(1000, () => console.log('Throttled log'));
 */
export const throttleFactory = function (
  delayInMs: number,
  functionToThrottle: () => void,
) {
  return {
    lastFunctionCallTime: 0,
    delayInMs: delayInMs,
    functionToThrottle: functionToThrottle,
    throttledFunction: function (...args: any) {
      const now = Date.now();

      if (now - this.lastFunctionCallTime >= this.delayInMs) {
        this.lastFunctionCallTime = now;

        this.functionToThrottle.apply(this, args);
      }
    },
  };
};
