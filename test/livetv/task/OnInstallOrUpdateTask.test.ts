// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { EpgSyncTaskScheduler } from '@amazon-devices/kepler-epg-sync-scheduler';

import 'react-native';
import { default as doTask } from '../../../src/livetv/task/OnInstallOrUpdateTask';

jest.mock('@amazon-devices/kepler-epg-sync-scheduler', () => ({
  EpgSyncTaskScheduler: {
    scheduleTask: jest.fn((_componentId: string, _interval: number) =>
      Promise.resolve(),
    ),
  },
}));

describe('OnInstall Task Test', () => {
  it('should be able to call doTask and execute scheduleTask function', async () => {
    await expect(doTask()).resolves.toBeUndefined();
    expect(EpgSyncTaskScheduler.scheduleTask).toBeCalledTimes(1);
  });
});
