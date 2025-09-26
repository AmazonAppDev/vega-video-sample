// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Suspense } from 'react';
import BufferingWindow from './BufferingWindow';
const SettingsScreen = React.lazy(() => import('../screens/SettingsScreen'));

const SettingsWithSuspense = (props) => (
  <Suspense fallback={<BufferingWindow />}>
    <SettingsScreen {...props} />
  </Suspense>
);
export default SettingsWithSuspense;
