// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Header, Typography } from '@amazon-devices/kepler-ui-components';

import { COLORS } from '../../styles/Colors';
import { TitleData } from '../../types/TitleData';
import { scaleUxToDp } from '../../utils/pixelUtils';
import Rating from '../Rating';

const HdIcon = require('../../assets/hd_outline.png');

interface DetailHeaderProps {
  title: string;
  rating: string;
  description: string;
  videoID: string;
  onBackPress: () => void;
  titleData: TitleData;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  rating,
  description,
  videoID,
  onBackPress,
  titleData,
}) => (
  <>
    <View style={styles.headerStyle}>
      <Header
        iconSize={44}
        title={title}
        titleAlignment="start"
        titleSize="lg"
        titleVariant="headline"
        headerColor={COLORS.WHITE}
        backIconFocusedStyle={styles.headerBackIconStyle}
        onBackPress={onBackPress}
        testID="detail-header"
      />
    </View>
    <View style={styles.content}>
      <View style={styles.landscape} accessibilityElementsHidden={true}>
        <Rating rating={parseFloat(rating)} id={videoID} />
        <Image source={HdIcon} style={styles.hdIcon} />
      </View>
      <Typography
        variant="title"
        numberOfLines={1}
        color={COLORS.WHITE}
        style={styles.description}>
        {description}
      </Typography>
      <Typography
        variant="label"
        color={COLORS.WHITE}
        style={styles.descriptionType}>
        {titleData?.descriptionType}
      </Typography>
    </View>
  </>
);

const styles = StyleSheet.create({
  headerStyle: {
    height: scaleUxToDp(150),
    width: '100%',
    justifyContent: 'center',
    marginLeft: scaleUxToDp(20),
  },
  headerBackIconStyle: {
    borderColor: COLORS.ORANGE,
    borderWidth: 2,
    borderRadius: scaleUxToDp(33),
    padding: scaleUxToDp(10),
  },
  content: {
    marginLeft: scaleUxToDp(80),
    marginBottom: scaleUxToDp(20),
  },
  landscape: {
    flexDirection: 'row',
  },
  hdIcon: {
    height: scaleUxToDp(35),
    width: scaleUxToDp(50),
    tintColor: COLORS.WHITE,
    alignSelf: 'center',
    marginLeft: scaleUxToDp(15),
  },
  description: {
    marginTop: scaleUxToDp(15),
  },
  descriptionType: {
    marginTop: scaleUxToDp(5),
  },
});
