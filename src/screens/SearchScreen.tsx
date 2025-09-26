import { useFocusEffect } from '@amazon-devices/react-navigation__core';
import React, { memo, useCallback, useState } from 'react';
import { SearchPageScreen } from '../blocks/screen/SearchPageScreen';
import BufferingWindow from '../components/BufferingWindow';
import { AppStackScreenProps, Screens } from '../components/navigation/types';

const SearchScreen = ({
  navigation,
}: AppStackScreenProps<Screens.SEARCH_SCREEN>) => {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, []),
  );

  const onSubmit = useCallback(
    (searchKeyword: string) => {
      navigation.navigate(Screens.SEARCH_RESULTS_SCREEN, { searchKeyword });
    },
    [navigation],
  );

  return isFocused ? (
    <SearchPageScreen onSubmit={onSubmit} backgroundColor="black" />
  ) : (
    <BufferingWindow />
  );
};

export default memo(SearchScreen);
