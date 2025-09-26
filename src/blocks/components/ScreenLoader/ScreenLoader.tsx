// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ActivityIndicator, View } from 'react-native';

import React from 'react';
import { ScreenLoaderProps } from './ScreenLoaderProps';
import { ScreenLoaderStyle } from './ScreenLoaderStyle';

export const ScreenLoader = ({ testID, style, size }: ScreenLoaderProps) => {
  const { screenLoaderDefault } = ScreenLoaderStyle();
  return (
    <View testID={testID} style={[screenLoaderDefault, style]}>
      <ActivityIndicator size={size ?? 'small'} />
    </View>
  );
};
