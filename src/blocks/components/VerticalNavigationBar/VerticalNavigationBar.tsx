// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  TVFocusGuideView,
  useTVEventHandler,
} from '@amazon-devices/react-native-kepler';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageURISource,
  TouchableHighlight,
  View,
} from 'react-native';

import { useIsFocused } from '@amazon-devices/react-navigation__core';
import NAVIGATION_BAR_EXPANDED_BACKGROUND from '../../assets/primary_nav_expanded_gradient.png';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { AnimatedNavigationBarItem } from '../AnimatedNavigationBarItem';
import { AppLogo } from '../AppLogo';
import { InternalNavBarBarProps } from '../NavBar/InternalNavBarProps';
import { NavBarItemAction } from '../NavigationBarItem';
import { verticalNavigationBarStyle } from './VerticalNavigationBarStyle';

const animationDuration = {
  TEXT_OPACITY_FADEIN_DURATION: 400,
  TEXT_OPACITY_FADEOUT_DURATION: 400,
  TRANSLATE_FADEIN_DURATION: 400,
  TRANSLATE_FADEOUT_DURATION: 400,
};

const VerticalNavigationBarComponent = ({
  navBarItems,
  navBarBackgroundColor,
  appLogoUri,
  activeNavBarItem,
  alignPreferencesToBottom = false,
  setNavigationBarIsRendered,
}: InternalNavBarBarProps): React.ReactElement => {
  const [isActive, setIsActive] = useState(false);
  const [items, setItems] = useState([] as NavBarItemAction[]);
  const [firstPreferenceItemIndex, setFirstPreferenceItemIndex] = useState(0);
  const [destinationItem, setDestinationItem] =
    React.useState<TouchableHighlight | null>(null);
  const textOpacityAnimatedValue = useRef(new Animated.Value(0)).current;
  const translateAnimatedValue = useRef(new Animated.Value(0)).current;
  const isNavbarFocused = useIsFocused();
  const styles = verticalNavigationBarStyle();
  const openAnimation = [
    Animated.timing(textOpacityAnimatedValue, {
      toValue: 1,
      duration: animationDuration.TEXT_OPACITY_FADEIN_DURATION,
      useNativeDriver: true,
    }),
    Animated.timing(translateAnimatedValue, {
      toValue: 1,
      duration: animationDuration.TRANSLATE_FADEIN_DURATION,
      useNativeDriver: true,
    }),
  ];
  const closeAnimation = [
    Animated.timing(textOpacityAnimatedValue, {
      toValue: 0,
      duration: animationDuration.TEXT_OPACITY_FADEOUT_DURATION,
      useNativeDriver: true,
    }),
    Animated.timing(translateAnimatedValue, {
      toValue: 0,
      duration: animationDuration.TRANSLATE_FADEOUT_DURATION,
      useNativeDriver: true,
    }),
  ];

  useEffect(() => {
    if (alignPreferencesToBottom) {
      const bottomItems = [] as NavBarItemAction[];
      const middleItems = [] as NavBarItemAction[];
      navBarItems.forEach(item => {
        if (item.type === 'preferences') {
          bottomItems.push(item);
          return;
        }
        middleItems.push(item);
      });
      setItems([...middleItems, ...bottomItems]);
      setFirstPreferenceItemIndex(navBarItems.length - bottomItems.length);
    } else {
      setItems(navBarItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isNavbarFocused) {
      setIsActive(false);
      setNavigationBarIsRendered?.(true);
    } else {
      setNavigationBarIsRendered?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavbarFocused]);

  useLayoutEffect(() => {
    if (isActive) {
      Animated.parallel(openAnimation, { stopTogether: false }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useTVEventHandler(({ eventType, eventKeyAction }) => {
    // 0: KEY DOWN, 1: KEY UP

    // navigation bar exit with right press
    if (eventKeyAction === 0 && eventType === 'right' && isActive) {
      Animated.parallel(closeAnimation, { stopTogether: false }).start();
      setIsActive(false);
    }
  });

  return (
    <View
      style={[
        styles.verticalNavBar,
        { backgroundColor: isActive ? undefined : navBarBackgroundColor },
      ]}>
      {isActive && (
        <Animated.Image
          style={{
            tintColor: navBarBackgroundColor,
            position: 'absolute',
            opacity: 1,
            transform: [
              {
                translateX: translateAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-400, 0],
                }),
              },
            ],
          }}
          source={NAVIGATION_BAR_EXPANDED_BACKGROUND as ImageURISource}
        />
      )}
      {appLogoUri && (
        <View style={styles.verticalNavBarLogo}>
          <AppLogo
            appLogoUri={appLogoUri}
            imageWidth={COMMON_STYLES.logoSize}
            imageHeight={COMMON_STYLES.logoSize}
            imageRoundedCorner={false}
          />
        </View>
      )}
      <TVFocusGuideView
        style={styles.verticalNavBarContainer}
        destinations={[destinationItem]}>
        {items.map((item, index) => {
          return (
            <AnimatedNavigationBarItem
              ref={item.text === activeNavBarItem ? setDestinationItem : null}
              item={item}
              key={item.text}
              isSelected={item.text === activeNavBarItem}
              isActive={isActive}
              onFocusChangeListener={setIsActive}
              onPress={item.onPress}
              onFocus={item.onFocus}
              translateAnimatedValue={translateAnimatedValue}
              opacityAnimatedValue={textOpacityAnimatedValue}
              style={
                alignPreferencesToBottom &&
                item.type === 'preferences' &&
                index === firstPreferenceItemIndex
                  ? { paddingTop: 80 }
                  : undefined
              }
            />
          );
        })}
      </TVFocusGuideView>
    </View>
  );
};

export const VerticalNavigationBar = React.memo(VerticalNavigationBarComponent);
