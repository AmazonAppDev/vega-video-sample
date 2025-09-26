import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { SearchResultsScreen as ResultsScreen } from '../blocks/screen/SearchResultsScreen';
import { MediaItemEventData } from '../blocks/types';
import { AppStackScreenProps, Screens } from '../components/navigation/types';
import { createDataProvider } from '../services/dataProviderFactory';
import { searchSelectors } from '../store/search/searchSlice';
import { TitleData } from '../types/TitleData';

interface customMediaItemEventData extends MediaItemEventData {
  mediaItem: TitleData;
}
const mediaItemTileStyle = { mediaItemTileShowDescription: false };

const SearchResultsScreen = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.SEARCH_RESULTS_SCREEN>) => {
  const { searchKeyword } = route.params;
  const styles = createStyleSheet();
  const playlistsData = useSelector(searchSelectors.playlistData);
  const dataProvider = createDataProvider(playlistsData);
  const lastSelectedViewRef = useRef<any>(null);

  const onVideoSelect = useCallback(
    (data: customMediaItemEventData, viewRef?: any) => {
      lastSelectedViewRef.current = viewRef;

      navigation.navigate(Screens.PLAYER_SCREEN, {
        data: data.mediaItem,
        sendDataOnBack: () => {
          if (lastSelectedViewRef.current?.requestTVFocus) {
            lastSelectedViewRef.current.requestTVFocus();
          }
        },
      });
    },
    [navigation],
  );

  const convertToCustomMediaItemEventData = (
    data: MediaItemEventData,
  ): customMediaItemEventData => {
    return data as customMediaItemEventData;
  };

  return (
    <View style={styles.screen}>
      <ResultsScreen
        dataProvider={dataProvider}
        searchKeyword={{ searchKeyword }}
        onSearchPageButtonPressed={() => {
          lastSelectedViewRef.current = null;
          navigation.goBack();
        }}
        backgroundColor="black"
        onItemSelected={(data: MediaItemEventData, viewRef?: any) => {
          onVideoSelect(convertToCustomMediaItemEventData(data), viewRef);
        }}
        showPlaylistName={false}
        mediaItemStyleConfig={mediaItemTileStyle}
      />
    </View>
  );
};

const createStyleSheet = () => {
  return StyleSheet.create({
    screen: {
      height: '100%',
      width: '100%',
    },
  });
};

export default React.memo(SearchResultsScreen);
