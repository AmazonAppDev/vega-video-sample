import React from 'react';
import { StyleSheet, Text } from 'react-native';
import FocusableElement from '../../components/FocusableElement';
import { COLORS } from '../../styles/Colors';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { CaptionMenuItemProps } from './types/Captions';

export const areCaptionMenuItemPropsEqual = (
  prevProps: CaptionMenuItemProps,
  nextProps: CaptionMenuItemProps,
) => {
  const excludedProps = ['onPress', 'testID'];
  return areComponentPropsEqual(prevProps, nextProps, excludedProps);
};

export const CaptionMenuItem = React.memo(
  ({ text, selected, onPress, testID }: CaptionMenuItemProps) => {
    return (
      <FocusableElement
        onPress={onPress}
        style={selected && styles.selectedMenuItem}
        onFocusOverrideStyle={styles.focusedMenuItem}
        testID={testID}>
        <Text style={styles.menuItemText} testID={'video-player-caption-menu'}>
          {text}
        </Text>
      </FocusableElement>
    );
  },
  areCaptionMenuItemPropsEqual,
);

const styles = StyleSheet.create({
  menuItemText: {
    color: COLORS.WHITE,
    fontWeight: '500',
    fontSize: scaleUxToDp(30),
    marginVertical: scaleUxToDp(4),
    padding: scaleUxToDp(20),
  },
  focusedMenuItem: { backgroundColor: COLORS.GRAY + 'E6' },
  selectedMenuItem: { backgroundColor: COLORS.GRAY + '66' },
});
