import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import CaptionButton from './CaptionButton';

export interface ControlBarProps {
  captions: () => void;
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  captionMenuVisibility: boolean;
  playerControlType?: string;
  isCaptionButtonFocused: boolean | null;
}
const ControlBar = ({
  captions,
  videoRef,
  captionMenuVisibility,
  playerControlType,
  isCaptionButtonFocused,
}: ControlBarProps) => {
  return (
    <View style={styles.controlBar} testID="control-bar">
      <CaptionButton
        playerControlType={playerControlType}
        video={videoRef.current as VideoPlayer}
        onPress={captions}
        testID={'video-player-caption-btn'}
        captionMenuVisibility={captionMenuVisibility}
        isCaptionButtonFocused={isCaptionButtonFocused}
      />
    </View>
  );
};
export const areControlBarPropsEqual = (
  prevProps: ControlBarProps,
  nextProps: ControlBarProps,
) => {
  const excludedProps = ['captions'];
  return areComponentPropsEqual(prevProps, nextProps, excludedProps);
};
export default React.memo(ControlBar, areControlBarPropsEqual);

export const styles = StyleSheet.create({
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
