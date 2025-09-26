import React from 'react';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import { CaptionMenuItem } from './CaptionMenuItem';
import { CaptionOptionProps } from './types/Captions';
export const areCaptionOptionPropsEqual = (
  prevProps: CaptionOptionProps,
  nextProps: CaptionOptionProps,
) => {
  const excludedProps = ['enableCaption'];
  return areComponentPropsEqual(prevProps, nextProps, excludedProps);
};

export const CaptionOptions = React.memo(
  ({ enableCaption, selectedCaptionId, video }: CaptionOptionProps) => {
    const Options: React.JSX.Element[] = [];
    const textTrackList = video?.textTracks || [];
    for (
      let captionIndex = 0;
      captionIndex < textTrackList.length;
      captionIndex++
    ) {
      const textTrack = textTrackList[captionIndex];
      if (textTrack) {
        const { label, id } = textTrack;
        Options.push(
          <CaptionMenuItem
            key={label}
            text={label}
            index={id}
            selected={id === selectedCaptionId}
            onPress={() => {
              enableCaption(id);
            }}
          />,
        );
      }
    }
    return <>{Options}</>;
  },
  areCaptionOptionPropsEqual,
);
