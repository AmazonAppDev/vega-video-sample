import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import ControlBar from '../../src/w3cmedia/mediacontrols/ControlBar';

const renderControlBar = () => {
  const videoRef: React.MutableRefObject<VideoPlayer | null> = {
    current: {
      setSurfaceHandle: jest.fn(),
      setCaptionViewHandle: jest.fn(),
      onCaptionViewDestroyed: jest.fn(),
      textTracks: {
        length: 2,
      },
    } as unknown as VideoPlayer,
  };
  return (
    <ControlBar
      captions={() => jest.fn()}
      videoRef={videoRef}
      captionMenuVisibility={false}
      isCaptionButtonFocused={false}
    />
  );
};
describe('ControlBar with React.memo', () => {
  it('renders correctly', () => {
    const tree = render(renderControlBar());
    expect(tree).toMatchSnapshot();
  });

  it('View is present in component', async () => {
    const { queryByTestId } = render(renderControlBar());
    const view = queryByTestId('control-bar');
    expect(view).toBeDefined();
  });

  it('CaptionButton is present in component', async () => {
    const { queryByTestId } = render(renderControlBar());
    const view = queryByTestId('video-player-caption-btn');
    expect(view).toBeDefined();
  });
});
