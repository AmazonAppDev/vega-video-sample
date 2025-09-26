import { RouteProp } from '@amazon-devices/react-navigation__core';
import { StackNavigationProp } from '@amazon-devices/react-navigation__stack';
import isEqual from 'lodash/isEqual';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { ActionButtons } from '../components/details/ActionButtons';
import { DetailHeader } from '../components/details/DetailHeader';
import { RelatedMoviesSection } from '../components/details/RelatedMoviesSection';
import { RentalInfo } from '../components/details/RentalInfo';
import {
  AppStackParamList,
  AppStackScreenProps,
  Screens,
} from '../components/navigation/types';
import { VideoFileType } from '../components/VideoFileType';
import { useDetailScreenLogic } from '../hooks/details/useDetailScreenLogic';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

interface DetailsProps {
  navigation: StackNavigationProp<AppStackParamList, Screens.DETAILS_SCREEN>;
  route: RouteProp<AppStackParamList, Screens.DETAILS_SCREEN>;
}

const DetailsScreen = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.DETAILS_SCREEN>) => {
  const {
    loading,
    relatedData,
    buttonConfig,
    cardDimensions,
    playMovieButtonRef,
    navigateBack,
    onBlurPlayMovie,
    format,
    rating,
    rentalInfo,
  } = useDetailScreenLogic(navigation, route);

  const videoID = route.params.data.id;

  return (
    <View style={styles.container} testID={`detail-container-${videoID}`}>
      <ImageBackground
        resizeMode="cover"
        source={{ uri: route.params.data.posterUrl }}
        imageStyle={styles.imageBackground}
        style={styles.imageBackgroundContainer}>
        <DetailHeader
          title={route.params.data.title}
          rating={rating}
          description={route.params.data.description}
          videoID={videoID}
          onBackPress={navigateBack}
          titleData={route.params.data}
        />
        <View style={styles.content}>
          <ActionButtons
            buttonConfig={buttonConfig}
            playMovieButtonRef={playMovieButtonRef}
            onBlurPlayMovie={onBlurPlayMovie}
          />
          <RentalInfo {...rentalInfo} />
          <VideoFileType selectedFileType={format} />
          <RelatedMoviesSection
            loading={loading}
            relatedData={relatedData}
            cardDimensions={cardDimensions}
            heading="Related Movies:"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const areDetailsPropsEqual = (
  prevProps: DetailsProps,
  nextProps: DetailsProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(DetailsScreen, areDetailsPropsEqual);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  imageBackgroundContainer: {
    flex: 1,
  },
  imageBackground: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    marginLeft: scaleUxToDp(80),
  },
});
