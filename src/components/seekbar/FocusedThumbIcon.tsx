// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../styles/Colors';

const FocusedThumbIcon = () => {
  return <View testID="focused-thumb-icon" style={styles.thumbIcon} />;
};

const styles = StyleSheet.create({
  thumbIcon: {
    height: 32,
    width: 32,
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FocusedThumbIcon;
