// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { HeadlessEntryPointRegistry } from '@amazon-devices/headless-task-manager';

import { default as doEpgSyncTask } from './src/livetv/task/EpgSyncTask';
import { default as doOnInstallOrUpdateTask } from './src/livetv/task/OnInstallOrUpdateTask';

HeadlessEntryPointRegistry.registerHeadlessEntryPoint(
  'com.amazondeveloper.keplervideoapp.onInstallOrUpdateTask::doTask',
  () => doOnInstallOrUpdateTask,
);

HeadlessEntryPointRegistry.registerHeadlessEntryPoint(
  'com.amazondeveloper.keplervideoapp.epgSyncTask::doTask',
  () => doEpgSyncTask,
);
