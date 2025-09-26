import MaterialIcons from '@amazon-devices/react-native-vector-icons/MaterialIcons';
import React, { RefObject } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import FocusableElement from '../../components/FocusableElement';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';

export interface PlayerButtonProps {
  onPress: () => void;
  icon: string;
  size: number;
  overrideStyle?: StyleProp<ViewStyle>;
  onBlur?: () => void;
  testID?: string;
  hasTVPreferredFocus?: boolean;
}

export const PlayerButton = React.forwardRef(
  (
    {
      onPress,
      icon,
      size,
      overrideStyle,
      onBlur,
      testID,
      hasTVPreferredFocus,
    }: PlayerButtonProps,
    ref: React.ForwardedRef<TouchableOpacity>,
  ) => {
    return (
      <FocusableElement
        onBlur={onBlur}
        focusableElementRef={ref as RefObject<TouchableOpacity> | null}
        style={[styles.buttonContainer, overrideStyle]}
        onFocusOverrideStyle={[styles.buttonFocus, { borderRadius: size }]}
        onPress={onPress}
        hasTVPreferredFocus={hasTVPreferredFocus}
        testID={testID}>
        <Text>
          <MaterialIcons name={icon} size={size} color={COLORS.WHITE} />
        </Text>
      </FocusableElement>
    );
  },
);

const styles = StyleSheet.create({
  buttonContainer: {
    padding: scaleUxToDp(25),
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    resizeMode: 'contain',
    tintColor: COLORS.WHITE,
  },
  buttonFocus: {
    backgroundColor: COLORS.DARK_GRAY + 'D9',
  },
});

export default PlayerButton;
