import { KeplerFileSystem as FileSystem } from '@amazon-devices/kepler-file-system';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '..';
import { getClassics } from '../../data/local/classics';
import { getLatestHits } from '../../data/local/latestHits';
import { getPremiumCollection } from '../../data/local/premiumCollection';
import { getRecommendations } from '../../data/local/recommendations';
import { TitleData } from '../../types/TitleData';
const fileName = 'KVATestData.json';

export interface Playlist {
  playlistName: string;
  medias: TitleData[];
}

const playlists = [
  {
    playlistName: 'Latest Hits',
    medias: getLatestHits(),
  },
  {
    playlistName: 'Classics',
    medias: getClassics(),
  },
  {
    playlistName: 'Recommendation',
    medias: getRecommendations(),
  },
  {
    playlistName: 'Premium Collection',
    medias: getPremiumCollection(),
  },
];

export interface SearchState {
  playlists: Array<Playlist>;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  playlists: [],
  loading: false,
  error: null,
};

export const fetchPlaylists = createAsyncThunk<Playlist[]>(
  'search/fetchPlaylists',
  async () => {
    try {
      const allFiles = await FileSystem.getEntries('/data');
      const exists = _.includes(allFiles, fileName);
      console.log(`searchSlice::Playlist File ${fileName} exists: `, exists);
      if (exists) {
        const response = await FileSystem.readFileAsString(
          `/data/${fileName}`,
          'UTF-8',
        );
        const loData = JSON.parse(response);
        return loData as Playlist[];
      } else {
        return playlists as Playlist[]; // Default data if file doesn't exist
      }
    } catch (error) {
      console.error('Error reading local file:', error);
      return playlists as Playlist[]; // Default data in case of error
    }
  },
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPlaylistData: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPlaylists.fulfilled,
        (state: SearchState, action: PayloadAction<Playlist[]>) => {
          state.playlists = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchPlaylists.rejected, (state: SearchState, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch playlists';
      });
  },
});

// Action creators are generated for each case reducer function
export const { setPlaylistData } = searchSlice.actions;

export const searchSelectors = {
  playlistData: (state: RootState) => state.search.playlists,
};

export default searchSlice.reducer;
