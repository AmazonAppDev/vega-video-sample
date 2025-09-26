// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/Colors';
import { areComponentPropsEqual } from '../utils/lodashHelper';
import { scaleUxToDp } from '../utils/pixelUtils';
import FocusableElement from './FocusableElement';

interface RadioButtonProps {
  label: string;
  onSelect: () => void;
  selected: boolean;
  testID?: string;
}

const RadioButton = ({
  label,
  onSelect,
  selected,
  testID,
}: RadioButtonProps) => {
  return (
    <View style={styles.buttonContainer} testID={testID}>
      <FocusableElement
        onPress={onSelect}
        onFocusOverrideStyle={styles.focusedView}
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
        testID={`radio-btn-${label}${selected ? '-selected' : ''}`}
      />
      <Text style={styles.label} testID={`radio-text-${label}`}>
        {label}
      </Text>
    </View>
  );
};

const areRadioButtonPropsEqual = (
  prevProps: RadioButtonProps,
  nextProps: RadioButtonProps,
) => {
  return areComponentPropsEqual(prevProps.selected, nextProps.selected);
};

export default React.memo(RadioButton, areRadioButtonPropsEqual);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleUxToDp(15),
  },
  label: {
    fontSize: scaleUxToDp(27),
    color: COLORS.WHITE,
    marginLeft: scaleUxToDp(10),
  },
  focusedView: {
    borderColor: COLORS.YELLOW,
  },
  radioButton: {
    width: scaleUxToDp(30),
    height: scaleUxToDp(30),
    borderRadius: scaleUxToDp(15),
    borderWidth: 4,
    borderColor: COLORS.LIGHT_GRAY,
  },
  radioButtonSelected: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
});
