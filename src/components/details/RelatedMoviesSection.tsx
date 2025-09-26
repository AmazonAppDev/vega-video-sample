// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../styles/Colors';
import { TitleData } from '../../types/TitleData';
import MovieCarousel from '../MovieCarousel';

interface RelatedMoviesSectionProps {
  loading: boolean;
  relatedData: TitleData[];
  cardDimensions: any;
  heading: string;
}

export const RelatedMoviesSection: React.FC<RelatedMoviesSectionProps> = ({
  loading,
  relatedData,
  cardDimensions,
  heading,
}) => (
  <ScrollView
    style={styles.movieCarousel}
    horizontal={!Platform.isTV}
    scrollEnabled={!Platform.isTV}
    showsHorizontalScrollIndicator={false}
    nestedScrollEnabled={false}>
    {loading ? (
      <ActivityIndicator size="small" color={COLORS.WHITE} />
    ) : relatedData.length > 0 ? (
      <MovieCarousel
        cardDimensions={cardDimensions}
        heading={heading}
        testID={'movie_carousel_related_movies'}
        data={relatedData}
      />
    ) : null}
  </ScrollView>
);

const styles = StyleSheet.create({
  movieCarousel: {
    position: 'relative',
    marginTop: 20,
  },
});
