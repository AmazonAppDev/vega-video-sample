// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import MaterialIcons from '@amazon-devices/react-native-vector-icons/MaterialIcons';
import React from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { COLORS } from '../styles/Colors';
import { areComponentPropsEqual } from '../utils/lodashHelper';
import { scaleUxToDp } from '../utils/pixelUtils';
import FocusableElement from './FocusableElement';

interface BackButtonProps {
  onPress: () => void;
  overrideStyle?: StyleProp<ViewStyle>;
  hasTVPreferredFocus: boolean;
}

const BackButton = ({
  onPress,
  overrideStyle,
  hasTVPreferredFocus,
}: BackButtonProps) => {
  return (
    <FocusableElement
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={[styles.backButtonContainer, overrideStyle]}
      onFocusOverrideStyle={styles.backButtonFocus}
      onPress={onPress}>
      <Text testID={'header_back_icon'}>
        <MaterialIcons name={'chevron-left'} size={70} color={COLORS.WHITE} />
      </Text>
    </FocusableElement>
  );
};

const areBackButtonPropsEqual = (
  prevProps: BackButtonProps,
  nextProps: BackButtonProps,
) => {
  const excludedProps = ['onPress'];
  return areComponentPropsEqual(prevProps, nextProps, excludedProps);
};

export default React.memo(BackButton, areBackButtonPropsEqual);

const styles = StyleSheet.create({
  backButtonImage: {
    height: scaleUxToDp(70),
    width: scaleUxToDp(70),
    resizeMode: 'contain',
    tintColor: COLORS.WHITE,
  },
  backButtonContainer: {
    padding: scaleUxToDp(25),
    alignItems: 'center',
    flexDirection: 'row',
    width: scaleUxToDp(125),
  },
  backButtonFocus: {
    backgroundColor: COLORS.DARK_GRAY,
    borderRadius: scaleUxToDp(70),
  },
});
