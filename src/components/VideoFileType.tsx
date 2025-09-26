// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

interface VideoFileTypePickerProps {
  selectedFileType: String;
}

export const VideoFileType = React.memo(
  ({ selectedFileType }: VideoFileTypePickerProps) => {
    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.label} testID="radio-group-video-file-type">
          {'Video File Type:'} {selectedFileType}
        </Text>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  label: {
    fontSize: scaleUxToDp(28),
    color: COLORS.WHITE,
    marginRight: scaleUxToDp(20),
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: scaleUxToDp(20),
  },
});
