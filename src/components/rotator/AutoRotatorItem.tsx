// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import isEqual from 'lodash/isEqual';
import React from 'react';
import { Animated, ImageBackground, StyleSheet } from 'react-native';
import MoreDetailsDisplayView from './MoreDetailsDisplayView';
import { width } from './rotatorConfig';
import { RotatorData } from './type';

interface AutoRotatorItemProps {
  data: RotatorData;
}

const AutoRotatorItem = ({ data }: { data: RotatorData }) => {
  return (
    <Animated.View style={styles.RotatorItem}>
      <ImageBackground
        style={[styles.infoContainerView]}
        source={{
          uri: data.posterUrl,
        }}>
        <MoreDetailsDisplayView data={data} />
      </ImageBackground>
    </Animated.View>
  );
};

const areAutoRotatorItemPropsEqual = (
  prevProps: AutoRotatorItemProps,
  nextProps: AutoRotatorItemProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};

export default React.memo(AutoRotatorItem, areAutoRotatorItemPropsEqual);

const styles = StyleSheet.create({
  RotatorItem: {
    width: width,
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    opacity: 1,
  },
  infoContainerView: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
});
