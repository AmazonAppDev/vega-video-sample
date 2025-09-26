// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { L2_GRADIENT_COLORS } from '../constants';
import { COLORS } from '../styles/Colors';
import { TitleData } from '../types/TitleData';
import { scaleUxToDp } from '../utils/pixelUtils';
import { ContentDetail } from './ContentDetail';
import GradientButton from './GradientButton';

const LeftGradient = require('../assets/mini_details_left_gradient.png');

interface ContentPreviewProps {
  tile: TitleData;
  onFocus?: () => void;
}

const Scrim = () => {
  return (
    <Image source={LeftGradient} resizeMode="cover" style={styles.scrimImage} />
  );
};

const L2Bar = () => {
  return (
    <View style={styles.L2Bar}>
      <GradientButton
        label="All"
        containerStyle={styles.L2ItemContainer}
        buttonStyle={styles.L2ItemButton}
        variant="secondary"
        onPress={() => {}}
        colors={L2_GRADIENT_COLORS}
      />
      <GradientButton
        label="TV Shows"
        containerStyle={styles.L2ItemContainer}
        buttonStyle={styles.L2ItemButton}
        variant="secondary"
        onPress={() => {}}
        colors={L2_GRADIENT_COLORS}
      />
      <GradientButton
        label="Movies"
        containerStyle={styles.L2ItemContainer}
        buttonStyle={styles.L2ItemButton}
        variant="secondary"
        onPress={() => {}}
        colors={L2_GRADIENT_COLORS}
      />
      <GradientButton
        label="Live TV"
        containerStyle={styles.L2ItemContainer}
        buttonStyle={styles.L2ItemButton}
        variant="secondary"
        onPress={() => {}}
        colors={L2_GRADIENT_COLORS}
      />
    </View>
  );
};

const L2AndContentDetail = ({ tile }: ContentPreviewProps) => {
  return (
    <View style={styles.L2AndContentDetail}>
      <L2Bar />
      <ContentDetail
        tile={tile}
        containerStyle={styles.ContentDetailContainer}
      />
    </View>
  );
};

const ContentPreview = ({ tile, onFocus }: ContentPreviewProps) => {
  return (
    <TouchableWithoutFeedback style={styles.container} onFocus={onFocus}>
      <TVFocusGuideView
        style={styles.tvFocusContainer}
        autoFocus
        trapFocusRight
        trapFocusUp>
        <Image source={{ uri: tile?.posterUrl }} style={styles.poster} />
        <Scrim />
        <L2AndContentDetail tile={tile} />
      </TVFocusGuideView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  tvFocusContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  poster: {
    width: '60%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    right: 0,
  },
  scrimImage: {
    width: '60%',
    height: '100%',
    position: 'absolute',
    left: '40%',
  },
  L2AndContentDetail: {
    width: '40%',
    height: '100%',
    flexDirection: 'column',
  },
  L2Bar: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleUxToDp(43),
  },
  ContentDetailContainer: {
    flex: 2,
  },
  L2ItemContainer: {
    marginRight: scaleUxToDp(10),
  },
  L2ItemButton: {
    borderWidth: 2,
    borderColor: `${COLORS.WHITE}33`,
  },
});

const areContentPreviewPropsEqual = (
  prevProps: ContentPreviewProps,
  nextProps: ContentPreviewProps,
) => {
  return prevProps.tile?.id === nextProps.tile?.id;
};

export default React.memo(ContentPreview, areContentPreviewPropsEqual);
