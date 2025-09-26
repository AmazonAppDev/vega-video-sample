// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { NavBarItemAction, NavigationBarItem } from '../NavigationBarItem';

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { useIsFocused } from '@amazon-devices/react-navigation__core';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { AppLogo } from '../AppLogo';
import { InternalNavBarBarProps } from '../NavBar/InternalNavBarProps';
import { horizontalNavigationBarStyles } from './HorizontalNavigationBarStyles';

const HorizontalNavigationBarComponent = ({
  navBarItems,
  navBarBackgroundColor,
  appLogoUri,
  activeNavBarItem,
  setNavigationBarIsRendered,
}: InternalNavBarBarProps) => {
  const styles = horizontalNavigationBarStyles(navBarBackgroundColor);
  const [destinationItem, setDestinationItem] =
    useState<TouchableHighlight | null>(null);
  const [items, setItems] = useState<NavBarItemAction[]>([]);
  const isNavbarFocused = useIsFocused();

  useEffect(() => {
    setNavigationBarIsRendered?.(isNavbarFocused);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavbarFocused]);

  useEffect(() => {
    if (!navBarItems) {
      return;
    }

    const searchItems = [] as NavBarItemAction[];
    const menuItems = [] as NavBarItemAction[];

    navBarItems.forEach((item) => {
      if (item.type === 'search') {
        searchItems.push(item);
        return;
      }
      menuItems.push(item);
    });
    setItems([...searchItems, ...menuItems]);
  }, [navBarItems]);

  return (
    <View style={styles.horizontalNavBarContainer}>
      <View style={styles.horizontalNavBarWrapper}>
        <TVFocusGuideView
          destinations={[destinationItem]}
          style={styles.horizontalNavBarMenu}>
          {items.map((item, index) => {
            return (
              <NavigationBarItem
                ref={
                  item.text === activeNavBarItem
                    ? setDestinationItem
                    : undefined
                }
                item={item}
                key={item.text}
                isSelected={item.text === activeNavBarItem}
                onPress={item.onPress}
                onFocus={item.onFocus}
                showIcon={index === 0}
                showText={index !== 0}
              />
            );
          })}
        </TVFocusGuideView>
        {appLogoUri && (
          <View style={styles.horizontalNavBarLogo}>
            <AppLogo
              appLogoUri={appLogoUri}
              imageWidth={COMMON_STYLES.logoSize}
              imageHeight={COMMON_STYLES.logoSize}
              imageRoundedCorner={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export const HorizontalNavigationBar = React.memo(
  HorizontalNavigationBarComponent,
);
