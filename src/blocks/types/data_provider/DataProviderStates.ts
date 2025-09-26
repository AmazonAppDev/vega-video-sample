import { KeplerBlocksError } from '../media/KeplerBlocksError';
import { MediaItem } from '../media/MediaItem';
import { MediaPlaylist } from '../media/MediaPlaylist';

/**
 * Represents the current state of a DataProvider
 */
export interface DataProviderState {
  /**
   * Contains current status of data provider
   */
  dataStatus: KeplerBlocksDataProviderStatusType;

  /**
   * Contains the error details for the data provider
   */
  error?: KeplerBlocksError;

  /**
   * Data already retrieved in the data provider
   */
  data?: MediaPlaylist[] | MediaItem[];
  /**
   * Callback retry mechanism
   */
  retry?: () => void;
}

/** Possible status for data provider */
export type KeplerBlocksDataProviderStatusType =
  | 'UNINITIALIZED'
  | 'LOADING'
  | 'LOADED'
  | 'ERROR'
  | 'NO_DATA';

export interface PlaylistListDataProviderState extends DataProviderState {
  data?: MediaPlaylist[];
}
export interface MediaItemListDataProviderState extends DataProviderState {
  data?: MediaItem[];
}

export const INITIAL_STATE: DataProviderState = {
  dataStatus: 'UNINITIALIZED',
  error: undefined,
  data: undefined,
};
