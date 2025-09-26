// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { HeadlessEntryPointRegistry } from '@amazon-devices/headless-task-manager';
import {
  onStartDataRefreshService,
  onStopDataRefreshService,
} from './src/headless/DataRefreshService';

import { onStartService, onStopService } from './src/AccountLoginWrapper';

HeadlessEntryPointRegistry.registerHeadlessEntryPoint2(
  'com.amazondeveloper.keplervideoapp.content.dataRefresh.provider::onStartService',
  () => onStartDataRefreshService,
);

HeadlessEntryPointRegistry.registerHeadlessEntryPoint2(
  'com.amazondeveloper.keplervideoapp.content.dataRefresh.provider::onStopService',
  () => onStopDataRefreshService,
);

HeadlessEntryPointRegistry.registerHeadlessEntryPoint2(
  'com.amazondeveloper.keplervideoapp.interface.provider::onStartService',
  () => onStartService,
);

HeadlessEntryPointRegistry.registerHeadlessEntryPoint2(
  'com.amazondeveloper.keplervideoapp.interface.provider::onStopService',
  () => onStopService,
);
