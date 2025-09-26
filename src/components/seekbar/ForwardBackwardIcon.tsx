import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../styles/Colors';

import { DisplayAboveThumbProps } from '@amazon-devices/kepler-ui-components';

const FAST_FORWARD_IMAGE = require('../../assets/fast_forward.png');
const REWIND_IMAGE = require('../../assets/rewind.png');

const FastForwardRewindIcon = ({
  mode,
  multiplier,
}: DisplayAboveThumbProps) => {
  const isFastMode = mode === 'fast_rewind' || mode === 'fast_forward';

  const getLabelText = () => {
    if (multiplier === 1) {
      if (mode === 'rewind') {
        return '-10';
      }
      if (mode === 'forward') {
        return '+10';
      }
      if (isFastMode) {
        return '1x';
      }
    }
    if (isFastMode) {
      return `${multiplier}x`;
    }
    return '';
  };

  const showRewindImage = isFastMode && mode === 'fast_rewind';
  const showForwardImage = isFastMode && mode === 'fast_forward';

  return (
    <View testID="forward-backward-container" style={styles.aboveThumb}>
      {showRewindImage && (
        <Image source={REWIND_IMAGE} style={styles.fastForwardRewindImage} />
      )}

      <Text style={styles.fastForwardRewindLabel}>{getLabelText()}</Text>

      {showForwardImage && (
        <Image
          source={FAST_FORWARD_IMAGE}
          style={styles.fastForwardRewindImage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    height: 70,
    width: 150,
    marginBottom: 10,
  },
  multiplierText: {
    fontSize: 20,
    color: COLORS.WHITE,
  },
  aboveThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 120,
    display: 'flex',
    flexDirection: 'row',
  },
  fastForwardRewindLabel: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.8,
    color: 'white',
  },
  fastForwardRewindImage: {
    height: 24,
    width: 24,
  },
});

export default FastForwardRewindIcon;
