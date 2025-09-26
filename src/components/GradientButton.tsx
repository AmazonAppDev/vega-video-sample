// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Button, ButtonVariant } from '@amazon-devices/kepler-ui-components';
import LinearGradient from '@amazon-devices/react-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  colors: string[];
  buttonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  variant: ButtonVariant;
  labelStyle?: TextStyle;
  focusedStyle?: ViewStyle;
  borderRadius?: number;
  focusedBorderRadius?: number;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  colors,
  buttonStyle,
  containerStyle,
  variant,
  labelStyle,
  focusedStyle,
  borderRadius = scaleUxToDp(5),
  focusedBorderRadius = scaleUxToDp(10),
}) => {
  const [isFocused, setIsFocused] = useState(false);
  let borderRadiusStyle = isFocused
    ? { borderRadius: focusedBorderRadius }
    : { borderRadius };

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  return (
    <View
      style={[
        styles.buttonContainer,
        containerStyle,
        isFocused && [styles.focusedContainer, focusedStyle],
        borderRadiusStyle,
      ]}>
      <LinearGradient style={{ borderRadius }} colors={colors}>
        <Button
          label={label}
          style={[
            styles.button,
            buttonStyle,
            isFocused && styles.focusedButton,
            borderRadiusStyle,
          ]}
          variant={variant}
          onPress={onPress}
          onFocus={onFocus}
          onBlur={onBlur}
          labelStyle={[styles.label, labelStyle] as TextStyle}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 4,
    borderColor: 'transparent',
  },
  button: {
    backgroundColor: 'transparent',
  },
  label: {
    fontWeight: 'normal',
  },
  focusedContainer: {
    borderColor: COLORS.ORANGE,
  },
  focusedButton: {
    borderColor: 'transparent',
  },
});

export default GradientButton;
