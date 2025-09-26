// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Typography } from '@amazon-devices/kepler-ui-components';
import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCountryCode,
  settingsSelectors,
} from '../store/settings/SettingsSlice';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';
import { localeOptions } from '../utils/translationHelper';
import RadioPicker, { OptionType } from './RadioPicker';

const LocaleComponent = () => {
  const dispatch = useDispatch();
  const countryCode = useSelector(settingsSelectors.countryCode);

  const onSelect = (option: any) => {
    dispatch(setCountryCode(option));
  };

  return (
    <TVFocusGuideView trapFocusRight>
      <View style={styles.container}>
        <Typography style={styles.label} variant="title">
          Select Country Code:
        </Typography>
        <RadioPicker
          options={localeOptions}
          onSelect={onSelect}
          defaultValue={countryCode as OptionType}
        />
      </View>
    </TVFocusGuideView>
  );
};

export default React.memo(LocaleComponent);

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleUxToDp(25),
  },
  label: {
    color: COLORS.WHITE,
    marginRight: scaleUxToDp(20),
    fontWeight: '600',
  },
});
