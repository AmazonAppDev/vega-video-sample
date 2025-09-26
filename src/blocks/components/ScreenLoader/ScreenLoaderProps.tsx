// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { ViewStyle } from 'react-native';

export interface ScreenLoaderProps {
  testID?: string;
  style?: ViewStyle;
  size?: number | 'small' | 'large' | undefined;
}
