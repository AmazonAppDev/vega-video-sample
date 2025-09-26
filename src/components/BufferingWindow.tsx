// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import LottieView from '@amazon-devices/lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

interface BufferingWindowProps {
  testID?: string;
  backgroundColor?: string;
}

const BufferingWindow = React.memo(
  ({
    testID = undefined,
    backgroundColor = undefined,
  }: BufferingWindowProps) => {
    return (
      <View
        testID={testID || 'buffering-view'}
        style={{
          ...styles.container,
          backgroundColor: backgroundColor || styles.container.backgroundColor,
        }}>
        <LottieView
          testID="video-buffer-view"
          source={require('../js/resources/loader.json')}
          autoPlay
          loop
          style={styles.loader}
        />
      </View>
    );
  },
);

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    flex: 1,
    backgroundColor: COLORS.BLACK,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  loader: {
    width: scaleUxToDp(80),
    height: scaleUxToDp(320),
    alignSelf: 'center',
  },
});
export default BufferingWindow;
