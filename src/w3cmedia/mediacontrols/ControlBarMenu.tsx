import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { CaptionMenu } from './Captions';

interface ControlBarMenuProps {
  captionMenuVisibility: boolean;
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  setSelectedCaptionInMenuBar: (id: string) => void;
}
const ControlBarMenu = ({
  captionMenuVisibility,
  videoRef,
  setSelectedCaptionInMenuBar,
}: ControlBarMenuProps) => {
  const setSelectedCaption = (id: string) => {
    setSelectedCaptionInMenuBar(id);
  };

  return (
    <View style={styles.playerMenusContainer}>
      <CaptionMenu
        captionMenuVisibility={captionMenuVisibility}
        video={videoRef.current as VideoPlayer}
        setSelectedCaption={setSelectedCaption}
      />
    </View>
  );
};

export const areControlBarMenuPropsEqual = (
  prevProps: ControlBarMenuProps,
  nextProps: ControlBarMenuProps,
) => {
  const excludedProps = ['setSelectedCaptionInMenuBar'];
  return areComponentPropsEqual(prevProps, nextProps, excludedProps);
};
export default React.memo(ControlBarMenu, areControlBarMenuPropsEqual);

const styles = StyleSheet.create({
  playerMenusContainer: {
    position: 'absolute',
    bottom: scaleUxToDp(90),
    right: 0,
  },
});
