// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MovieGridData } from '../../types/MovieGridData';
import MovieGrid from '../MovieGrid';
import { RotatorData } from '../rotator/type';

export interface MovieRotatorGridProps {
  rotatorData: RotatorData[];
  movieGridData: MovieGridData[];
}

/**
 * MovieRotatorGrid combines Auto Rotator and Movie Grid as part of one
 * Scroll view such that they scroll together.
 * This is more optimized for touch screens as we do not show content
 * preview when video tile goes in focus (on touch screens, elements
 * do not get focus).
 */
export const MovieRotatorGrid = (props: MovieRotatorGridProps) => {
  if (props.movieGridData.length > 0) {
    return (
      <View style={styles.carouselContainer}>
        <MovieGrid data={props.movieGridData} testID={'movie-rotator-grid'} />
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    marginLeft: 28,
    marginBottom: 22,
  },
});
