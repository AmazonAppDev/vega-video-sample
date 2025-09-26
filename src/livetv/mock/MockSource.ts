// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  ChannelDescriptorBuilder,
  ChannelInfoBuilder,
  ChannelMetadataBuilder,
  ExternalIdBuilder,
  IChannelInfo,
  ILiveEvent,
  IProgram,
  LiveEventBuilder,
  PlaybackReferenceBuilder,
  ProgramBuilder,
  SeriesInfoBuilder,
} from '@amazon-devices/kepler-epg-provider';
import { KeplerFileSystem as FileSystem } from '@amazon-devices/kepler-file-system';
import { MediaId } from '@amazon-devices/kepler-media-types';
import { tileData } from '../../data/tileData';
import { TitleData } from '../../types/TitleData';

interface ExternalIdJson {
  idType: string;
  value: string;
}

interface ChannelJson {
  identifier: string;
  majorNumber: number;
  minorNumber: number;
  name: string;
  type: number;
  logoUrl?: string;
  resolution?: string;
  genres?: string[];
  attributes?: string[];
  externalIds?: ExternalIdJson[];
  rank?: number;
}

interface SeriesInfoJson {
  season: string;
  episode: string;
}

interface ProgramJson extends TitleData {
  id: string;
  channelIdentifier: string;
  channelMajorNumber: number;
  channelMinorNumber: number;
  title: string;
  startTime: string;
  endTime: string;
  subtitle?: string;
  description: string;
  thumbnailUrl?: string;
  posterArtUrl?: string;
  ratings?: string[];
  genres?: string[];
  attributes?: string[];
  seriesInfo?: SeriesInfoJson;
}

interface LiveEventJson {
  identifier: string;
  eventType: number;
  playbackType: number;
  contentId: string;
  catalogName: string;
  title: string;
  description?: string;
  ratings?: string[];
  genres?: string[];
  logoUrl?: string;
  posterArtUrl?: string;
  attributes?: string[];
  sortRank?: number;
}

const HOUR_IN_MS = 60 * 60 * 1000;
const FORTY_FIVE_MINS_IN_MS = 45 * 60 * 1000;
/*
  Added default data for channels, programs, liveEvents, and lineupVersion
  to read from JSON files upon app install. But Partners are supposed
  to fetch data from their backend.
*/
const channelsJsonData = require('./data/channels.json');
const programsJsonData = require('./data/programs.json');
const liveEventsJsonData = require('./data/liveEvents.json');

/*
  This method is used to read a file for channels data placed in the data folder of the app.
  For example, the /home/app_user/packages/com.amazondeveloper.keplervideoapp/data folder
  on the device. This feature is added so developers can push different data on the device
  and reinstall the vpkg of the KVA to test the EPG sync task without rebuilding the app
  Partners read data from their respective backend.
 */
const readChannelDataFromFile = async (): Promise<ChannelJson[]> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/channels.txt',
      'UTF-8',
    );
    return JSON.parse(response);
  } catch (error) {
    console.warn(
      '[ MockSource.ts ] - readChannelDataFromFile - ktf: Error received on reading channel data from file. Fallback to default data.',
      error,
    );
    return channelsJsonData;
  }
};

/*
  This method is used to read a file for programs data placed in the data folder of the app.
  For example, the /home/app_user/packages/com.amazondeveloper.keplervideoapp/data folder
  on the device. This feature is added so developers can push different data on the device
  and reinstall the vpkg of the KVA to test the EPG sync task without rebuilding the app
  Partners read data from their respective backend.
*/
const readProgramDataFromFile = async (): Promise<ProgramJson[][]> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/programs.txt',
      'UTF-8',
    );
    return JSON.parse(response);
  } catch (error) {
    console.warn(
      '[ MockSource.ts ] - readProgramDataFromFile - ktf: Error received on reading program data from file. Fallback to default data.',
      error,
    );
    return programsJsonData;
  }
};

/*
  This method is used to read a file for live events data placed in the data folder of the app.
  For example, the /home/app_user/packages/com.amazondeveloper.keplervideoapp/data folder
  on the device. This feature is added so developers can push different data on the device
  and reinstall the vpkg of the KVA to test the EPG sync task without rebuilding the app
  Partners read data from their respective backend.
*/
const readLiveEventDataFromFile = async (): Promise<LiveEventJson[]> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/liveEvents.txt',
      'UTF-8',
    );
    return JSON.parse(response);
  } catch (error) {
    console.warn(
      '[ MockSource.ts ] - readLiveEventDataFromFile - ktf: Error received on reading live events data from file. Fallback to default data.',
      error,
    );
    return liveEventsJsonData;
  }
};

const channelsJsonPromise: Promise<ChannelJson[]> = readChannelDataFromFile();
const programsJsonPromise: Promise<ProgramJson[][]> = readProgramDataFromFile();
const liveEventsJsonPromise: Promise<LiveEventJson[]> =
  readLiveEventDataFromFile();

/**
 * Converts a timestamp to the midnight UTC epoch timestamp of the same day.
 * @param timestamp - The input timestamp in milliseconds since Unix epoch
 * @returns The epoch timestamp for 00:00:00.000 UTC of the same day
 */
const getMidnightEpochUTC = (timestamp: number): number =>
  new Date(new Date(timestamp).setUTCHours(0, 0, 0, 0)).getTime();

const getAllMockedPrograms = async (): Promise<IProgram[]> => {
  const programsJson = await programsJsonPromise;
  let programs: IProgram[] = [];
  try {
    // When this app is built, the first program starts at the midnight UTC epoch timestamp of the same day.
    const firstProgramStartTimeMs = getMidnightEpochUTC(Date.now());
    for (let i = 0; i < programsJson.length; i++) {
      const programsForOneChannel = programsJson[i];
      let tempTime = firstProgramStartTimeMs;
      programsForOneChannel.forEach((element: any) => {
        const startTimeMs = tempTime;
        const programDuration =
          new Date(element.endTime).getTime() -
          new Date(element.startTime).getTime();
        const endTimeMs = startTimeMs + programDuration;

        // The program is assigned with the given startTimeMs and endTimeMs.
        const program = buildProgram(element, startTimeMs, endTimeMs);
        programs.push(program);
        tempTime = endTimeMs;
      });
    }
    return Promise.resolve(programs);
  } catch (error) {
    return Promise.reject(error);
  }
};

let allProgramsDataPromise: Promise<IProgram[]>;

export const getMockedChannelLineup = async (
  start: number,
  pageSize: number,
): Promise<IChannelInfo[]> => {
  const channelsJson = await channelsJsonPromise;
  let channels: IChannelInfo[] = [];
  const availableChannels = channelsJson.length;
  if (start >= availableChannels) {
    // mock no more pages available
    return Promise.resolve(channels);
  }

  try {
    console.log(
      '[ MockSource.ts ] - getMockedChannelLineup - Build Channel info',
    );
    const end = Math.min(availableChannels, start + pageSize);
    for (let i = start; i < end; i++) {
      const channel = buildChannelInfo(channelsJson[i]);
      channels.push(channel);
    }
    return Promise.resolve(channels);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMockedChannelLineupSize = async (): Promise<number> => {
  console.log(
    '[ MockSource.ts ] - getMockedChannelLineupSize - Build Channel info',
  );
  const channelsJson = await channelsJsonPromise;
  return Promise.resolve(channelsJson.length);
};

export const getMockedPrograms = async (
  start: number,
  pageSize: number,
): Promise<IProgram[]> => {
  try {
    console.info(
      '[ MockSource.ts ] - getMockedPrograms - Get Promise for alll Program Data',
    );
    let programs: IProgram[] = [];
    if (!allProgramsDataPromise) {
      allProgramsDataPromise = getAllMockedPrograms();
    }
    const allMockedPrograms = await allProgramsDataPromise;

    if (start >= allMockedPrograms.length) {
      // No more pages are available.
      return Promise.resolve(programs);
    }
    const end = Math.min(allMockedPrograms.length, start + pageSize);
    console.info(
      '[ MockSource.ts ] - ktf:EpgSync - The start and end range for current paginated call - start: ',
      start,
      'end: ',
      end,
    );
    // Slice the list based on the start and page size
    programs = allMockedPrograms.slice(start, end);

    return Promise.resolve(programs);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMockedProgramLineupSize = async (): Promise<number> => {
  let length = 0;
  const programsJson = await programsJsonPromise;
  programsJson.map((item: any[]) => (length += item.length));
  return Promise.resolve(length);
};

export const getMockedLiveEventLineup = async (
  start: number,
  pageSize: number,
): Promise<ILiveEvent[]> => {
  const liveEventsJson = await liveEventsJsonPromise;
  let liveEvents: ILiveEvent[] = [];
  const availableLiveEvents = liveEventsJson.length;
  if (start >= availableLiveEvents) {
    // mock no more pages available
    return Promise.resolve(liveEvents);
  }

  try {
    // When this app is built, the first live event starts 45 minutes earlier than the current system time.
    let tempTime = Date.now() - FORTY_FIVE_MINS_IN_MS;
    const end = Math.min(availableLiveEvents, start + pageSize);
    for (let i = start; i < end; i++) {
      const startTimeMs = tempTime;
      // Set the interval of the live event as 2 hours.
      const endTimeMs = startTimeMs + 2 * HOUR_IN_MS;
      const liveEvent = buildLiveEvent(
        liveEventsJson[i],
        startTimeMs,
        endTimeMs,
      );
      liveEvents.push(liveEvent);
      // Move startTimeMs and endTimeMs forward regardless of if they were used.
      // This might cause gaps between live events, but that is fine.
      tempTime = endTimeMs;
    }
    return Promise.resolve(liveEvents);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getMpaaRating = (program: any): string | undefined => {
  // We're parsing through an array of string ratings. Pick the first string rating
  // that we recognize and translate it into a format that Parental Controls can recognize.
  // A real implementation needs a more robust solution.
  const ratings: string[] = program?.ratings;
  if (Array.isArray(ratings)) {
    for (const rating of ratings) {
      switch (rating) {
        case 'MPAA::G':
          return 'US_MV_G';
        case 'MPAA::PG':
          return 'US_MV_PG';
        case 'MPAA::PG-13':
          return 'US_MV_PG13';
        case 'MPAA::R':
          return 'US_MV_R';
        case 'MPAA::NC-17':
          return 'US_MV_NC17';
      }
    }
  }

  // Default to an undefined rating, which indicates unrated content.
  return undefined;
};

export const getMockedCurrentTitleDataForChannel = async (
  matchString: string,
): Promise<TitleData> => {
  // Return the first program found with a matching channel ID, since
  // start and end times can be generated arbitrarily. See
  // `getMockedPrograms` for this logic. A real implementation will
  // be able to look this up on the catalog server.
  const channels = await programsJsonPromise;
  for (const channel of channels) {
    for (const program of channel) {
      if (program.channelIdentifier === matchString) {
        const result: TitleData = {
          ...program,
          mpaaRating: getMpaaRating(program),
        };
        return Promise.resolve(result);
      }
    }
  }

  // If we can't find a program, just default to a hard-coded one.
  return Promise.resolve(tileData);
};

const buildChannelInfo = (element: any): IChannelInfo => {
  // build ChannelDescriptor
  const channelDescriptoBuilder = new ChannelDescriptorBuilder();
  if ('identifier' in element) {
    channelDescriptoBuilder.identifier(element.identifier);
  }
  if ('majorNumber' in element) {
    channelDescriptoBuilder.majorNumber(element.majorNumber);
  }
  if ('minorNumber' in element) {
    channelDescriptoBuilder.minorNumber(element.minorNumber);
  }
  const descriptor = channelDescriptoBuilder.build();

  // build MetaData
  const metadataBuilder = new ChannelMetadataBuilder();
  if ('name' in element) {
    metadataBuilder.name(element.name);
  }
  if ('type' in element) {
    metadataBuilder.channelType(element.type);
  }
  if ('logoUrl' in element) {
    metadataBuilder.logoUrl(element.logoUrl);
  }
  if ('genres' in element) {
    metadataBuilder.genres(element.genres);
  }
  if ('attributes' in element) {
    metadataBuilder.attributes(element.attributes);
  }
  if ('resolution' in element) {
    metadataBuilder.videoResolution(element.resolution);
  }
  if ('rank' in element) {
    metadataBuilder.sortRank(element.rank);
  }
  if ('externalIds' in element) {
    let ids = element.externalIds.map(
      (x: { idType: string; value: string }) => {
        let externalIdBuilder = new ExternalIdBuilder();
        externalIdBuilder.idType(x.idType);
        externalIdBuilder.value(x.value);
        return externalIdBuilder.build();
      },
    );
    metadataBuilder.externalIdList(ids);
  }
  const metadata = metadataBuilder.build();

  // build ChannelInfo
  return new ChannelInfoBuilder()
    .channelDescriptor(descriptor)
    .channelMetadata(metadata)
    .build();
};

const buildProgram = (
  element: any,
  startTimeMs: number,
  endTimeMs: number,
): IProgram => {
  // build ChannelDescriptor
  const channelDescriptorBuilder = new ChannelDescriptorBuilder();
  if ('channelIdentifier' in element) {
    channelDescriptorBuilder.identifier(element.channelIdentifier);
  }
  if ('channelMajorNumber' in element) {
    channelDescriptorBuilder.majorNumber(element.channelMajorNumber);
  }
  if ('channelMinorNumber' in element) {
    channelDescriptorBuilder.minorNumber(element.channelMinorNumber);
  }
  const descriptor = channelDescriptorBuilder.build();

  // build program
  const programBuilder = new ProgramBuilder();
  programBuilder.channelDescriptor(descriptor);
  if ('id' in element) {
    programBuilder.identifier(element.id);
  }
  if ('title' in element) {
    programBuilder.title(element.title);
  }
  if ('startTime' in element) {
    programBuilder.startTimeMs(startTimeMs);
  }
  if ('endTime' in element) {
    programBuilder.endTimeMs(endTimeMs);
  }
  if ('subtitle' in element) {
    programBuilder.subtitle(element.subtitle);
  }
  if ('description' in element) {
    programBuilder.description(element.description);
  }
  if ('thumbnailUrl' in element) {
    programBuilder.thumbnailUrl(element.thumbnailUrl);
  }
  if ('posterArtUrl' in element) {
    programBuilder.posterArtUrl(element.posterArtUrl);
  }
  if ('ratings' in element) {
    programBuilder.ratings(element.ratings);
  }
  if ('genres' in element) {
    programBuilder.genres(element.genres);
  }
  if ('attributes' in element) {
    programBuilder.attributes(element.attributes);
  }
  if ('seriesInfo' in element) {
    const { season, episode } = element.seriesInfo;
    const builder = new SeriesInfoBuilder();
    builder.season(season);
    builder.episode(episode);
    const seriesInfo = builder.build();
    programBuilder.seriesInfo(seriesInfo);
  }
  return programBuilder.build();
};

const buildLiveEvent = (
  element: any,
  startTimeMs: number,
  endTimeMs: number,
): ILiveEvent => {
  // build live event
  const liveEventBuilder = new LiveEventBuilder();
  if ('identifier' in element) {
    liveEventBuilder.identifier(element.identifier);
  }
  if ('eventType' in element) {
    liveEventBuilder.eventType(element.eventType);
  }
  if ('startTime' in element) {
    liveEventBuilder.startTimeMs(element.startTime);
  } else {
    liveEventBuilder.startTimeMs(startTimeMs);
  }
  if ('endTime' in element) {
    liveEventBuilder.endTimeMs(element.endTime);
  } else {
    liveEventBuilder.endTimeMs(endTimeMs);
  }
  if ('title' in element) {
    liveEventBuilder.title(element.title);
  }
  if ('description' in element) {
    liveEventBuilder.description(element.description);
  }
  if ('ratings' in element) {
    liveEventBuilder.ratings(element.ratings);
  }
  if ('genres' in element) {
    liveEventBuilder.genres(element.genres);
  }
  if ('logoUrl' in element) {
    liveEventBuilder.logoUrl(element.logoUrl);
  }
  if ('posterArtUrl' in element) {
    liveEventBuilder.posterArtUrl(element.posterArtUrl);
  }
  if ('attributes' in element) {
    liveEventBuilder.attributes(element.attributes);
  }
  if ('sortRank' in element) {
    liveEventBuilder.sortRank(element.sortRank);
  }

  // build PlaybackReference
  const playbackReferenceBuilder = new PlaybackReferenceBuilder();
  if ('playbackType' in element) {
    playbackReferenceBuilder.playbackType(element.playbackType);
  }
  if ('contentId' in element && 'catalogName' in element) {
    playbackReferenceBuilder.mediaId(
      new MediaId(element.contentId, element.catalogName),
    );
  }
  const playbackReference = playbackReferenceBuilder.build();
  liveEventBuilder.playbackReference(playbackReference);

  return liveEventBuilder.build();
};
