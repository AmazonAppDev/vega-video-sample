// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { FiveStarRating } from '@amazon-devices/kepler-ui-components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { scaleUxToDp } from '../utils/pixelUtils';

interface RatingProps {
  rating: number;
  id: string | number;
}

const Rating = ({ rating, id }: RatingProps) => {
  return (
    <View style={[styles.ratingContainer, styles.landscape]}>
      <FiveStarRating
        size="md"
        ratingNumber={rating ?? 3.5}
        ratingText={`(${id ?? 100})`}
      />
    </View>
  );
};

export default React.memo(Rating);

const styles = StyleSheet.create({
  ratingContainer: {
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: scaleUxToDp(5),
  },
  landscape: {
    flexDirection: 'row',
  },
});
