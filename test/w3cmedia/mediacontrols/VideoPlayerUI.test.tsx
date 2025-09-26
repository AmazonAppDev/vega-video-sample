import { useTVEventHandler } from '@amazon-devices/react-native-kepler';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import { consoleInfoSpy } from '../../../jest.setup';
import { DPADEventType } from '../../../src/constants';
import { getMockPlaybackEventForVideo } from '../../../src/personalization/mock/ContentPersonalizationMocks';
import { BifFrameImageSource } from '../../../src/services/bif/BifFrameImageSource';
import { FrameImageSource } from '../../../src/services/bif/FrameImageSource';
import { TitleData } from '../../../src/types/TitleData';
import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';
import { useMediaControls } from '../../../src/w3cmedia/mediacontrols/types/useMediaControls';
import VideoPlayerUI from '../../../src/w3cmedia/mediacontrols/VideoPlayerUI';
import { asMock } from '../../common/testsHelper';

jest.mock('@amazon-devices/kepler-content-personalization', () => ({
  __esModule: true,
  ContentPersonalizationServer: jest.fn(),
}));

jest.mock('../../../src/w3cmedia/mediacontrols/types/useMediaControls', () => {
  return {
    useMediaControls: jest.fn().mockImplementation(() => ({
      showMediaControls: true,
      setShowMediaControls: jest.fn(),
      dismissControls: jest.fn().mockImplementation(() => {
        jest.fn().mockReturnValue(false);
      }),
      showControls: jest.fn().mockImplementation(() => {
        jest.fn().mockReturnValue(true);
      }),
      throttleDismissControls: jest.fn(),
      startTimerToDismissControls: jest.fn(),
      cancelTimer: jest.fn(),
      handleShowControls: jest.fn().mockImplementation(() => jest.fn()),
      handleShowControlsOnKeyEvent: jest
        .fn()
        .mockImplementation(() => jest.fn()),
    })),
  };
});

jest.mock('../../../src/config/AppConfig', () => ({
  isRunningOnAutomotive: jest.fn(() => true),
}));

jest.mock(
  '@amazon-devices/kepler-ui-components/dist/src/common/state/useComponentState',
  () => ({
    __esModule: true,
    default: () => ({
      isTV: true,
    }),
  }),
);

const data: TitleData = {
  id: '1',
  title: 'title',
  description: 'description',
  duration: 86,
  thumbnail: 'https://example.com/thumbnail.jpg',
  posterUrl: '',
  uri: 'https://example.com/video.mp4',
  categories: ['Category 1', 'Category 2'],
  releaseDate: '2023-01-01',
  channelID: 'XXXXX',
  rating: '4.5',
  mediaType: 'video',
  mediaSourceType: 'url',
  format: 'MP4',
  secure: false,
  uhd: true,
  rentAmount: '',
};

const bifFrameImagesRefMock: React.MutableRefObject<FrameImageSource | null> = {
  current: {} as unknown as BifFrameImageSource,
};

let videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    onCaptionViewDestroyed: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    textTracks: {
      length: 2,
      getTrackById: jest.fn((id) => ({
        mode: id === '0' ? 'showing' : 'hidden',
      })),
    },
  } as unknown as VideoPlayer,
};
let updatedVideoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    onCaptionViewDestroyed: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    current: {
      ...videoRef.current,
      paused: false,
    },
    textTracks: {
      length: 3,
      getTrackById: jest.fn((id) => ({
        mode: id === '0' ? 'showing' : 'hidden',
      })),
    },
  } as unknown as VideoPlayer,
};
const setCaptionStatusMock = jest.fn();
const setSelectedCaptionInVideoPlayerMock = jest.fn();

const renderVideoPlayerUI = (
  videoRefParam?: React.MutableRefObject<VideoPlayer | null> | undefined,
) => {
  return (
    <VideoPlayerUI
      videoRef={videoRefParam || videoRef}
      title={'Beautiful Whale Tail Uvita Costa Rica'}
      navigateBack={jest.fn()}
      setCaptionStatus={setCaptionStatusMock}
      setSelectedCaptionInVideoPlayer={setSelectedCaptionInVideoPlayerMock}
      bifFrameImagesRef={bifFrameImagesRefMock}
      videoData={data}
    />
  );
};
describe('useMediaControls.....', () => {
  test('useMediaControls with correct values', () => {
    const setShowMediaControls = jest.fn();
    const { handleShowControls, handleShowControlsOnKeyEvent } =
      useMediaControls(true, setShowMediaControls);
    expect(handleShowControls).toBeDefined();
    expect(handleShowControlsOnKeyEvent).toBeDefined();
  });
});

describe('VideoPlayerUI Test Cases', () => {
  const setState = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(require('react-native').Platform, 'isTV', 'get')
      .mockReturnValue(true);
  });

  beforeEach(() => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, setState]) //setCaptionMenuVisibility
      .mockImplementationOnce(() => ['', setState]) //setPlayerControlType
      .mockImplementationOnce(() => [false, setState]) //setCaptionButtonFocused
      .mockImplementationOnce(() => [true, setState]); //setShowMediaControls
  });
  it('renders correctly', () => {
    const tree = render(renderVideoPlayerUI());
    expect(tree).toMatchSnapshot();
  });

  it('View main is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('video-player-ui-view');
    expect(view).toBeDefined();
  });

  it('SubView is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('video-player-ui-view-two');
    expect(view).toBeDefined();
  });

  it('PlaybackControls is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('player-btn-seek-backward');
    expect(view).toBeDefined();
  });

  it('ControlBar is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('control-bar');
    expect(view).toBeDefined();
  });

  it('ControlBarMenu is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('view-control-bar-menu');
    expect(view).toBeDefined();
  });
});

describe('PlayerScreen hooks', () => {
  let mockuseMediaControls;
  let mockUseTVEventHandler: (arg0: {
    eventKeyAction: number;
    eventType: DPADEventType | 'error';
  }) => void;

  beforeEach(() => {
    mockuseMediaControls = jest.spyOn(
      require('../../../src/w3cmedia/mediacontrols/types/useMediaControls'),
      'useMediaControls',
    );
    jest
      .spyOn(require('react-native').Platform, 'isTV', 'get')
      .mockReturnValue(true);
    mockUseTVEventHandler = asMock(useTVEventHandler).mock.calls[0][0];
  });

  test('useTVEventHandler called with TV and DPADEventType.PLAYPAUSE with pause', async () => {
    videoRef = {
      current: {
        ...videoRef.current,
        paused: true,
      } as unknown as VideoPlayer,
    };
    render(renderVideoPlayerUI(videoRef));
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PLAYPAUSE,
    });

    expect(videoRef?.current?.paused).toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : playpause',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.PLAYPAUSE without pause', async () => {
    videoRef = {
      current: {
        ...videoRef.current,
        paused: false,
      } as unknown as VideoPlayer,
    };
    render(renderVideoPlayerUI());
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PLAYPAUSE,
    });

    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : playpause',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.PLAY', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PLAY,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : play',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.PAUSE', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PAUSE,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  test('useTVEventHandler called with TV and DPADEventType.SKIPFORWARD', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.SKIPFORWARD,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : skip_forward',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.SKIPBACKWARD', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.SKIPBACKWARD,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : skip_backward',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.BACK', async () => {
    videoRef = {
      current: {
        ...videoRef.current,
        paused: false,
      } as unknown as VideoPlayer,
    };
    const { getByTestId } = render(renderVideoPlayerUI());
    const controlBar = getByTestId('control-bar');

    expect(controlBar.props.children.props.captionMenuVisibility).toBe(false);

    controlBar.props.children.props.onPress();
    expect(controlBar.props.children.props.captionMenuVisibility).toBe(true);
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.BACK,
    });

    expect(setCaptionStatusMock).toHaveBeenCalled();
  });

  test('useTVEventHandler called with TV and error', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: 'error',
    });
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  test('useTVEventHandler called with any TV Event', async () => {
    const { handleShowControlsOnKeyEvent } = mockuseMediaControls(
      true,
      jest.fn(),
    );
    mockUseTVEventHandler({
      eventKeyAction: 1,
      eventType: DPADEventType.UP,
    });
    expect(handleShowControlsOnKeyEvent).toBeDefined();
  });
});

describe('React.memo behavior for VideoPlayerUI', () => {
  let mockProps = {
    data: data,
    videoRef: videoRef,
    title: 'Beautiful Whale Tail Uvita Costa Rica',
    navigateBack: jest.fn(),
    showBuffering: false,
    setCaptionStatus: setCaptionStatusMock,
    setSelectedCaptionInVideoPlayer: setSelectedCaptionInVideoPlayerMock,
    bifFrameImagesRef: bifFrameImagesRefMock,
    videoData: data,
  };
  let mockUpdatedProps = {
    data: data,
    videoRef: updatedVideoRef,
    title: 'Beautiful Whale Tail Uvita Costa Rica',
    navigateBack: jest.fn(),
    showBuffering: false,
    setCaptionStatus: setCaptionStatusMock,
    setSelectedCaptionInVideoPlayer: setSelectedCaptionInVideoPlayerMock,
    bifFrameImagesRef: bifFrameImagesRefMock,
    videoData: data,
  };

  it('does not re-render when VideoPlayer is unchanged', () => {
    const { rerender } = render(<VideoPlayerUI {...mockProps} />);
    rerender(<VideoPlayerUI {...mockProps} />);
    expect(areComponentPropsEqual).toHaveBeenCalled();
  });

  it('re-render when VideoPlayer is changed', () => {
    const { rerender } = render(<VideoPlayerUI {...mockProps} />);
    rerender(<VideoPlayerUI {...mockUpdatedProps} />);
    expect(areComponentPropsEqual).toHaveBeenCalled();
  });
});
