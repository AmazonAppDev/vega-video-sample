// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../styles/Colors';

const ThumbIcon = ({ focused }) => {
  return (
    <View
      testID="thumb-icon"
      style={focused ? styles.focused : styles.unfocused}
    />
  );
};

const styles = StyleSheet.create({
  focused: {
    height: 32,
    width: 32,
    backgroundColor: COLORS.ORANGE,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfocused: {
    height: 35,
    width: 10,
    backgroundColor: COLORS.SMOKE_WHITE,
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default ThumbIcon;
