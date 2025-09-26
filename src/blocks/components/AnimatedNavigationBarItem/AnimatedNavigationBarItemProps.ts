// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Animated } from 'react-native';
import { NavigationBarItemProps } from '../NavigationBarItem/NavigationBarItemProps';

export interface AnimatedNavigationBarItemProps extends NavigationBarItemProps {
  isActive: boolean;
  onFocusChangeListener: (isFocused: boolean) => void;
  translateAnimatedValue: Animated.Value;
  opacityAnimatedValue: Animated.Value;
}
