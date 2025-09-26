// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Suspense } from 'react';
import BufferingWindow from './BufferingWindow';
const SearchScreen = React.lazy(() => import('../screens/SearchScreen'));

const SearchWithSuspense = (props) => (
  <Suspense fallback={<BufferingWindow />}>
    <SearchScreen {...props} />
  </Suspense>
);
export default SearchWithSuspense;
