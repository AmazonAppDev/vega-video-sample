// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@amazon-devices/kepler-ui-components';
import React from 'react';
import { PRIMARY_TEXT_STYLE } from '../../constants/commonStyles';
import { COLORS } from '../../styles/Colors';
import { MessageBoxProps } from './MessageBoxProps';

export const MessageBox = ({
  message,
  buttonOnPress,
  buttonLabel,
  testID,
}: MessageBoxProps) => {
  const styles = createStyleSheet();

  return (
    <View style={styles.wrapperView} testID={testID}>
      <Text style={[PRIMARY_TEXT_STYLE, styles.text]}>{message}</Text>
      {buttonOnPress && (
        <Button
          onPress={buttonOnPress}
          size="sm"
          variant="primary"
          label={buttonLabel}
          labelStyle={styles.buttonLabel}
          style={styles.button}
          testID="message_box_action_button"
        />
      )}
    </View>
  );
};

const createStyleSheet = () => {
  return StyleSheet.create({
    wrapperView: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      textAlign: 'center',
      marginBottom: '2%',
    },
    button: {
      backgroundColor: COLORS.GRAY,
    },
    buttonLabel: {
      color: COLORS.WHITE,
    },
  });
};
