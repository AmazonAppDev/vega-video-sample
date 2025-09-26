const tick = () => new Promise((res) => setImmediate(res));

const advanceTimersByTime = async (time: number) =>
  jest.advanceTimersByTime(time) && (await tick());

const runOnlyPendingTimers = async () =>
  jest.runOnlyPendingTimers() && (await tick());

const runAllTimers = async () => jest.runAllTimers() && (await tick());

export { advanceTimersByTime, runAllTimers, runOnlyPendingTimers, tick };
