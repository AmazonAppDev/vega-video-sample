// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';
import React from 'react';
import { CaptionMenu } from '../../../src/w3cmedia/mediacontrols/Captions';
import { CaptionMenuProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: 1,
      getTrackById: jest.fn((id) => ({
        mode: id === '0' ? 'showing' : 'hidden',
      })),
    },
  } as unknown as VideoPlayer,
};
const renderCaptionButton = (props?: Partial<CaptionMenuProps>) => {
  const setSelectedCaptionMock = jest.fn();
  const setCaptionMenuVisibility = jest.fn();

  return (
    <CaptionMenu
      captionMenuVisibility={true}
      setSelectedCaption={setSelectedCaptionMock}
      setCaptionMenuVisibility={setCaptionMenuVisibility}
      video={videoRef.current as VideoPlayer}
      {...props}
    />
  );
};
describe('ControlBar tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with captionMenuVisibility enabled', () => {
    const component = render(
      renderCaptionButton({ captionMenuVisibility: true }),
    );
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with captionMenuVisibility disabled', () => {
    const component = render(
      renderCaptionButton({ captionMenuVisibility: false }),
    );
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with textTracks 0 length', () => {
    const component = render(
      renderCaptionButton({
        video: {
          current: {
            ...videoRef.current,
            textTracks: {
              length: 0,
              getTrackById: jest.fn(),
            },
          } as unknown as VideoPlayer,
        } as unknown as VideoPlayer,
      }),
    );
    expect(component).toMatchSnapshot();
  });
});
describe('Functions gets call properly', () => {
  test('CaptionOptions useCallback', () => {
    render(renderCaptionButton({ captionMenuVisibility: true }));
    expect(videoRef.current?.textTracks.getTrackById('0')?.mode).toBe(
      'showing',
    );
    expect(videoRef.current?.textTracks.getTrackById('1')?.mode).toBe('hidden');
  });
});

describe('React.memo behavior for Captions', () => {
  const setSelectedCaptionMock = jest.fn();
  const setCaptionMenuVisibility = jest.fn();

  const showCaptionMenu = true;
  const hideCaptionMenu = false;
  const excludedProps = ['setSelectedCaption', 'setCaptionMenuVisibility'];

  it('does not re-render when captionMenuVisibility is unchanged', () => {
    const { rerender } = render(
      <CaptionMenu
        captionMenuVisibility={showCaptionMenu}
        setSelectedCaption={setSelectedCaptionMock}
        video={videoRef.current as VideoPlayer}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );
    rerender(
      <CaptionMenu
        captionMenuVisibility={showCaptionMenu}
        setSelectedCaption={setSelectedCaptionMock}
        video={videoRef.current as VideoPlayer}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        captionMenuVisibility: showCaptionMenu,
        video: videoRef.current,
        setSelectedCaption: setSelectedCaptionMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      {
        captionMenuVisibility: showCaptionMenu,
        video: videoRef.current,
        setSelectedCaption: setSelectedCaptionMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-render when captionMenuVisibility is changed', () => {
    const { rerender } = render(
      <CaptionMenu
        captionMenuVisibility={showCaptionMenu}
        setSelectedCaption={setSelectedCaptionMock}
        video={videoRef.current as VideoPlayer}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );
    rerender(
      <CaptionMenu
        captionMenuVisibility={hideCaptionMenu}
        setSelectedCaption={setSelectedCaptionMock}
        video={videoRef.current as VideoPlayer}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        captionMenuVisibility: showCaptionMenu,
        video: videoRef.current,
        setSelectedCaption: setSelectedCaptionMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      {
        captionMenuVisibility: hideCaptionMenu,
        video: videoRef.current,
        setSelectedCaption: setSelectedCaptionMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
