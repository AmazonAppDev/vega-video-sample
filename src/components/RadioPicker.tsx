// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RadioButton from './RadioButton';

export interface OptionType {
  label: string;
  value: string;
  code: string;
}

export interface RadioPickerProps {
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  defaultValue?: OptionType;
}

const RadioPicker = ({ options, onSelect, defaultValue }: RadioPickerProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    defaultValue && Object.keys(defaultValue).length ? defaultValue : null,
  );

  const handleSelect = useCallback(
    (option: OptionType) => {
      setSelectedOption(option);
      onSelect(option);
    },
    [onSelect],
  );

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === selectedOption?.value;
        return (
          <RadioButton
            key={option.value}
            label={option.label}
            onSelect={() => handleSelect(option)}
            selected={isSelected}
            testID={`radio-btn-${option.label}`}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default RadioPicker;
