// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
  ContentEntitlementBuilder,
  ContentIdBuilder,
  ContentInteractionBuilder,
  ContentInteractionType,
  CustomerListEntryBuilder,
  CustomerListType,
  EntitlementType,
  IContentEntitlement,
  IContentId,
  IContentInteraction,
  ICustomerListEntry,
  IPlaybackEvent,
  IProfileId,
  PlaybackEventBuilder,
  PlaybackState,
  ProfileIdBuilder,
  ProfileIdNamespaces,
} from '@amazon-devices/kepler-content-personalization';
import {
  ChannelDescriptorBuilder,
  IChannelDescriptor,
} from '@amazon-devices/kepler-epg-provider';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';

const KEPLER_VIDEO_APP_PROVIDER = 'kepler_video_app_global';

export function getMockContentID(id: string, namespace: string): IContentId {
  return new ContentIdBuilder().id(id).idNamespace(namespace).build();
}

export function getMockContentEntitlement(): IContentEntitlement {
  console.info('k_content_per: Building ContentEntitlement object in App');
  return new ContentEntitlementBuilder()
    .acquisitionTimestamp(new Date())
    .contentId(getMockContentID('169327', KEPLER_VIDEO_APP_PROVIDER))
    .entitlementType(EntitlementType.PURCHASE)
    .expirationTimestamp(new Date())
    .build();
}

export function getMockContentInteraction(
  interactionType: ContentInteractionType,
  content: IContentId,
): IContentInteraction {
  console.info('k_content_per: Building ContentInteraction object in App');
  return new ContentInteractionBuilder()
    .contentId(content)
    .interactionTimestamp(new Date())
    .contentInteractionType(interactionType)
    .profileId(getMockProfileId())
    .build();
}

export function getMockCustomerListEntry(
  listType: CustomerListType,
  content: IContentId,
): ICustomerListEntry {
  console.info('k_content_per: Building CustomerListEntry object in App');
  return new CustomerListEntryBuilder()
    .contentId(
      content ? content : getMockContentID('169327', KEPLER_VIDEO_APP_PROVIDER),
    )
    .profileId(getMockProfileId())
    .addedTimestamp(new Date())
    .build();
}

export function getMockProfileId(): IProfileId {
  return new ProfileIdBuilder()
    .id('testProfile')
    .idNamespace(ProfileIdNamespaces.NAMESPACE_APP_INTERNAL)
    .build();
}

function getMockChannelDescriptor(): IChannelDescriptor {
  return new ChannelDescriptorBuilder()
    .identifier('UniqueChannelIdentifier')
    .majorNumber(1)
    .minorNumber(0)
    .build();
}

export function getDefaultMockPlaybackEvent(): IPlaybackEvent {
  console.info('k_content_per: Building PlaybackEvent object in App');
  return new PlaybackEventBuilder()
    .channelDescriptor(getMockChannelDescriptor())
    .contentId(getMockContentID('169327', KEPLER_VIDEO_APP_PROVIDER))
    .creditsPositionMs(5000)
    .durationMs(50000)
    .playbackPositionMs(100)
    .playbackState(PlaybackState.PAUSED)
    .profileId(getMockProfileId())
    .eventTimestamp(new Date())
    .buildActiveEvent();
}

export interface ContentItem {
  title: string;
  duration: number;
  creditPosition: number;
}

// Below data is from an actual test catalog provider kepler_video_app_global.
// To make the provider available to your device please add the dsn here.
// https://code.amazon.com/packages/P11ProviderConfigCLI/blobs/mainline/--/src/resources/dsnLists.json
const contentIdList: ContentItem[] = [
  { title: '169327', duration: 50000, creditPosition: 40000 },
  { title: '169342', duration: 50000, creditPosition: 40000 },
];
export function getMockPlaybackEventForVideo(
  videoRef: React.MutableRefObject<VideoPlayer | null>,
  inputTitle: string,
  playbackState: PlaybackState,
): IPlaybackEvent {
  const selectedIndex = getHashCodeMod2(inputTitle, contentIdList.length);
  console.info(
    `k_content_per: selecting mock data matching input title ${inputTitle} selected index ${selectedIndex}`,
  );
  let selectedItem = contentIdList[selectedIndex];
  const playbackEventBuilder = new PlaybackEventBuilder();
  let playbackEvent: IPlaybackEvent = playbackEventBuilder
    .channelDescriptor(getMockChannelDescriptor())
    .contentId(getMockContentID(selectedItem.title, KEPLER_VIDEO_APP_PROVIDER))
    .creditsPositionMs(selectedItem.creditPosition)
    .durationMs(selectedItem.duration)
    .playbackPositionMs(
      extrapolateVideoPosition(videoRef, selectedItem.duration),
    )
    .playbackState(playbackState)
    .profileId(getMockProfileId())
    .eventTimestamp(new Date(getCurrentDateInISOFormat()))
    .buildActiveEvent();

  return playbackEvent;
}

export function getHashCodeMod2(str: string, bound: number): number {
  let hashCode = 0;
  for (let i = 0; i < str.length; i++) {
    /* eslint-disable no-bitwise */
    hashCode = (hashCode << 5) - hashCode + str.charCodeAt(i);
    hashCode = hashCode & hashCode; // Convert to 32bit integer
  }
  // Ensure the result is positive
  const positiveHash = Math.abs(hashCode);
  return positiveHash % bound;
}

function getCurrentDateInISOFormat(): string {
  const now = new Date();
  return now.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

const extrapolateVideoPosition = (
  videoRef: React.MutableRefObject<VideoPlayer | null>,
  targetVideoDuration: number,
): number => {
  if (!videoRef || !videoRef.current) {
    console.info('k_content_per: videoRef is not initialized');
    return 0;
  }

  const currentVideoDuration = videoRef.current.duration;
  const currentVideoPosition = videoRef.current.currentTime;

  if (
    currentVideoDuration <= 0 ||
    currentVideoDuration === Infinity ||
    targetVideoDuration <= 0
  ) {
    console.info('k_content_per: video duration is not valid');
    return 0;
  }

  if (currentVideoPosition < 0) {
    console.info('k_content_per: video position is not valid');
    return 0;
  }

  if (currentVideoPosition >= currentVideoDuration) {
    return targetVideoDuration;
  }

  let currentPercentage = currentVideoPosition / currentVideoDuration;
  const targetVideoPosition = Math.floor(
    currentPercentage * targetVideoDuration,
  );
  console.info(
    `[ContentPersonalizationMocks.ts] - k_content_per: returning mock video position as ${targetVideoPosition}`,
  );
  return targetVideoPosition;
};
