import {
  ContentPersonalizationServer,
  CustomerListType,
  IContentEntitlementsHandler,
  IContentEntitlementsProvider,
  ICustomerListEntriesHandler,
  ICustomerListEntriesProvider,
  IPlaybackEventsHandler,
  IPlaybackEventsProvider,
} from '@amazon-devices/kepler-content-personalization';
import { IComponentInstance } from '@amazon-devices/react-native-kepler';
import {
  getDefaultMockPlaybackEvent,
  getMockContentEntitlement,
  getMockContentID,
  getMockCustomerListEntry,
} from '../personalization/mock/ContentPersonalizationMocks';
import { HeadlessServiceInterface } from './HeadlessInterface';

/***********Content Personalization Handlers*************/
const contentEntitlementsHandler: IContentEntitlementsHandler = {
  getAllContentEntitlements: (
    contentEntitlementsProvider: IContentEntitlementsProvider,
  ) => {
    console.log('getAllContentEntitlements function invoked');

    contentEntitlementsProvider.addContentEntitlementChunk([
      getMockContentEntitlement(),
    ]);

    contentEntitlementsProvider.commit();
  },
};

const customerListEntriesHandler: ICustomerListEntriesHandler = {
  getAllCustomerListEntries: (
    listType: CustomerListType,
    customerListEntriesProvider: ICustomerListEntriesProvider,
  ) => {
    console.log(
      `getAllCustomerListEntries function invoked for list Type: ${listType}`,
    );

    // the application has the ability to retrieve a chunks of data
    // and update the provider. Once all data is provided, `commit` can be
    // called to complete the transaction.
    customerListEntriesProvider.addCustomerListChunk(listType, [
      getMockCustomerListEntry(
        listType,
        getMockContentID('testId', 'testNamespace'),
      ),
    ]);

    customerListEntriesProvider.commit();
  },
};

const playbackEventsHandler: IPlaybackEventsHandler = {
  getPlaybackEventsSince: (
    sinceTimestamp: Date,
    playbackEventsProvider: IPlaybackEventsProvider,
  ) => {
    console.log('Playback event handler');
    // Apps can add all playback events to the playback provider.
    // This request can be batched and once done, a commit() can
    // be called to complete the transaction
    playbackEventsProvider.addPlaybackEventChunk([
      getDefaultMockPlaybackEvent(),
    ]);

    playbackEventsProvider.commit();
  },
};

class DataRefreshService implements HeadlessServiceInterface {
  onStart(componentInstance: IComponentInstance): Promise<void> {
    console.log(
      'Headless Service: started. Setting the handlers for Content Personalization',
    );

    ContentPersonalizationServer.setContentEntitlementsHandlerForComponent(
      contentEntitlementsHandler,
      componentInstance,
    );
    ContentPersonalizationServer.setCustomerListEntriesHandlerForComponent(
      customerListEntriesHandler,
      componentInstance,
    );
    ContentPersonalizationServer.setPlaybackEventsHandlerForComponent(
      playbackEventsHandler,
      componentInstance,
    );

    return Promise.resolve();
  }

  onStop(_componentInstance: IComponentInstance): Promise<void> {
    console.log('Headless Service: onStop() called');
    return Promise.resolve();
  }
}

const DataRefreshServiceInstance =
  new DataRefreshService() as HeadlessServiceInterface;

export const onStartDataRefreshService = (
  componentInstance: IComponentInstance,
): Promise<void> => {
  return DataRefreshServiceInstance.onStart(componentInstance);
};

export const onStopDataRefreshService = (
  componentInstance: IComponentInstance,
): Promise<void> => {
  return DataRefreshServiceInstance.onStop(componentInstance);
};
