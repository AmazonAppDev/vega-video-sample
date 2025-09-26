import { ContentPersonalizationServer } from '@amazon-devices/kepler-content-personalization';
import { IComponentInstance } from '@amazon-devices/react-native-kepler';
import {
  onStartDataRefreshService,
  onStopDataRefreshService,
} from '../../src/headless/DataRefreshService';

// Mock the ContentPersonalizationServer
jest.mock('@amazon-devices/kepler-content-personalization', () => ({
  ContentPersonalizationServer: {
    setContentEntitlementsHandlerForComponent: jest.fn(),
    setCustomerListEntriesHandlerForComponent: jest.fn(),
    setPlaybackEventsHandlerForComponent: jest.fn(),
  },
}));

describe('DataRefreshService', () => {
  // Create a mock component instance
  const mockComponentInstance: IComponentInstance = {
    name: 'mock-component-name',
    type: 1,
    id: 'mock-component-instance',
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('onStartDataRefreshService', () => {
    it('should set all handlers for Content Personalization', async () => {
      // Act
      await onStartDataRefreshService(mockComponentInstance);

      // Assert
      expect(
        ContentPersonalizationServer.setContentEntitlementsHandlerForComponent,
      ).toHaveBeenCalledTimes(1);
      expect(
        ContentPersonalizationServer.setContentEntitlementsHandlerForComponent,
      ).toHaveBeenCalledWith(expect.any(Object), mockComponentInstance);

      expect(
        ContentPersonalizationServer.setCustomerListEntriesHandlerForComponent,
      ).toHaveBeenCalledTimes(1);
      expect(
        ContentPersonalizationServer.setCustomerListEntriesHandlerForComponent,
      ).toHaveBeenCalledWith(expect.any(Object), mockComponentInstance);

      expect(
        ContentPersonalizationServer.setPlaybackEventsHandlerForComponent,
      ).toHaveBeenCalledTimes(1);
      expect(
        ContentPersonalizationServer.setPlaybackEventsHandlerForComponent,
      ).toHaveBeenCalledWith(expect.any(Object), mockComponentInstance);
    });
  });

  describe('onStopDataRefreshService', () => {
    it('should resolve successfully', async () => {
      // Act & Assert
      await expect(
        onStopDataRefreshService(mockComponentInstance),
      ).resolves.toBeUndefined();
    });
  });
});
