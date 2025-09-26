// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  ChannelLineupProvider,
  EpgLineupInformation,
  IAddLiveEventFailure,
  IllegalStateError,
  InternalError,
  InvalidArgumentError,
  IUpsertProgramFailure,
  LiveEventProvider,
  ProgramLineupProvider2,
} from '@amazon-devices/kepler-epg-provider';

// NOTE: MockSource provides functions that are supposed to mock network calls made to download channels, programs from the 3P cloud.
import {
  getMockedChannelLineup,
  getMockedChannelLineupSize,
  getMockedLiveEventLineup,
  getMockedProgramLineupSize,
  getMockedPrograms,
} from '../mock/MockSource';

export const ingestChannelLineup = (
  version: string,
  progressCallback?: (channelProgress: number) => void,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.info('[ EpgSyncTask.ts ] - ingestChannelLineUp');
      const lastCommittedVersion =
        await EpgLineupInformation.getLastCommittedChannelLineupVersion();

      // NOTE: You should query your latest channel lineup version from your backend.
      const latestVersion = version;

      // If the last committed channel lineup version is the latest, no updates are required.
      if (lastCommittedVersion === latestVersion) {
        console.info(
          `EpgSync - Latest Channel Lineup version: ${latestVersion} same as last committed version: ${lastCommittedVersion}, skipping sync.`,
        );
        resolve();
        return;
      }

      /*
        If the version is mismatched, download the customer's entitled
        Channel Lineup in pages, incrementally parse the payload,
        and add the lineup using ChannelLineupProvider interface.
       */
      const totalChannels = await getMockedChannelLineupSize();

      const pageSize = 1000;
      let processedChannels = 0;
      let start = 0;
      let channels = await getMockedChannelLineup(start, pageSize);

      while (channels.length !== 0) {
        await ChannelLineupProvider.add(channels);
        processedChannels += channels.length;
        if (progressCallback) {
          progressCallback(processedChannels / totalChannels);
        }
        start += pageSize;
        channels = await getMockedChannelLineup(start, pageSize);
      }

      await ChannelLineupProvider.commit(latestVersion);
      console.info('EpgSync - channel lineup ingestion completed');
      resolve();
    } catch (error) {
      /*
       * NOTE: You should log these errors. Also consider propagating these errors to your backend so you can work with your
       * Amazon contact to fix these errors. If you encounter an InvalidArgumentError, the error message includes the total
       * number of failed insertions and the reasons for the first 5 failed channels. Please fix the invalid channel data ASAP.
       */
      console.error(
        `EpgSync - Error during channel lineup ingestion: ${error}`,
      );
      reject(error);
    }
  });
};

export const ingestProgramLineup = (
  version: string,
  progressCallback?: (programProgress: number) => void,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastCommittedVersion =
        await EpgLineupInformation.getLastCommittedProgramLineupVersion();

      // NOTE: You should query your latest program lineup version from your backend.
      const latestVersion = version;

      // If the last committed program lineup version is the latest, no updates are required.
      if (lastCommittedVersion === latestVersion) {
        console.info(
          `EpgSync - Latest Program Lineup version: ${latestVersion} same as last committed version: ${lastCommittedVersion}, skipping sync.`,
        );
        resolve();
        return;
      }

      /*
        NOTE: Optional - Use 'clearAllPrograms()' exclusively when there is a need to remove mistakenly
        added programs from the the Electronic Program Guide (EPG). This will not clear channel information from the data store.
        This function call 'clearAllPrograms()' must precede calls to 'upsert()' within the same transaction.
        ProgramLineupProvider actions are not persisted until 'commit()' is called.

        Please see ProgramLineupProvider2.clearAllPrograms.
      */

      /*
        If the version is mismatched, download your program lineup in pages,
       incrementally parse, and then set the lineup using the ProgramLineupProvider interface.

        If the channel corresponding the program’s ChannelDescriptor has not been committed,
        the ProgramLineupProvider.upsert operation fails.
       */
      const totalPrograms = await getMockedProgramLineupSize();
      const pageSize = 1000;
      let processedPrograms = 0;
      let start = 0;
      let programs = await getMockedPrograms(start, pageSize);
      let totalProgramFailures = 0;

      while (programs.length !== 0) {
        const upsertProgramFailures: IUpsertProgramFailure[] =
          await ProgramLineupProvider2.upsert(programs);

        if (upsertProgramFailures.length > 0) {
          totalProgramFailures += upsertProgramFailures.length;
          // NOTE: You should catch all the failed programs information and push it to your backend to quickly resolve the issues with the program data.
          processUpsertProgramFailures(upsertProgramFailures);

          /* NOTE: You can choose to continue upserting the remaining programs or abort the program ingestion process.
            throw Error(
             'Abort the program ingestion process due to invalid program data',
            );
          */
        }
        processedPrograms += programs.length;
        if (progressCallback) {
          progressCallback(processedPrograms / totalPrograms);
        }
        start += pageSize;
        programs = await getMockedPrograms(start, pageSize);
      }
      if (totalProgramFailures > 0) {
        console.info(
          `EpgSync - total number of errored programs ${totalProgramFailures} which failed to be upserted`,
        );
      }

      /*
        If any programs failed to upsert, and you did not abort the process when receiving those failure errors,
        then you can update the latestVersion for the successfully upserted programs. Send the information about
        the failed programs back to your backend so they can be fixed before the next sync.
      */
      await ProgramLineupProvider2.commit(latestVersion);
      console.info('EpgSync - programs lineup ingestion completed');

      resolve();
    } catch (error) {
      // NOTE: Consider propagating these errors to your backend so you can work with your Amazon contact to fix these errors.
      console.error(
        `EpgSync - Error during program lineup ingestion: ${error}`,
      );
      reject(error);
    }
  });
};

// NOTE: You should add the failed programs' information in the log and upload to your backend to quickly fix the invalid data.
const processUpsertProgramFailures = (
  upsertProgramFailures: IUpsertProgramFailure[],
): void => {
  upsertProgramFailures.forEach((element: IUpsertProgramFailure) => {
    const program = element.program;
    const programId = program.identifier;
    const channel = element.program.channelDescriptor;
    const err =
      element.error.message === undefined ? '' : element.error.message;
    console.error(
      `EpgSync failed to upsert program with id ${programId} which belongs to channel id ${channel.identifier} with error message ${err}`,
    );
  });
};

export const ingestLiveEventLineup = (version: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastCommittedVersion =
        await EpgLineupInformation.getLastCommittedLiveEventLineupVersion();

      // NOTE: You should query your latest live event lineup version from your backend.
      const latestVersion = version;

      // If the last committed live event lineup version is the latest, no updates are required.
      if (lastCommittedVersion === latestVersion) {
        console.info(
          `EpgSync - Latest Live Event Lineup version: ${latestVersion} same as last committed version: ${lastCommittedVersion}, skipping sync.`,
        );
        resolve();
        return;
      }

      /*
        If the version is mismatched, download your live event lineup in pages,
        incrementally parse, and then set the lineup using the LiveEventProvider interface.
       */
      const pageSize = 1000;
      let start = 0;
      let liveEvents = await getMockedLiveEventLineup(start, pageSize);
      let totalLiveEventFailures = 0;

      while (liveEvents.length !== 0) {
        const addLiveEventFailures: IAddLiveEventFailure[] =
          await LiveEventProvider.add(liveEvents);

        if (addLiveEventFailures.length > 0) {
          totalLiveEventFailures += addLiveEventFailures.length;
          // NOTE: You should catch all the failed live event information and push it to your backend to quickly resolve the issues with the live event data.
          processAddLiveEventFailures(addLiveEventFailures);

          /* NOTE: You can choose to continue adding the remaining live events or abort the live event ingestion process.
            throw Error(
             'Abort the live event ingestion process due to invalid live event data',
            );
          */
        }
        start += pageSize;
        liveEvents = await getMockedLiveEventLineup(start, pageSize);
      }

      if (totalLiveEventFailures > 0) {
        console.info(
          `EpgSync - total number of errored live events ${totalLiveEventFailures} which failed to be added`,
        );
      }

      await LiveEventProvider.commit(latestVersion);
      console.info('EpgSync - live event lineup ingestion completed');
      resolve();
    } catch (error) {
      // NOTE: Consider propagating these errors to your backend so you can work with your Amazon contact to fix these errors.
      console.error(
        `EpgSync - Error during live event lineup ingestion: ${error}`,
      );
      reject(error);
    }
  });
};

// NOTE: You should add the failed live events' information in the log and upload to your backend to quickly fix the invalid data.
const processAddLiveEventFailures = (
  addLiveEventFailures: IAddLiveEventFailure[],
): void => {
  addLiveEventFailures.forEach((element: IAddLiveEventFailure) => {
    const liveEvent = element.liveEvent;
    const liveEventId = liveEvent.identifier;
    const err =
      element.error.message === undefined ? '' : element.error.message;
    console.error(
      `EpgSync failed to add live event with id ${liveEventId} with error message ${err}`,
    );
  });
};

const doTask = (): Promise<void> => {
  console.info('EpgSync - EpgSync task starting...');
  return new Promise(async (resolve, reject) => {
    try {
      /*
        NOTE: The current timestamp is being used as the 'latestVersion' for mocking purposes.
        You should be querying this information from your backend.
      */
      const version = new Date(Date.now()).toISOString();
      await ingestChannelLineup(version);
      await ingestProgramLineup(version);
      await ingestLiveEventLineup(version);
      resolve();
      console.info('EpgSync - EPG Sync completed successfully!');
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        console.error(
          `EpgSync - EPG Sync failed due to ${error}, which is caused by missing mandatory fields.`,
        );
      } else if (error instanceof IllegalStateError) {
        console.error(
          `EpgSync - EPG Sync failed due to ${error}, which is caused by using an invalidated object.`,
        );
      } else if (error instanceof InternalError) {
        console.error(
          `EpgSync - EPG Sync failed due to ${error}, which may be retried immediately.`,
        );
      }
      reject(error);
    }
  });
};

export default doTask;
