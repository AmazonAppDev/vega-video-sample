import { configureStore } from '@reduxjs/toolkit';
import { getClassics } from '../../../src/data/local/classics';
import { getLatestHits } from '../../../src/data/local/latestHits';
import { getPremiumCollection } from '../../../src/data/local/premiumCollection';
import { getRecommendations } from '../../../src/data/local/recommendations';
import { RootState } from '../../../src/store';
import searchSlice, {
  fetchPlaylists,
  Playlist,
  searchSelectors,
  SearchState,
  setPlaylistData,
} from '../../../src/store/search/searchSlice';

// Mocking dependencies
jest.mock('@amazon-devices/kepler-file-system', () => ({
  getEntries: jest.fn((path: string) => {
    return path;
  }),
  readFileAsString: jest.fn(),
}));
jest.mock('../../../src/data/local/classics');
jest.mock('../../../src/data/local/latestHits');
jest.mock('../../../src/data/local/recommendations');
jest.mock('../../../src/data/local/premiumCollection');

describe('searchSlice', () => {
  const initialState: SearchState = {
    playlists: [],
    loading: false,
    error: null,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { search: searchSlice } });
    (getClassics as jest.Mock).mockReturnValue([{ id: 1, title: 'Classic' }]);
    (getLatestHits as jest.Mock).mockReturnValue([{ id: 2, title: 'Hit' }]);
    (getRecommendations as jest.Mock).mockReturnValue([
      { id: 3, title: 'Recommend' },
    ]);
    (getPremiumCollection as jest.Mock).mockReturnValue([
      { id: 4, title: 'Premium' },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(searchSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPlaylistData', () => {
    const newPlaylists: Playlist[] = [
      {
        playlistName: 'Latest Hits',
        medias: getLatestHits(),
      },
    ];
    const action = setPlaylistData(newPlaylists);
    const state = searchSlice(initialState, action);
    expect(state.playlists).toEqual(newPlaylists);
  });

  it('should set loading to true when fetchPlaylists is pending', () => {
    const action = { type: fetchPlaylists.pending.type };
    const state = searchSlice(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set loading to false when fetchPlaylists is not fulfilled', () => {
    const action = { type: fetchPlaylists.fulfilled.type };
    const state = searchSlice(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should select playlistData from state', () => {
    const mockState: RootState = {
      search: {
        playlists: [
          {
            playlistName: 'Selected Playlist',
            medias: [{ id: 6, title: 'Selected Media' }],
          },
        ],
        loading: false,
        error: null,
      },
    };
    const playlistData = searchSelectors.playlistData(mockState);
    expect(playlistData).toEqual(mockState.search.playlists);
  });
});
