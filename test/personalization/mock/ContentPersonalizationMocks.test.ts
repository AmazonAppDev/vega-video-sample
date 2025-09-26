// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { PlaybackState } from '@amazon-devices/kepler-content-personalization';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import 'react-native';
import * as ModuleUnderTest from '../../../src/personalization/mock/ContentPersonalizationMocks';
const MockChannelDescriptorBuilder = {
  identifier: jest.fn().mockReturnThis(),
  majorNumber: jest.fn().mockReturnThis(),
  minorNumber: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({
    id: 'UniqueChannelIdentifier',
    major: 1,
    minor: 0,
  }),
};
const MockPlaybackEventBuilder = {
  channelDescriptor: jest.fn().mockReturnThis(),
  contentId: jest.fn().mockReturnThis(),
  creditsPositionMs: jest.fn().mockReturnThis(),
  durationMs: jest.fn().mockReturnThis(),
  playbackPositionMs: jest.fn().mockReturnThis(),
  playbackState: jest.fn().mockReturnThis(),
  profileId: jest.fn().mockReturnThis(),
  eventTimestamp: jest.fn().mockReturnThis(),
  buildActiveEvent: jest.fn().mockReturnValue({
    contentId: 10900,
    playbackPositionMs: 25000,
    playbackState: PlaybackState.PLAYING,
    profileId: 'profileId',
    eventTimestamp: 1234567890,
    creditsPositionMs: 40000,
    durationMs: 50000,
  }),
};
const MockContentIdBuilder = {
  id: jest.fn().mockReturnThis(),
  idNamespace: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({
    /* Mocked event object */
  }),
};
const MockProfileIdBuilder = {
  id: jest.fn().mockReturnThis(),
  idNamespace: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({
    /* Mocked event object */
  }),
};

jest.spyOn(Math, 'random').mockReturnValue(0);
jest.mock('@amazon-devices/kepler-epg-provider', () => ({
  __esModule: true,
  ChannelDescriptorBuilder: jest.fn(() => MockChannelDescriptorBuilder),
  IChannelDescriptor: jest.fn(),
}));
jest.mock('@amazon-devices/kepler-content-personalization', () => ({
  __esModule: true,
  PlaybackState: jest.fn(),
  PlaybackEventBuilder: jest.fn(() => MockPlaybackEventBuilder),
  ContentIdBuilder: jest.fn(() => MockContentIdBuilder),
  ProfileIdBuilder: jest.fn(() => MockProfileIdBuilder),
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
  ProfileIdNamespaces: {
    NAMESPACE_APP_INTERNAL: 'NAMESPACE_APP_INTERNAL',
  },
}));

describe('getMockPlaybackEventForVideo', () => {
  let videoRef: React.MutableRefObject<VideoPlayer | null>;
  beforeEach(() => {
    videoRef = {
      current: {
        duration: 50000,
        currentTime: 25000,
      } as VideoPlayer,
    } as React.MutableRefObject<VideoPlayer | null>;
  });

  test('should create a new PlaybackEvent when globalSelectedItem is null and playbackState is "play"', () => {
    const playbackEvent = ModuleUnderTest.getMockPlaybackEventForVideo(
      videoRef,
      'some-title',
      PlaybackState.PLAYING,
    );
    expect(playbackEvent).toBeDefined();
    expect(playbackEvent.contentId).toBe(10900);
    expect(playbackEvent.creditsPositionMs).toBe(40000);
    expect(playbackEvent.durationMs).toBe(50000);
    expect(playbackEvent.playbackPositionMs).toBe(25000);
    expect(playbackEvent.playbackState).toBe(PlaybackState.PLAYING);
    expect(playbackEvent.profileId).toBeDefined();
    expect(playbackEvent.eventTimestamp).toBeDefined();
  });

  test('Should pick an index based on input and index bound length', () => {
    const index = ModuleUnderTest.getHashCodeMod2(
      'https://edge-vod-media.cdn01.net/encoded/0000169/0169319/video_1880k/A57CCB0FI.mp4?source=firetv&channelID=13455',
      2,
    );
    expect(index).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
