import { ContentLauncherStatusType } from '@amazon-devices/kepler-media-content-launcher';
import { LinearGradientProps } from '@amazon-devices/react-linear-gradient';
import { render } from '@testing-library/react-native';
import React from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch } from 'react-redux';
import { areComponentPropsEqual } from '../../src/utils/lodashHelper';

import { RouteProp } from '@amazon-devices/react-navigation__core';
import { StackNavigationProp } from '@amazon-devices/react-navigation__stack';
import {
  AppStackParamList,
  AppStackScreenProps,
  Screens,
} from '../../src/components/navigation/types';
import HomeScreen from '../../src/screens/HomeScreen';
import {
  getSelectedLocale,
  localeOptions,
} from '../../src/utils/translationHelper';

jest.mock('@amazon-devices/react-linear-gradient', () => ({
  __esModule: true,

  default: ({ children }: LinearGradientProps) => <>{children}</>,
}));

// mock useFocusEffect
jest.mock('@amazon-devices/react-navigation__core', () => ({
  ...jest.requireActual('@amazon-devices/react-navigation__core'),
  useFocusEffect: jest.fn((callback) => callback()),
  useIsFocused: jest.fn().mockReturnValue(true),
}));

jest.mock('@amazon-devices/kepler-media-content-launcher', () => ({
  ContentLauncherServerComponent: jest
    .fn()
    .mockImplementation(() => mockContentLauncherServerComponent),
  ContentLauncherStatusType: {
    SUCCESS: 'SUCCESS',
  },
}));

jest.mock('../../src/data/videos', () => ({
  DEFAULT_FILE_TYPE: 'video/mp4',
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  useHideSplashScreenCallback: jest.fn(),
  useKeplerAppStateManager: jest.fn().mockReturnValue({
    getComponentInstance: jest.fn().mockReturnValue({
      setSurfaceHandle: jest.fn(),
      setCaptionViewHandle: jest.fn(),
    }),
    addAppStateListener: jest.fn().mockReturnValue({
      remove: jest.fn(),
    }),
  }),
}));

const mockContentLauncherServerComponent = {
  makeLauncherResponseBuilder: jest.fn().mockReturnThis(),
  contentLauncherStatus: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({
    getContentLauncherStatus: jest
      .fn()
      .mockReturnValue(ContentLauncherStatusType.SUCCESS),
  }),
  getOrMakeServer: jest.fn().mockReturnThis(),
  setHandler: jest.fn(),
};

const mockedNavigate = jest.fn();
const mockedNavigation = {
  navigate: mockedNavigate,
  goBack: mockedNavigate,
} as unknown as StackNavigationProp<
  AppStackParamList,
  Screens.HOME_SCREEN,
  undefined
>;
const mockRoute = {
  key: '',
  name: Screens.PLAYER_SCREEN,
} as unknown as RouteProp<AppStackParamList, Screens.HOME_SCREEN>;

const props: AppStackScreenProps<Screens.HOME_SCREEN> = {
  navigation: mockedNavigation,
  route: mockRoute,
};

describe('HomeScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  let mockDispatch: any;
  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<HomeScreen {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('registers event listener and handles event properly', () => {
    const { unmount } = render(<HomeScreen {...props} />);
    expect(EventRegister.addEventListener).toHaveBeenCalledWith(
      'LiveChannelEvent',
      expect.any(Function),
    );
    const eventHandler = (
      EventRegister.addEventListener as unknown as jest.Mock
    ).mock.calls[0][1];

    const mockPayload = {
      matchString: 'testChannel',
      resolve: jest.fn(),
      reject: jest.fn(),
    };

    eventHandler(mockPayload);
    unmount();
    expect(EventRegister.removeEventListener).toHaveBeenCalledWith(
      'mockListenerId',
    );
  });
});
describe('HomeScreen with React.memo', () => {
  it('does not re-renders when props are unchanged', async () => {
    const { rerender } = render(<HomeScreen {...props} />);
    rerender(<HomeScreen {...props} />);
    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
    );

    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });
});

describe('HomeScreen with touch optimized UX', () => {
  beforeEach(() => {
    jest
      .spyOn(require('../../src/config/AppConfig'), 'isDpadControllerSupported')
      .mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<HomeScreen {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('HomeScreen with touch optimized UX And Disabled Additional features', () => {
  const ContentPersonalizationServer =
    require('@amazon-devices/kepler-content-personalization').ContentPersonalizationServer;
  const AccountLoginWrapperInstance =
    require('../../src/AccountLoginWrapper').AccountLoginWrapperInstance;
  const onStartService =
    require('../../src/AccountLoginWrapper').onStartService;
  const onStopService = require('../../src/AccountLoginWrapper').onStopService;

  beforeEach(() => {
    jest.mock('@amazon-devices/kepler-content-personalization', () => ({
      __esModule: true,

      ContentPersonalizationServer: jest.fn(),
    }));

    jest.mock('../../src/AccountLoginWrapper', () => ({
      __esModule: true,

      AccountLoginWrapperInstance: jest.fn(),
      onStartService: jest.fn(),
      onStopService: jest.fn(),
    }));

    jest
      .spyOn(require('../../src/config/AppConfig'), 'isDpadControllerSupported')
      .mockReturnValue(false);
    jest
      .spyOn(
        require('../../src/config/AppConfig'),
        'isContentPersonalizationEnabled',
      )
      .mockReturnValue(false);
    jest
      .spyOn(require('../../src/config/AppConfig'), 'isAccountLoginEnabled')
      .mockReturnValue(false);

    jest
      .spyOn(require('../../src/config/AppConfig'), 'isChannelTuningV2Enabled')
      .mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not exercise content personalization features', () => {
    render(<HomeScreen {...props} />);
    expect(
      ContentPersonalizationServer.reportRefreshedCustomerList,
    ).toHaveBeenCalledTimes(0);
    expect(
      ContentPersonalizationServer.reportRefreshedContentEntitlements,
    ).toHaveBeenCalledTimes(0);
    expect(
      ContentPersonalizationServer.reportRefreshedPlaybackEvents,
    ).toHaveBeenCalledTimes(0);
  });

  it('does not exercise account login features', () => {
    render(<HomeScreen {...props} />);
    expect(AccountLoginWrapperInstance.updateStatus).toHaveBeenCalledTimes(0);
    expect(onStartService).toHaveBeenCalledTimes(0);
    expect(onStopService).toHaveBeenCalledTimes(0);
  });
});

describe('getSelectedLocale', () => {
  it('should return a valid OptionType object', () => {
    const result = getSelectedLocale();

    expect(result).toBeDefined();
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('label');
    expect(result).toHaveProperty('value');

    expect(result).toMatchObject({
      code: expect.any(String),
      label: expect.any(String),
      value: expect.any(String),
    });
  });

  it('should return the default OptionType if currentCountry is undefined', () => {
    jest.mock('../../src/utils/translationHelper', () => ({
      getSelectedLocale: jest.fn().mockReturnValue(undefined),
    }));

    const result = getSelectedLocale();

    expect(result).toEqual(localeOptions[0]);
  });
});
