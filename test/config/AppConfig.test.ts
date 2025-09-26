jest.unmock('../../src/config/AppConfig');
import { Platform } from 'react-native';
import { isContentPersonalizationEnabled } from './../../src/config/AppConfig';
jest.mock('react-native', () => ({
  Platform: {
    isTV: false,
    OS: 'kepler',
  },
  Dimensions: {
    get: jest.fn(),
  },
}));
jest.mock('@amazon-devices/react-native-device-info', () => ({
  getModel: jest.fn().mockReturnValue('simulator'),
}));
describe('AppConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('TV Platform Tests', () => {
    beforeEach(() => {
      Platform.isTV = true;
    });
    test('should not be enable content personalization, since its Tv but is emulator', () => {
      expect(isContentPersonalizationEnabled()).toBe(false);
    });
  });
});
