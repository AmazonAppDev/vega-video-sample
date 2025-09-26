import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CAPTION_DISABLE_ID, CAPTION_DISABLE_TEXT } from '../../constants';
import { COLORS } from '../../styles/Colors';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { CaptionMenuItem } from './CaptionMenuItem';
import { CaptionOptions } from './CaptionOptions';
import { CaptionMenuProps } from './types/Captions';

export const areCaptionMenuPropsEqual = (
  prevProps: CaptionMenuProps,
  nextProps: CaptionMenuProps,
) => {
  const excludedProps = ['setSelectedCaption'];
  return areComponentPropsEqual(prevProps, nextProps, excludedProps);
};

export const CaptionMenu = React.memo(
  ({ captionMenuVisibility, video, setSelectedCaption }: CaptionMenuProps) => {
    const [captionID, setCaptionID] = useState<string>(CAPTION_DISABLE_ID);

    const removeCurrentCaption = useCallback(() => {
      if (captionID !== CAPTION_DISABLE_ID) {
        console.log('Disabling Captions');
        if (video && video.textTracks) {
          video.textTracks.getTrackById(captionID)!.mode = 'hidden';
        }
      }
      setCaptionID(CAPTION_DISABLE_ID);
    }, [captionID, video]);

    const enableCaption = useCallback(
      (id: string) => {
        if (id === captionID) {
          return;
        }
        removeCurrentCaption();
        if (video && video.textTracks) {
          video.textTracks.getTrackById(id)!.mode = 'showing';
          setCaptionID(id);
          setSelectedCaption(id);
        }
        setCaptionID(id);
        setSelectedCaption(id);
      },
      [captionID, removeCurrentCaption, video, setSelectedCaption],
    );

    const turnOffCaptions = useCallback(() => {
      setSelectedCaption(CAPTION_DISABLE_ID);
      removeCurrentCaption();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <TVFocusGuideView trapFocusLeft trapFocusRight trapFocusUp>
        {captionMenuVisibility ? (
          <View style={styles.menu}>
            <CaptionOptions
              video={video}
              enableCaption={enableCaption}
              selectedCaptionId={captionID}
            />
            <CaptionMenuItem
              key={CAPTION_DISABLE_TEXT}
              text={CAPTION_DISABLE_TEXT}
              onPress={turnOffCaptions}
              selected={captionID === CAPTION_DISABLE_ID}
              testID={'caption-menu-focus-element'}
            />
          </View>
        ) : null}
      </TVFocusGuideView>
    );
  },
  areCaptionMenuPropsEqual,
);

const styles = StyleSheet.create({
  menu: {
    backgroundColor: COLORS.BLACK + 'E6',
    width: scaleUxToDp(250),
    justifyContent: 'center',
    zIndex: 30,
    borderRadius: scaleUxToDp(15),
    overflow: 'hidden',
  },
  captionSelected: {
    backgroundColor: COLORS.DARK_GRAY + 'D9',
    borderRadius: scaleUxToDp(40),
  },
});
