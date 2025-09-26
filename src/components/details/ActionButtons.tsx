// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Button } from '@amazon-devices/kepler-ui-components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { ButtonConfig } from '../navigation/types';

interface ActionButtonsProps {
  buttonConfig: ButtonConfig[];
  playMovieButtonRef: React.RefObject<any>;
  onBlurPlayMovie: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttonConfig,
  playMovieButtonRef,
  onBlurPlayMovie,
}) => (
  <View style={styles.movieButtonsContainer}>
    {buttonConfig.map((btn) => (
      <Button
        key={btn.testID}
        label={btn.label}
        onPress={btn.onPress}
        variant="primary"
        mode="contained"
        focusedStyle={styles.movieButton}
        iconSource={btn.image}
        iconSize="sm"
        iconPosition="start"
        style={styles.buttonStyle}
        testID={btn.testID}
        ref={btn.label === 'Play Movie' ? playMovieButtonRef : null}
        onBlur={onBlurPlayMovie}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  movieButtonsContainer: {
    width: '20%',
    margin: scaleUxToDp(30),
  },
  movieButton: {
    borderRadius: scaleUxToDp(7.5),
    borderColor: COLORS.ORANGE,
    borderWidth: 3,
    margin: scaleUxToDp(5),
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: COLORS.BLACK,
    opacity: 0.8,
    height: scaleUxToDp(60),
    borderColor: COLORS.TRANSPARENT,
    margin: scaleUxToDp(5),
    borderRadius: scaleUxToDp(7.5),
  },
});
