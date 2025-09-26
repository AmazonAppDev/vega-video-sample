// jest.setup.js or setupTests.js
import { HWEvent } from '@amazon-devices/react-native-kepler';
class MockContentRatingBuilder {
  ratingsSystem() {
    return this;
  }
  rating() {
    return this;
  }
  build() {
    return {};
  }
}
const MOCK_CONTENT_RATING_BUILDER = new MockContentRatingBuilder();
beforeEach(() => {
  expect.hasAssertions();
});

// Add spyOn here
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
export const consoleInfoSpy = jest
  .spyOn(console, 'info')
  .mockImplementation(() => {});

// Add mocks of libraries here
jest.mock('@amazon-devices/react-native-vector-icons/MaterialIcons', () =>
  jest.requireMock('./test/helperMocks/MockMaterialIcons'),
);
jest.mock('@amazon-devices/kepler-content-personalization', () => ({
  __esModule: true,
  PlaybackState: jest.fn(),
  ContentPersonalizationServer: {
    reportNewContentEntitlement: jest.fn(),
    reportRemovedContentEntitlement: jest.fn(),
    reportNewCustomerListEntry: jest.fn(),
    reportRemovedCustomerListEntry: jest.fn(),
    reportNewContentInteraction: jest.fn(),
    reportRefreshedCustomerList: jest.fn(),
    reportRefreshedContentEntitlements: jest.fn(),
    reportRefreshedPlaybackEvents: jest.fn(),
  },
  ContentInteractionType: {
    INGRESS: 'INGRESS',
  },
  CustomerListType: {
    WATCHLIST: 'WATCHLIST',
  },
  ContentIdNamespaces: {
    NAMESPACE_CDF_ID: 'NAMESPACE_CDF_ID',
  },
}));
jest.mock('@amazon-devices/kepler-epg-provider', () => ({
  __esModule: true,
  ChannelDescriptorBuilder: jest.fn(),
  IChannelDescriptor: jest.fn(),
}));
jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  __esModule: true,
  KeplerVideoSurfaceView: ({
    onSurfaceViewCreated,
    onSurfaceViewDestroyed,
  }: {
    onSurfaceViewCreated: (_surfaceHandle: string) => void;
    onSurfaceViewDestroyed: (_surfaceHandle: string) => void;
  }) => {
    onSurfaceViewCreated('SurfaceViewCreated');
    onSurfaceViewDestroyed('SurfaceViewDestroyed');
    return null;
  },
  KeplerCaptionsView: ({
    onCaptionViewCreated,
    onCaptionViewDestroyed,
  }: {
    onCaptionViewCreated: ((captionsViewHandle: string) => void) | undefined;
    onCaptionViewDestroyed: (captionsHandle: string) => void;
  }) => {
    onCaptionViewCreated?.('CaptionViewCreated');
    onCaptionViewDestroyed?.('CaptionViewDestroyed');
    return null;
  },
  VideoPlayer: jest.fn().mockImplementation(() => ({
    destroyVideoElements: jest.fn(),
    preBufferVideo: jest.fn(),
  })),
}));
jest.mock('@amazon-devices/lottie-react-native', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@amazon-devices/react-native-kepler', () => {
  return {
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
    TVFocusGuideView: jest.fn(),
    default: jest.fn(),
  };
});
jest.mock('lodash', () => ({
  isEqual: jest.fn(() => true),
}));
jest.mock('@amazon-devices/react-native-device-info', () => ({
  getApplicationName: jest.fn().mockResolvedValue('Test Application'),
  getModel: jest.fn().mockResolvedValue('Test Model'),
  getSystemName: jest.fn().mockResolvedValue('Test System'),
  getVersion: jest.fn().mockResolvedValue('1.0'),
  getDeviceType: jest.fn().mockResolvedValue('Test Device'),
  getBaseOs: jest.fn().mockResolvedValue('Test Base OS'),
  getManufacturer: jest.fn().mockResolvedValue('Test Manufacturer'),
}));
jest.mock('@amazon-devices/kepler-media-account-login', () => ({
  AccountLoginServerComponent: jest.fn(),
  IAccountLoginHandlerAsync: jest.fn(),
  IAccountLoginServerAsync: jest.fn(),
  IStatus: jest.fn(),
  StatusType: jest.fn(),
}));
jest.mock('@amazon-devices/react-native-localize', () => ({
  getCountry: jest.fn(),
  getLocales: jest.fn(),
}));
jest.mock('@amazon-devices/keplerscript-netmgr-lib', () => ({
  __esModule: true,
  fetch: jest.fn(),
  NetInfoConnectedDetails: jest.fn(),
  NetInfoState: jest.fn(),
  refresh: jest.fn(),
}));
jest.mock('@amazon-devices/react-navigation__core', () => ({
  __esModule: true,
  useFocusEffect: jest.fn(),
}));
jest.mock('@amazon-devices/kepler-file-system', () => ({
  handleReadFileAsString: jest.fn(() => null),
  handleGetEntries: jest.fn(() => null),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@amazon-devices/react-navigation__native', () => ({
  ...jest.requireActual('@amazon-devices/react-navigation__native'),
  useNavigation: jest.fn(),
}));

jest.mock('@amazon-devices/react-navigation__drawer', () => ({
  useDrawerStatus: jest.fn().mockReturnValue('closed'),
}));
jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn((_eventName) => {
      return 'mockListenerId';
    }),
    removeEventListener: jest.fn(),
  },
}));
jest.mock('@amazon-devices/kepler-performance-api', () => ({
  useReportFullyDrawn: jest.fn().mockReturnValue(jest.fn()),
}));
jest.mock('@amazon-devices/kepler-media-content-launcher', () => ({
  ContentLauncherServerComponent: jest.fn().mockImplementation(() => ({
    getOrMakeServer: jest.fn().mockReturnValue({
      setHandler: jest.fn(),
    }),
    makeLauncherResponseBuilder: jest.fn().mockReturnValue({
      contentLauncherStatus: jest.fn().mockReturnValue({
        build: jest.fn().mockReturnValue({}),
      }),
    }),
  })),
  ContentLauncherStatusType: {
    SUCCESS: 'SUCCESS',
  },
  IContentLauncherHandler: jest.fn(),
  IContentSearch: jest.fn(),
  ILaunchContentOptionalFields: jest.fn(),
  ILauncherResponse: jest.fn(),
}));

jest.mock('./src/utils/lodashHelper', () => ({
  areComponentPropsEqual: jest.fn((prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }),
}));

jest.mock('./src/AccountLoginWrapper', () => ({
  AccountLoginWrapperInstance: {
    updateStatus: jest.fn(),
  },
  onStartService: jest.fn(),
  onStopService: jest.fn(),
}));
jest.mock('@amazon-devices/kepler-channel', () => ({
  ChannelServerComponent2: {
    getOrMakeServer: jest.fn().mockReturnValue({
      setHandlerForComponent: jest.fn(),
    }),
    makeChannelResponseBuilder: jest.fn().mockReturnValue({
      channelStatus: jest.fn().mockReturnValue({
        build: jest.fn().mockReturnValue({}),
      }),
    }),
  },
  ChannelServerComponent: {
    channelServer: {
      handler: jest.fn(),
    },
  },
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn().mockReturnValue({
    start: jest.fn(),
  });
  RN.Dimensions.get = jest.fn().mockReturnValue({ height: 800 });
  RN.PixelRatio.roundToNearestPixel = jest.fn().mockImplementation((uxUnit) => {
    return uxUnit;
  });

  return RN;
});
jest.mock('./src/utils/pixelUtils', () => {
  const RN = jest.requireMock('react-native');

  return {
    scaleUxToDp: RN.PixelRatio.roundToNearestPixel,
  };
});
jest.mock('@amazon-devices/react-navigation__stack', () => ({
  Header: jest.fn(),
}));
jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: jest.fn(),
  widthPercentageToDP: jest.fn(),
}));
jest.mock('@amazon-devices/react-native-svg', () => ({
  Path: jest.fn(),
  Svg: jest.fn(),
}));

// Add mocks of internal files here
jest.mock('./src/iap/utils/IAPManager', () => ({
  IAPManager: {
    getPurchaseUpdates: jest.fn(),
    triggerPurchase: jest.fn(),
  },
}));
jest.mock('./src/iap/IAPConstants', () => ({
  IAPConstants: {
    MONTHLY_SUBSCRIPTION_SKU: 'monthly_subscription_sku',
    PURCHASE_TITLE_SKU: 'purchase_title_sku',
  },
}));
jest.mock('./src/config/AppConfig', () => ({
  isContentPersonalizationEnabled: jest.fn(() => true),
  isInAppPurchaseEnabled: jest.fn(() => true),
  isAccountLoginEnabled: jest.fn(() => true),
  isDpadControllerSupported: jest.fn(() => true),
  isChannelTuningV2Enabled: jest.fn(() => true),
}));
jest.mock('./src/data', () => ({
  CostaRicaTopRatedData: jest.fn(() => []),
  AutoRotatorData: jest.fn(() => []),
  CostaRicaAttractionsData: jest.fn(() => []),
  CostaRicaIslandsData: jest.fn(() => []),
  CostaRicaUnderwaterData: jest.fn(() => []),
}));
jest.mock('./src/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn(),
}));
jest.mock('./src/components/MovieCarousel', () => 'MovieCarousel');

jest.mock('./src/services/dataProviderFactory', () => ({
  createDataProvider: jest.fn(() => ({
    fetchData: jest.fn(),
  })),
}));
jest.mock('./src/components/rotator/AutoRotator', () => 'AutoRotator');
jest.mock('./src/components/miniDetails/MiniDetails', () => 'MiniDetails');
jest.mock('./src/livetv/channelTunerHandler', () => {});
jest.mock('./src/components/RadioPicker', () => 'RadioPicker');
jest.mock('./src/components/GradientButton', () => 'GradientButton');

jest.mock('@amazon-devices/react-linear-gradient', () => 'LinearGradient');

jest.mock('@amazon-devices/security-manager-lib', () => ({
  SecurityManager: {
    getPrivilegeState: jest.fn(() => Promise.resolve('ALLOW')),
    requestPrivilege: jest.fn(() => Promise.resolve('ALLOW')),
  },
  PrivilegeState: {
    ALLOW: 'ALLOW',
    DENY: 'DENY',
    UNKNOWN: 'UNKNOWN',
  },
}));
