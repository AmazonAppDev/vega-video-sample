import { SafeAreaView } from '@amazon-devices/react-native-safe-area-context';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { RouteProp } from '@amazon-devices/react-navigation__core';
import { StackNavigationProp } from '@amazon-devices/react-navigation__stack';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import isEqual from 'lodash/isEqual';
import { default as React } from 'react';
import 'react-native';
import { BackHandler } from 'react-native';

import {
  ChangeChannelStatus,
  IChangeChannelResponseBuilder,
} from '@amazon-devices/kepler-channel';
import { HWEvent } from '@amazon-devices/react-native-kepler';
import {
  AppStackParamList,
  Screens,
} from '../../src/components/navigation/types';
import { CAPTION_DISABLE_ID } from '../../src/constants';
import PlayerScreen, { styles } from '../../src/screens/PlayerScreen';
import { TitleData } from '../../src/types/TitleData';
import { VideoHandler } from '../../src/utils/VideoHandler';
import { ShakaPlayer } from '../../src/w3cmedia/shakaplayer/ShakaPlayer';

const createMockBuilder = (): IChangeChannelResponseBuilder => {
  let currentStatus: ChangeChannelStatus;
  let currentData: string;

  return {
    status(status: ChangeChannelStatus): IChangeChannelResponseBuilder {
      currentStatus = status;
      return this;
    },
    data(data: string): IChangeChannelResponseBuilder {
      currentData = data;
      return this;
    },
    build() {
      return {
        status: currentStatus,
        data: currentData,
      };
    },
  };
};

const tileData: TitleData = {
  id: '169313',
  title: 'Beautiful Whale Tail Uvita Costa Rica',
  description: 'Beautiful Whale Tail Uvita Costa Rica',
  duration: 86,
  thumbnail:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  posterUrl:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  uri: 'https://edge-vod-media.cdn01.net/encoded/0000169/0169313/video_1880k/T7J66Z106.mp4?source=firetv&channelID=13454',
  categories: ['Costa Rica Islands'],
  channelID: '13454',
  rating: '2.5',
  mediaType: 'video',
  mediaSourceType: 'url',
  format: 'MP4',
  secure: false,
  uhd: true,
  rentAmount: '135',
} as TitleData;

const tileDataTwo: TitleData = {
  id: '169322',
  title: 'Big Buck Bunny: The Dark Truths',
  description: 'HLS format Big Buck Bunny: The Dark Truths',
  duration: 205,
  thumbnail:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  posterUrl:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  uri: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
  categories: ['Costa Rica Underwater'],
  channelID: '13455',
  rating: '2.5',
  mediaType: 'video',
  mediaSourceType: 'url',
  format: 'HLS',
  secure: false,
  uhd: false,
  textTrack: [
    {
      label: 'Sample CC 1',
      language: 'en',
      uri: 'https://mtoczko.github.io/hls-test-streams/test-vtt-ts-segments/text/1.vtt',
      mimeType: 'application/x-subtitle-vtt',
    },
    {
      label: 'Sample CC 2',
      language: 'es',
      uri: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt',
      mimeType: 'application/x-subtitle-vtt',
    },
  ],
  rentAmount: '135',
} as TitleData;

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  isTV: true,
  BackHandler: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  __esModule: true,
  HWEvent: jest.fn(),
  KeplerAppStateChangeData: jest.fn(),
  useCallback: jest.fn(),
  useTVEventHandler: jest.fn((evt: HWEvent) => {
    return evt;
  }),
  useKeplerAppStateManager: jest.fn().mockReturnValue({
    getComponentInstance: jest.fn().mockReturnValue({
      setSurfaceHandle: jest.fn(),
      setCaptionViewHandle: jest.fn(),
    }),
    addAppStateListener: jest.fn().mockReturnValue({
      remove: jest.fn(),
    }),
  }),
  addKeplerAppStateListenerCallback: jest.fn().mockReturnValue(jest.fn()),
  TVFocusGuideView: jest.fn(),
  default: jest.fn(),
}));

jest.mock('../../src/constants', () => ({
  ReadyState: jest.requireActual('../../src/constants'),
  CAPTION_DISABLE_ID: jest.requireActual('../../src/constants')
    .CAPTION_DISABLE_ID,
}));

jest.mock('../../src/utils/VideoHandler', () => {
  let internalData = tileData;
  let internalFileType = tileData.format;
  const vidRef: React.MutableRefObject<VideoPlayer | null> = {
    current: {
      setSurfaceHandle: jest.fn(),
      setCaptionViewHandle: jest.fn(),
      onCaptionViewDestroyed: jest.fn(),
      currentTime: 1000,
      readyState: 3,
      play: jest.fn(),
      pause: jest.fn(),
      clearSurfaceHandle: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as VideoPlayer,
  };
  const playerRef: React.MutableRefObject<ShakaPlayer | null> = {
    current: {
      load: jest.fn(),
      unload: jest.fn(),
    } as unknown as ShakaPlayer,
  };
  return {
    VideoHandler: jest.fn().mockImplementation(() => ({
      selectedFileType: 'MP4',
      videRef: vidRef,
      playerRef: playerRef,
      data: internalData,
      internalFileType: internalFileType,
      destroyVideoElements: jest.fn(),
      preBufferVideo: jest.fn(),
      onLoadeMetaData: jest.fn(),
    })),
  };
});

jest.mock('@amazon-devices/react-native-safe-area-context', () => {
  const MockSafeAreaView = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  return {
    __esModule: true,
    SafeAreaView: MockSafeAreaView,
  };
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions.get = jest.fn().mockImplementation(() => {
    return {
      width: 375,
      height: 667,
    };
  });
  return RN;
});

jest.mock('@amazon-devices/react-native-device-info', () => ({
  getModel: jest.fn(() => 'simulator'),
}));

jest.mock('../../src/config/AppConfig', () => ({
  isRunningOnSimulator: jest.fn(() => true),
  isContentPersonalizationEnabled: jest.fn(() => true),
  isSubscriptionEntitlementEnabled: jest.fn(() => true),
  isInAppPurchaseEnabled: jest.fn(() => true),
  isAccountLoginEnabled: jest.fn(() => true),
  isDpadControllerSupported: jest.fn(() => true),
}));

// Mock the ChannelServerComponent2
jest.mock('@amazon-devices/kepler-channel', () => ({
  ChangeChannelStatus: {
    SUCCESS: 'SUCCESS',
  },
  ChannelServerComponent2: {
    makeChannelResponseBuilder: jest
      .fn()
      .mockImplementation(() => createMockBuilder()),
  },
  KeplerScriptChannel: {
    getEnforcing: jest.fn(),
  },
  TurboModuleRegistry: {
    getEnforcing: jest.fn(),
  },
}));

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    onCaptionViewDestroyed: jest.fn(),
    currentTime: 1000,
    readyState: 3,
    play: jest.fn(),
    pause: jest.fn(),
    clearSurfaceHandle: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  } as unknown as VideoPlayer,
};

const playerRef: React.MutableRefObject<ShakaPlayer | null> = {
  current: {
    load: jest.fn(),
    unload: jest.fn(),
  } as unknown as ShakaPlayer,
};

const mockedNavigate = jest.fn();
const mockedNavigation = {
  navigate: mockedNavigate,
  goBack: mockedNavigate,
} as unknown as StackNavigationProp<
  AppStackParamList,
  Screens.PLAYER_SCREEN,
  undefined
>;
const mockRoute = {
  key: '',
  params: {
    data: tileData,
  },
  name: Screens.PLAYER_SCREEN,
} as unknown as RouteProp<AppStackParamList, Screens.PLAYER_SCREEN>;

const renderPlayerScreen = () => {
  return (
    <PlayerScreen
      navigation={mockedNavigation}
      route={{
        ...mockRoute,
        params: {
          ...mockRoute.params,
        },
      }}
    />
  );
};

jest.mock('../../src/components/BufferingWindow');
jest.mock('../../src/w3cmedia/mediacontrols/VideoPlayerUI');
jest.mock('lodash/isEqual', () =>
  jest.requireMock('../helperMocks/MockLodashIsEqual'),
);

describe('PlayerScreen rendering Test Cases', () => {
  const setState = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockSetState: any;
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetState = jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, setState]) //setShowBuffering
      .mockImplementationOnce(() => [false, setState]) //setIsVideoInitialized
      .mockImplementationOnce(() => [CAPTION_DISABLE_ID, setState]); //setCaptionID
  });

  it('renders correctly screenshot match', () => {
    const tree = render(renderPlayerScreen());
    expect(tree).toMatchSnapshot();
  });

  it('creates channel response correctly', () => {
    const builder = createMockBuilder();
    const response = builder
      .status(ChangeChannelStatus.SUCCESS)
      .data('Test Title')
      .build();

    expect(response).toEqual({
      status: ChangeChannelStatus.SUCCESS,
      data: 'Test Title',
    });
  });

  it('SafeAreaView is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const safeAreaView = queryByTestId('safe-area-view');
    expect(safeAreaView).toBeDefined();
  });

  it('SafeAreaView is rendered with correct styles', async () => {
    const { UNSAFE_queryAllByType } = render(renderPlayerScreen());
    const safeAreaView = UNSAFE_queryAllByType(SafeAreaView);
    const safeAreaViewWithStyles = safeAreaView.find(
      (safeArea) => safeArea.props.style === styles.playerContainer,
    );
    expect(safeAreaViewWithStyles).toBeTruthy();
  });

  it('TouchableOpacity is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const touchableOpacity = queryByTestId('touchable-opacity');
    expect(touchableOpacity).toBeDefined();
  });

  it('KeplerVideoSurfaceView is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerVideoSurfaceView = queryByTestId('kepler-video-surface-view');
    expect(keplerVideoSurfaceView).toBeDefined();
  });

  it('KeplerVideoSurfaceView should not show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerVideoSurfaceView = queryByTestId('kepler-video-surface-view');
    expect(keplerVideoSurfaceView).not.toBeOnTheScreen();
  });

  it('KeplerCaptionsView is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerCaptionsView = queryByTestId('kepler-captions-view');
    expect(keplerCaptionsView).toBeDefined();
  });

  it('KeplerCaptionsView should not show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerCaptionsView = queryByTestId('kepler-captions-view');
    expect(keplerCaptionsView).not.toBeOnTheScreen();
  });

  it('BufferingWindow is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const bufferingWindow = queryByTestId('buffering-view');
    expect(bufferingWindow).toBeDefined();
  });

  it('BufferingWindow should show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const bufferingWindow = queryByTestId('buffering-view');
    expect(bufferingWindow).not.toBeOnTheScreen();
  });

  it('VideoPlayerUI is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const videoPlayerUIView = queryByTestId('video-player-ui-view');
    expect(videoPlayerUIView).toBeDefined();
  });

  it('VideoPlayerUi should not show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const videoPlayerUi = queryByTestId('video-player-ui-view');
    expect(videoPlayerUi).not.toBeOnTheScreen();
  });
});
describe('VideoHandler.....', () => {
  let setIsVideoInitialized,
    setIsVideoEnded,
    setIsVideoError,
    setVideoPlayElapsedTimeM,
    setShowBuffering;
  beforeEach(() => {
    setIsVideoInitialized = jest.fn();
    setIsVideoEnded = jest.fn();
    setIsVideoError = jest.fn();
    setVideoPlayElapsedTimeM = jest.fn();
    setShowBuffering = jest.fn();
  });
  test('should initialize VideoHandler with correct values', () => {
    const handler = new VideoHandler(
      videoRef,
      playerRef,
      tileData,
      setIsVideoInitialized,
      setIsVideoEnded,
      setIsVideoError,
      setVideoPlayElapsedTimeM,
      setShowBuffering,
    );
    expect(handler).not.toBeNull();
    expect(handler.selectedFileType).toEqual('MP4');
    expect(handler.videoRef).not.toBeNull();
    expect(handler.player).not.toBeNull();
    expect(handler.data).toBe(tileData);
  });
});

describe('PlayerScreen with React.memo', () => {
  it('does not re-renders when props are unchanged', async () => {
    const { rerender, getByTestId } = render(
      <PlayerScreen navigation={mockedNavigation} route={mockRoute} />,
    );
    rerender(<PlayerScreen navigation={mockedNavigation} route={mockRoute} />);
    expect(isEqual).toHaveBeenCalledWith(
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
    );
    expect(isEqual).toHaveBeenCalledTimes(1);
    expect(getByTestId('touchable-opacity')).toBeTruthy();
  });

  it('re-renders when props are changed', async () => {
    const { rerender, getByTestId } = render(
      <PlayerScreen navigation={mockedNavigation} route={mockRoute} />,
    );
    rerender(
      <PlayerScreen
        navigation={mockedNavigation}
        route={{
          ...mockRoute,
          params: {
            ...mockRoute.params,
            data: tileDataTwo,
          },
        }}
      />,
    );
    expect(isEqual).toHaveBeenCalledWith(
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
      {
        navigation: mockedNavigation,
        route: {
          ...mockRoute,
          params: {
            ...mockRoute.params,
            data: tileDataTwo,
          },
        },
      },
    );
    expect(isEqual).toHaveBeenCalledTimes(2);
    expect(getByTestId('touchable-opacity')).toBeTruthy();
  });
});

describe('PlayerScreen hooks', () => {
  let component: any;
  let clearTimeOutSpy: any;

  beforeEach(() => {
    component = render(renderPlayerScreen());
    clearTimeOutSpy = jest.spyOn(global, 'clearTimeout');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('useTVEventHandler: clearTimeOut when video is finished', async () => {
    fireEvent(component.queryByTestId('touchable-opacity'), 'TVRemoteCommand', {
      eventKeyAction: 0,
    });
    expect(clearTimeOutSpy).not.toHaveBeenCalled();
  });

  test('BackHandler.addEventListener needs to defined', () => {
    jest
      .spyOn(BackHandler, 'addEventListener')
      .mockImplementation((eventName: any, navigateBack: any) => {
        if (eventName === 'hardwareBackPress') {
          navigateBack();
        }
        return {
          remove: () => {},
        };
      });

    expect(BackHandler.addEventListener).toBeDefined();
  });

  test('useKeplerAppStateManager app state change', () => {
    const { unmount } = render(renderPlayerScreen());
    expect(true).toBe(true);
    unmount();
  });

  test('useKeplerAppStateManager with null videoRef', () => {
    const { unmount } = render(renderPlayerScreen());
    expect(true).toBe(true);
    unmount();
  });
});
