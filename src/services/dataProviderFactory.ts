import {
  DataProvider,
  DataProviderFilteringCriteria,
  MediaPlaylist,
} from '../blocks/types';
import { TitleData } from '../types/TitleData';

export const createDataProvider = (playlistData: any) => {
  // Constructed DataProvider object
  const dataProvider: DataProvider = {
    getContent: async () => {
      return playlistData;
    },

    getContentByCriteria: async (
      dataProviderFilteringCriteria: DataProviderFilteringCriteria,
    ) => {
      const playlistsData: MediaPlaylist[] = playlistData;
      const filteredPlaylists: MediaPlaylist[] = [];
      const keyword =
        dataProviderFilteringCriteria.searchKeyword?.toLowerCase();
      if (keyword) {
        // If keyword is present, filter media items across all playlists
        playlistsData.forEach((playlist) => {
          const filteredMedia = playlist.medias.filter((mediaItem) =>
            mediaItem.title.toLowerCase().includes(keyword),
          );
          if (filteredMedia.length > 0) {
            // If any media items match the search keyword, add a new playlist with filtered media items
            filteredPlaylists.push({
              playlistName: playlist.playlistName,
              medias: filteredMedia,
            });
          }
        });
      }
      return filteredPlaylists;
    },
    getRelatedContent: async (mediaItem: TitleData, _playlistName?: string) => {
      const relatedMediaItems: TitleData[] = [mediaItem];
      return relatedMediaItems;
    },
  };

  return dataProvider;
};
