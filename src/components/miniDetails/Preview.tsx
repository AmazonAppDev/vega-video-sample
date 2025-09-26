// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import { scaleUxToDp } from '../../utils/pixelUtils';
const LeftGradient = require('../../assets/mini_details_left_gradient.png');
const BottomGradient = require('../../assets/mini_details_bottom_gradient.png');

interface PreviewProps {
  posterUrl?: string;
}

const Preview = ({ posterUrl }: PreviewProps) => {
  return (
    <View style={styles.previewContent}>
      {posterUrl && (
        <Image
          testID={'poster-image'}
          style={styles.posterImage}
          source={{ uri: posterUrl }}
          resizeMode={'contain'}
        />
      )}
      <GradientOverlay />
    </View>
  );
};

const GradientOverlay = () => {
  return (
    <View>
      <Image
        style={styles.gradient}
        resizeMode={'contain'}
        source={LeftGradient}
        testID="left-gradient"
      />
      <Image
        style={styles.gradient}
        resizeMode={'contain'}
        source={BottomGradient}
        testID="bottom-gradient"
      />
    </View>
  );
};

const arePreviewPropsEqual = (
  prevProps: PreviewProps,
  nextProps: PreviewProps,
) => {
  return areComponentPropsEqual(prevProps.posterUrl, nextProps.posterUrl);
};

export default React.memo(Preview, arePreviewPropsEqual);

const styles = StyleSheet.create({
  gradient: {
    width: scaleUxToDp(1236),
    height: scaleUxToDp(696),
    position: 'absolute',
  },
  previewContent: {
    left: scaleUxToDp(682),
    position: 'absolute',
  },
  posterImage: {
    width: scaleUxToDp(1236),
    height: scaleUxToDp(696),
    position: 'absolute',
  },
});
