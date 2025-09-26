// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
  ChannelLineupProvider,
  EpgLineupInformation,
  IChannelDescriptor,
  IChannelInfo,
  IChannelMetadata,
  ILiveEvent,
  IPlaybackReference,
  IProgram,
  LiveEventProvider,
  ProgramLineupProvider2,
} from '@amazon-devices/kepler-epg-provider';

import 'react-native';
import { default as doTask } from '../../../src/livetv/task/EpgSyncTask';

jest.mock('@amazon-devices/kepler-epg-provider', () => {
  return {
    __esModule: true,
    ChannelLineupProvider: {
      add: jest.fn((_channels: IChannelInfo[]) => Promise.resolve([])),
      commit: jest.fn((_version: string) => Promise.resolve()),
    },
    EpgLineupInformation: {
      getLastCommittedChannelLineupVersion: jest.fn(() =>
        Promise.resolve('channel_version'),
      ),
      getLastCommittedProgramLineupVersion: jest.fn(() =>
        Promise.resolve('program_version'),
      ),
      getLastCommittedLiveEventLineupVersion: jest.fn(() =>
        Promise.resolve('live_event_version1'),
      ),
    },
    LiveEventProvider: {
      add: jest.fn((_liveEvents: ILiveEvent[]) => Promise.resolve([])),
      commit: jest.fn((_version: string) => Promise.resolve()),
    },
    ProgramLineupProvider2: {
      upsert: jest.fn((_programs: IProgram[]) => Promise.resolve([])),
      commit: jest.fn((_version: string) => Promise.resolve()),
    },
  };
});

function mockGetChannels(
  start: number,
  _pageSize: number,
): Promise<IChannelInfo[]> {
  return new Promise((resolve, _reject) => {
    let channels: IChannelInfo[] = [];
    if (start === 0) {
      const channelDescriptor: IChannelDescriptor = {
        majorNumber: 0,
        minorNumber: 0,
        identifier: '',
      };
      const channelMetadata: IChannelMetadata = {
        name: '',
        channelType: 0,
        logoUrl: '',
        genres: [],
        attributes: [],
        videoResolution: '',
        sortRank: 0,
        externalIdList: [],
        channelGroupId: '',
      };
      const channelInfo: IChannelInfo = {
        channelDescriptor: channelDescriptor,
        channelMetadata: channelMetadata,
      };
      channels.push(channelInfo);
    }
    resolve(channels);
  });
}

function mockGetPrograms(
  start: number,
  _pageSize: number,
): Promise<IProgram[]> {
  return new Promise((resolve, _reject) => {
    let programs: IProgram[] = [];
    if (start === 0) {
      const channelDescriptor: IChannelDescriptor = {
        majorNumber: 0,
        minorNumber: 0,
        identifier: '',
      };
      const program: IProgram = {
        identifier: '',
        channelDescriptor: channelDescriptor,
        title: '',
        startTimeMs: 0,
        endTimeMs: 0,
        subtitle: '',
        description: '',
        thumbnailUrl: '',
        posterArtUrl: '',
        ratings: [],
        genres: [],
        seriesInfo: undefined,
        attributes: [],
      };
      programs.push(program);
    }
    resolve(programs);
  });
}

function mockGetLiveEvents(
  start: number,
  _pageSize: number,
): Promise<ILiveEvent[]> {
  return new Promise((resolve, _reject) => {
    let liveEvents: ILiveEvent[] = [];
    if (start === 0) {
      const playbackReference: IPlaybackReference = {
        playbackType: 0,
        mediaId: undefined,
      };
      const liveEvent: ILiveEvent = {
        identifier: '',
        eventType: 0,
        playbackReference: playbackReference,
        startTimeMs: undefined,
        endTimeMs: undefined,
        title: '',
        description: '',
        ratings: [],
        genres: [],
        logoUrl: '',
        posterArtUrl: '',
        attributes: [],
        sortRank: 0,
      };
      liveEvents.push(liveEvent);
    }
    resolve(liveEvents);
  });
}

jest.mock('../../../src/livetv/mock/MockSource', () => {
  return {
    __esModule: true,
    getMockedChannelLineup: jest.fn(mockGetChannels),
    getMockedChannelLineupSize: jest.fn(() => Promise.resolve(1)),
    getMockedLiveEventLineup: jest.fn(mockGetLiveEvents),
    getMockedProgramLineupSize: jest.fn(() => Promise.resolve(1)),
    getMockedPrograms: jest.fn(mockGetPrograms),
  };
});

describe('Epg Sync Task Test', () => {
  it('should be able to call doTask', async () => {
    await expect(doTask()).resolves.toBeUndefined();
    expect(ChannelLineupProvider.add).toHaveBeenCalled();
    expect(ChannelLineupProvider.commit).toHaveBeenCalled();
    expect(
      EpgLineupInformation.getLastCommittedChannelLineupVersion,
    ).toHaveBeenCalled();
    expect(
      EpgLineupInformation.getLastCommittedProgramLineupVersion,
    ).toHaveBeenCalled();
    expect(
      EpgLineupInformation.getLastCommittedLiveEventLineupVersion,
    ).toHaveBeenCalled();
    expect(LiveEventProvider.add).toHaveBeenCalled();
    expect(LiveEventProvider.commit).toHaveBeenCalled();
    expect(ProgramLineupProvider2.upsert).toHaveBeenCalled();
    expect(ProgramLineupProvider2.commit).toHaveBeenCalled();
  });
});
