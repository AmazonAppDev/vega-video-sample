import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';
import { CaptionMenu } from '../../../src/w3cmedia/mediacontrols/Captions';
import ControlBarMenu from '../../../src/w3cmedia/mediacontrols/ControlBarMenu';

jest.mock('../../../src/w3cmedia/mediacontrols/Captions', () => {
  return {
    CaptionMenu: jest.fn(() => null),
  };
});

const videoRef = { current: {} as VideoPlayer };
const setSelectedCaptionInMenuBarMock = jest.fn();
const setCaptionMenuVisibility = jest.fn();

describe('ControlBarMenu', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <ControlBarMenu
        captionMenuVisibility={true}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders CaptionMenu with correct props when visible', () => {
    render(
      <ControlBarMenu
        captionMenuVisibility={true}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );
    expect(CaptionMenu).toHaveBeenCalledTimes(2);
  });

  it('applies correct styles to the container', () => {
    const { UNSAFE_getByType } = render(
      <ControlBarMenu
        captionMenuVisibility={true}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );

    const container = UNSAFE_getByType(View);
    expect(container.props.style).toMatchObject({
      position: 'absolute',
      bottom: 90,
      right: 0,
    });
  });
});

describe('React.memo behavior for CaptionBarMenu', () => {
  const showCaptionMenuVisibility = true;
  const hideCaptionMenuVisibility = false;
  const excludedProps = [
    'setSelectedCaptionInMenuBar',
    'setCaptionMenuVisibility',
  ];
  it('does not re-render when CaptionBarMenu props are unchanged', () => {
    const { rerender } = render(
      <ControlBarMenu
        captionMenuVisibility={showCaptionMenuVisibility}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );
    rerender(
      <ControlBarMenu
        captionMenuVisibility={showCaptionMenuVisibility}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        captionMenuVisibility: showCaptionMenuVisibility,
        videoRef: videoRef,
        setSelectedCaptionInMenuBar: setSelectedCaptionInMenuBarMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      {
        captionMenuVisibility: showCaptionMenuVisibility,
        videoRef: videoRef,
        setSelectedCaptionInMenuBar: setSelectedCaptionInMenuBarMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-render when captionMenuVisibility is unchanged', () => {
    const { rerender } = render(
      <ControlBarMenu
        captionMenuVisibility={showCaptionMenuVisibility}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );
    rerender(
      <ControlBarMenu
        captionMenuVisibility={hideCaptionMenuVisibility}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
        setCaptionMenuVisibility={setCaptionMenuVisibility}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        captionMenuVisibility: showCaptionMenuVisibility,
        videoRef: videoRef,
        setSelectedCaptionInMenuBar: setSelectedCaptionInMenuBarMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      {
        captionMenuVisibility: hideCaptionMenuVisibility,
        videoRef: videoRef,
        setSelectedCaptionInMenuBar: setSelectedCaptionInMenuBarMock,
        setCaptionMenuVisibility: setCaptionMenuVisibility,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
