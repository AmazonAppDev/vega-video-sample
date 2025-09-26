// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Background, Button } from '@amazon-devices/kepler-ui-components';
import React, { useState } from 'react';
import { ImageURISource, Text, View } from 'react-native';
import SearchSvg from '../../../assets/svgr/SearchSVG';
import back_icon from '../../assets/back_icon.png';
import { MediaContent } from '../../components/MediaContent';
import { MessageBox } from '../../components/MessageBox';
import { ScreenLoader } from '../../components/ScreenLoader';
import { getLayout } from '../../helpers';
import {
  generateBackgroundStyle,
  generateColorOverlayStyle,
  generateImageSources,
  getErrorMessage,
} from '../../helpers/helpers';
import { useGetContentByCriteriaDataProvider } from '../../hooks/useDataProvider';
import { getCommonStyles } from '../../styles/CommonStyles';
import { SearchResultsScreenProps } from './SearchResultsScreenProps';
import { searchResultsStyles } from './SearchResultsScreenStyle';

const MemoizedMediaContent = React.memo(MediaContent);

/**
 * Kepler block for full screen search page results.
 * It will typically display the results coming from a DataProvider.
 */
export const SearchResultsScreen = ({
  dataProvider,
  searchKeyword,
  featuredCategory,
  mediaItemStyleConfig,
  showPlaylistName,
  backgroundImageUri,
  backgroundColor,
  backgroundColorOverlay,
  onItemFocused,
  onItemSelected,
  onSearchPageButtonPressed,
}: SearchResultsScreenProps) => {
  const { dataStatus, error, data } = useGetContentByCriteriaDataProvider(
    dataProvider,
    searchKeyword,
  );
  const styles = searchResultsStyles();
  const commonStyles = getCommonStyles();
  const [isBackButtonFocused, setBackButtonFocused] = useState<boolean>(false);

  const renderContent = () => {
    if (dataStatus === 'ERROR' || dataStatus === 'NO_DATA') {
      return (
        <MessageBox
          message={
            dataStatus === 'ERROR'
              ? getErrorMessage(error)
              : 'There is no content to display.'
          }
          testID="search_result_screen_error_content"
        />
      );
    }
    if (dataStatus === 'LOADED' && data) {
      return (
        <View
          testID="search_result_screen_content"
          style={styles.searchResultsContent}>
          <MemoizedMediaContent
            playlists={data}
            layout={getLayout(data)}
            featuredCategory={featuredCategory}
            showPlaylistName={showPlaylistName}
            mediaItemStyleConfig={mediaItemStyleConfig}
            mediaItemTileColumnNumber={4}
            wrapperLayout="wide"
            onItemFocused={onItemFocused}
            onItemSelected={onItemSelected}
            gridStyle={styles.gridWrapperStyle}
          />
        </View>
      );
    }
    return (
      <ScreenLoader
        testID="search_result_screen_loading_content"
        style={styles.dotsWrapperView}
      />
    );
  };

  const handleBackButtonPress = () => {
    onSearchPageButtonPressed?.();
  };

  const handleBackButtonFocus = () => {
    setBackButtonFocused(true);
  };

  const handleBackButtonBlur = () => {
    setBackButtonFocused(false);
  };

  return (
    <Background
      type={backgroundImageUri ? 'image' : 'solid'}
      imageSources={generateImageSources(backgroundImageUri)}
      colorOverlayStyle={generateColorOverlayStyle(
        backgroundImageUri,
        backgroundColor,
      )}
      backgroundStyle={generateBackgroundStyle(
        backgroundImageUri,
        backgroundColor,
        backgroundColorOverlay,
      )}
      containerStyle={commonStyles.backgroundContainer}>
      <View style={styles.searchResutsWrapper}>
        {renderContent()}
        <View style={styles.searchResultsHeader}>
          <Button
            onPress={handleBackButtonPress}
            onFocus={handleBackButtonFocus}
            onBlur={handleBackButtonBlur}
            variant={'primary'}
            iconSource={back_icon as ImageURISource}
            iconSize={'sm'}
            mode={'transparent'}
            style={styles.backButtonWrapper}
            iconStyle={
              isBackButtonFocused ? styles.focusedBacIcon : styles.backIcon
            }
            accessibilityLabel={
              'Click this button to go back to the search screen'
            }
            focusedStyle={styles.focusedBackButtonWrapper}
          />
          <View style={styles.keywordWrapper}>
            <SearchSvg
              width={styles.searchIcon.width || 24}
              height={styles.searchIcon.height || 24}
              stroke="white"
              fill="white"
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.keywordText,
                styles.keywordTextContent,
              ]}>{`"${searchKeyword.searchKeyword}`}</Text>
            <Text style={styles.keywordText}>"</Text>
          </View>
        </View>
      </View>
    </Background>
  );
};
