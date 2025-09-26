import {
  DataProviderState,
  INITIAL_STATE,
  KeplerBlocksDataProviderStatusType,
  KeplerBlocksError,
  MediaItem,
  MediaItemListDataProviderState,
  MediaPlaylist,
  PlaylistListDataProviderState,
} from '../../../src/blocks/types';

describe('DataProviderStates', () => {
  describe('INITIAL_STATE', () => {
    it('should have the correct initial values', () => {
      expect(INITIAL_STATE.dataStatus).toBe('UNINITIALIZED');
      expect(INITIAL_STATE.error).toBeUndefined();
      expect(INITIAL_STATE.data).toBeUndefined();
    });
  });

  // Type checking tests
  describe('Type checking', () => {
    it('should allow valid DataProviderState configuration', () => {
      const validState: DataProviderState = {
        dataStatus: 'LOADING',
        error: new KeplerBlocksError('RUNTIME', 'Test error'),
        data: [],
        retry: () => {},
      };

      expect(validState.dataStatus).toBe('LOADING');
      expect(validState.error).toBeDefined();
      expect(Array.isArray(validState.data)).toBeTruthy();
    });

    it('should allow valid PlaylistListDataProviderState configuration', () => {
      const mockPlaylist: MediaPlaylist[] = [];
      const validPlaylistState: PlaylistListDataProviderState = {
        dataStatus: 'LOADED',
        data: mockPlaylist,
      };

      expect(validPlaylistState.dataStatus).toBe('LOADED');
      expect(Array.isArray(validPlaylistState.data)).toBeTruthy();
    });

    it('should allow valid MediaItemListDataProviderState configuration', () => {
      const mockMediaItems: MediaItem[] = [];
      const validMediaItemState: MediaItemListDataProviderState = {
        dataStatus: 'LOADED',
        data: mockMediaItems,
      };

      expect(validMediaItemState.dataStatus).toBe('LOADED');
      expect(Array.isArray(validMediaItemState.data)).toBeTruthy();
    });

    it('should handle all possible status types', () => {
      const statusTypes: KeplerBlocksDataProviderStatusType[] = [
        'UNINITIALIZED',
        'LOADING',
        'LOADED',
        'ERROR',
        'NO_DATA',
      ];

      statusTypes.forEach((status) => {
        const state: DataProviderState = {
          dataStatus: status,
        };
        expect(state.dataStatus).toBe(status);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle error state correctly', () => {
      const errorState: DataProviderState = {
        dataStatus: 'ERROR',
        error: new KeplerBlocksError('RUNTIME', 'Test error message'),
        retry: () => {},
      };

      expect(errorState.dataStatus).toBe('ERROR');
      expect(errorState.error).toBeInstanceOf(KeplerBlocksError);
      expect(typeof errorState.retry).toBe('function');
    });
  });
});
