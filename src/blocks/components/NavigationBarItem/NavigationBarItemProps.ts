// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { StyleProp, ViewStyle } from 'react-native';

import { NavBarItemAction } from '../NavigationBarItem';

export interface NavigationBarItemProps {
  style?: StyleProp<ViewStyle>;
  item: NavBarItemAction;
  onFocus?: () => void;
  onPress?: () => void;
  isSelected: boolean;
  showIcon?: boolean;
  showText?: boolean;
}
