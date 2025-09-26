// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import isEqual from 'lodash/isEqual';
import React, { Ref, useState } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface FocusableElementProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  getFocusState?: (value: boolean) => void;
  onFocusOverrideStyle: StyleProp<ViewStyle>;
  onPress?: () => void;
  hasTVPreferredFocus?: boolean;
  focusableElementRef?: Ref<TouchableOpacity>;
  style: StyleProp<ViewStyle>;
}

const FocusableElement = ({
  focusableElementRef,
  children,
  onPress,
  onBlur,
  onFocus,
  getFocusState,
  onFocusOverrideStyle,
  style,
  hasTVPreferredFocus,
  ...otherProps
}: FocusableElementProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusHandler = () => {
    setIsFocused(true);
    getFocusState?.(true);
    onFocus?.();
  };
  const blurHandler = () => {
    setIsFocused(false);
    getFocusState?.(false);
    onBlur?.();
  };

  return (
    <TouchableOpacity
      ref={focusableElementRef}
      activeOpacity={1}
      hasTVPreferredFocus={hasTVPreferredFocus}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onPress={onPress}
      style={[style, isFocused ? onFocusOverrideStyle : undefined]}
      testID={otherProps.testID}
      {...otherProps}>
      {children}
    </TouchableOpacity>
  );
};

const areFocusableElementPropsEqual = (
  prevProps: FocusableElementProps,
  nextProps: FocusableElementProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(FocusableElement, areFocusableElementPropsEqual);
