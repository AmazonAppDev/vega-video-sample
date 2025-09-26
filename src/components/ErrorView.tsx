// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Typography } from '@amazon-devices/kepler-ui-components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ErrorMsg } from '../constants';
import { COLORS } from '../styles/Colors';
import Header from '../w3cmedia/mediacontrols/VideoPlayerHeader';

interface ErrorViewProps {
  navigateBack: () => void;
}

const ErrorView = ({ navigateBack }: ErrorViewProps) => {
  return (
    <View style={styles.mainContainer}>
      <Header navigateBack={navigateBack} />
      <View style={styles.errorContainer}>
        <View style={styles.errorBox}>
          <Typography
            variant={'title'}
            color={COLORS.WHITE}
            testID="error-boundary-label">
            {ErrorMsg}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default ErrorView;

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.BLACK,
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  errorBox: {
    height: '30%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: COLORS.WHITE,
  },
});
