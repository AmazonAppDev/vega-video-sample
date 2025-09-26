// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import isEqual from 'lodash/isEqual';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { RotatorData } from './type';

interface MoreDetailsDisplayProps {
  data: RotatorData;
}

const MoreDetailsDisplayView = ({ data }: { data: RotatorData }) => {
  return (
    <Animated.View style={[styles.infoContainerView]}>
      <Animated.View style={[styles.InfoView]}>
        <Animated.View style={[styles.titleMoreDetailsDisplayView]}>
          <Text style={[styles.titleText]} testID={'carousel-title'}>
            {data.title}
          </Text>
        </Animated.View>
        <Text style={[styles.descriptionText]} testID={'carousel-sub-title'}>
          {data.description}
        </Text>
        <Text
          style={[styles.descriptionTypeText]}
          testID={'carousel-description-type'}>
          {data.descriptionType}
        </Text>
      </Animated.View>
      <View style={[styles.InfoView]} />
    </Animated.View>
  );
};

const areMoreDetailsDisplayPropsEqual = (
  prevProps: MoreDetailsDisplayProps,
  nextProps: MoreDetailsDisplayProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};

export default React.memo(
  MoreDetailsDisplayView,
  areMoreDetailsDisplayPropsEqual,
);

const styles = StyleSheet.create({
  infoContainerView: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  titleMoreDetailsDisplayView: {
    borderRadius: scaleUxToDp(10),
    justifyContent: 'flex-end',
    width: '80%',
    height: scaleUxToDp(180),
    opacity: 1,
    marginTop: '10%',
  },
  titleText: {
    fontSize: scaleUxToDp(54),
    fontWeight: '700',
    width: '80%',
    height: scaleUxToDp(100),
    color: COLORS.WHITE,
  },
  descriptionText: {
    fontSize: scaleUxToDp(24),
    fontWeight: '700',
    width: '80%',
    height: scaleUxToDp(50),
    color: COLORS.WHITE,
  },
  descriptionTypeText: {
    fontSize: scaleUxToDp(18),
    fontWeight: '400',
    width: '80%',
    color: COLORS.WHITE,
    opacity: 0.8,
    marginTop: scaleUxToDp(-10),
  },
  InfoView: {
    width: '100%',
    height: '50%',
    marginStart: '5%',
  },
});
