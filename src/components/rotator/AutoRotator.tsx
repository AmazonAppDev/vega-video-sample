// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { useFocusEffect } from '@amazon-devices/react-navigation__core';
import isEqual from 'lodash/isEqual';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import FocusableElement from '../FocusableElement';
import AutoRotatorItem from './AutoRotatorItem';
import PageIndicator from './PageIndicator';
import { MINUTE_MS, width } from './rotatorConfig';
import { RotatorData } from './type';
// Props for Auto Rotator
export interface AutoRotatorProps {
  onFocus?: () => void;
  onBlur?: () => void;
  data: RotatorData[];
}

const AutoRotator = (autoRotatorProps: AutoRotatorProps) => {
  const autoRotatingItems = useMemo(() => {
    return [...new Array(autoRotatorProps.data.length)].map(
      (_, item) => item * 1,
    );
  }, [autoRotatorProps.data.length]);

  const flatListRef = useRef<Animated.FlatList>(null);
  const [currentScrollIndex, setButtonIndex] = useState(0);
  const [isFocussed, setFocussed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll the FlatList item after a delay and update page indicator
  useFocusEffect(
    React.useCallback(() => {
      let interval: any = null;
      if (isFocussed) {
        interval = setInterval(scrollToIndex, MINUTE_MS);
      }
      return () => {
        if (interval != null) {
          clearInterval(interval);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocussed, currentIndex]),
  );

  //Helper method to scroll to next index
  const scrollToIndex = useCallback(() => {
    const nextIndex = (currentIndex + 1) % autoRotatorProps.data.length;
    if (nextIndex >= 0 && nextIndex < autoRotatorProps.data.length) {
      flatListRef?.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      setButtonIndex(nextIndex);
    } else {
      setCurrentIndex(0);
      setButtonIndex(0);
    }
  }, [currentIndex, autoRotatorProps.data.length, flatListRef]);

  const setFocus = (isFocus: boolean) => {
    setFocussed(isFocus);
  };

  // separator between each FlatList card
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderItem = useCallback(({ item }: { item: RotatorData }) => {
    return <AutoRotatorItem data={item} />;
  }, []); // won't recompute value unless the component is re-rendered.

  // Function to calculate the layout of each item
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: width, // Width of each item (assuming each item has the same width)
      offset: width * index, // Position of the item in the FlatList
      index,
    }),
    [],
  );

  const keyExtractor = useCallback((_item: any, index: any) => `${index}`, []);

  return (
    <TVFocusGuideView style={styles.container} trapFocusRight>
      <FocusableElement
        style={styles.container}
        onFocus={autoRotatorProps.onFocus}
        onBlur={autoRotatorProps.onBlur}
        getFocusState={setFocus}
        onFocusOverrideStyle={{}}>
        <Animated.View style={[styles.flatList]}>
          <Animated.FlatList
            ref={flatListRef}
            key={'rotatorItems'}
            data={autoRotatorProps.data}
            renderItem={renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            getItemLayout={getItemLayout}
          />
        </Animated.View>
        <PageIndicator
          autoRotatingItems={autoRotatingItems}
          currentScrollIndex={currentScrollIndex}
        />
      </FocusableElement>
    </TVFocusGuideView>
  );
};

const areAutoRotatorPropsEqual = (
  prevProps: AutoRotatorProps,
  nextProps: AutoRotatorProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};

export default React.memo(AutoRotator, areAutoRotatorPropsEqual);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    width: '100%',
    height: '100%',
  },
  pageIndicatorBackground: {
    flexDirection: 'row',
  },
  pageIndicatorCircleView: {
    width: scaleUxToDp(10),
    height: scaleUxToDp(10),
    borderRadius: scaleUxToDp(20),
    marginRight: scaleUxToDp(5),
    overflow: 'hidden',
    backgroundColor: COLORS.WHITE,
  },
  pageIndicatorMovingCircleView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: scaleUxToDp(10),
    height: scaleUxToDp(10),
    borderRadius: scaleUxToDp(20),
  },
  pageIndicatorContainerView: {
    width: '100%',
    height: scaleUxToDp(1),
    borderRadius: scaleUxToDp(20),
    padding: scaleUxToDp(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: scaleUxToDp(20),
    flexDirection: 'column',
  },
  RotatorItem: {
    width: width,
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    opacity: 1,
  },
  infoContainerView: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  titleMoreDetailsDisplayView: {
    borderRadius: scaleUxToDp(10),
    justifyContent: 'flex-end',
    width: '80%',
    height: scaleUxToDp(200),
    opacity: 1,
    marginTop: '10%',
  },
  titleText: {
    fontSize: scaleUxToDp(54),
    fontWeight: '700',
    width: '80%',
    height: scaleUxToDp(175),
    color: COLORS.WHITE,
  },
  descriptionText: {
    fontSize: scaleUxToDp(24),
    fontWeight: '700',
    width: '80%',
    height: scaleUxToDp(50),
    color: COLORS.WHITE,
  },
  detailButtonTextLabel: {
    color: COLORS.BLACK,
    fontSize: scaleUxToDp(24),
    fontFamily: 'Amazon Ember',
    fontWeight: 'bold',
  },
  detailButtonFocusLabel: {
    borderColor: COLORS.WHITE,
    borderWidth: 2,
    borderRadius: scaleUxToDp(10),
  },
  InfoView: {
    width: '100%',
    height: '50%',
    marginStart: '5%',
  },
  separator: {
    backgroundColor: COLORS.TRANSPARENT,
  },
});
