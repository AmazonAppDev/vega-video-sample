// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';
import React from 'react';
import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';
import CaptionButton from '../../../src/w3cmedia/mediacontrols/CaptionButton';
import { CaptionButtonProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

jest.mock('../../../src/w3cmedia/mediacontrols/PlayerButton');

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: 2,
    },
  } as unknown as VideoPlayer,
};
const videoRefTwo: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: jest.fn(),
    },
  } as unknown as VideoPlayer,
};
const renderCaptionButton = (props?: Partial<CaptionButtonProps>) => {
  return (
    <CaptionButton
      onPress={jest.fn()}
      video={videoRef.current as VideoPlayer}
      captionMenuVisibility={true}
      testID={'caption-button'}
      isCaptionButtonFocused={true}
      {...props}
    />
  );
};
describe('CaptionButton tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with', () => {
    const component = render(
      renderCaptionButton({
        captionMenuVisibility: false,
        video: videoRefTwo.current as VideoPlayer,
      }),
    );
    expect(component).toMatchSnapshot();
  });
});

describe('React.memo behavior for CaptionButton', () => {
  let mockProps = {
    captionMenuVisibility: true,
    isCaptionButtonFocused: true,
    onPress: jest.fn(),
    testID: 'caption-button',
    video: videoRef.current as VideoPlayer,
  };
  let mockPropsUpdated = {
    captionMenuVisibility: false,
    isCaptionButtonFocused: false,
    onPress: jest.fn(),
    testID: 'caption-button',
    video: videoRef.current as VideoPlayer,
  };

  it('does not re-render when CaptionButton props are unchanged', () => {
    const { rerender } = render(<CaptionButton {...mockProps} />);
    rerender(<CaptionButton {...mockProps} />);
    expect(areComponentPropsEqual).toHaveBeenCalled();
  });
  it('does not re-render when CaptionButton props are unchanged on rerender', () => {
    const { rerender } = render(<CaptionButton {...mockProps} />);
    rerender(<CaptionButton {...mockPropsUpdated} />);
    expect(areComponentPropsEqual).toHaveBeenCalled();
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
