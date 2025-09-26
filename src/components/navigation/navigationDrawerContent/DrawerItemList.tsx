// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  HWEvent,
  TVFocusGuideView,
  useTVEventHandler,
} from '@amazon-devices/react-native-kepler';
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from '@amazon-devices/react-navigation__drawer/lib/typescript/src/types';
import {
  DrawerNavigationState,
  ParamListBase,
} from '@amazon-devices/react-navigation__native';
import {
  NavigationState,
  PartialState,
  Route,
} from '@amazon-devices/react-navigation__routers/lib/typescript/src/types';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { findNodeHandle, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { DPADEventType, EVENT_KEY_DOWN } from '../../../constants';
import { focusSelectors } from '../../../store/focus/focusSlice';
import { Screens } from '../types';
import DrawerItem from './DrawerItem';

type NavigationRoute<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
> = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
  state?: NavigationState | PartialState<NavigationState>;
};

export interface DrawerItemListProps {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
  isDrawerInFocus: boolean;
  onDrawerListFocus: () => void;
  onDrawerListBlur: () => void;
  drawerWidth: number;
  testID?: string;
}

const NOT_FOCUSED_ITEM = -1;

const DrawerItemList = ({
  state,
  navigation,
  descriptors,
  onDrawerListFocus,
  onDrawerListBlur,
  isDrawerInFocus,
  drawerWidth,
  testID,
}: DrawerItemListProps) => {
  const [rootNodeHandle, setRootNodeHandle] = useState<number | undefined>(
    undefined,
  );

  const [selectedItem, setSelectedItem] = useState(0);
  const [focusedItem, setFocusedItem] = useState(NOT_FOCUSED_ITEM);
  const currentFocusScreen = useSelector(focusSelectors.getCurrentFocus);

  useTVEventHandler((evt: HWEvent) => {
    if (!isDrawerInFocus) {
      return;
    }

    if (evt?.eventKeyAction !== EVENT_KEY_DOWN) {
      return;
    }

    if (evt?.eventType === DPADEventType.SELECT) {
      onDrawerListBlur();
    }
    if (evt.eventType === DPADEventType.UP && focusedItem > 0) {
      setFocusedItem(focusedItem - 1);
    } else if (
      evt.eventType === DPADEventType.DOWN &&
      focusedItem < state.routes.length - 1
    ) {
      setFocusedItem(focusedItem + 1);
    } else if (evt.eventType === DPADEventType.SELECT) {
      const { name } = state.routes[focusedItem];
      onItemPress(name);
    }
  });

  useEffect(() => {
    if (currentFocusScreen === Screens.DEFAULT_SCREEN) {
      setFocusedItem(0);
      setSelectedItem(0);
    }
  }, [currentFocusScreen]);

  useEffect(() => {
    if (!isDrawerInFocus) {
      setFocusedItem(NOT_FOCUSED_ITEM);
    }
  }, [isDrawerInFocus]);

  const onItemPress = (routeName: string) => {
    const index: number = state.routes.findIndex(r => r.name === routeName);
    setFocusedItem(index);
    setSelectedItem(index);
    navigation.navigate(routeName);
  };

  const onFocus = () => {
    setFocusedItem(selectedItem);
    onDrawerListFocus();
  };

  const onBlur = () => {
    setFocusedItem(NOT_FOCUSED_ITEM);
    onDrawerListBlur();
  };

  return (
    <TVFocusGuideView style={styles.listContainer} trapFocusDown>
      <TouchableOpacity
        activeOpacity={1}
        ref={component => {
          const nodeHandle = findNodeHandle(component);
          setRootNodeHandle(nodeHandle ? nodeHandle : undefined);
        }}
        style={styles.listContainer}
        nextFocusDown={rootNodeHandle}
        nextFocusUp={rootNodeHandle}
        onFocus={onFocus}
        onBlur={onBlur}
        testID={testID}>
        {state.routes.map(
          (route: NavigationRoute<ParamListBase, string>, index: number) => {
            const { title, drawerLabel, drawerIcon } =
              descriptors[route.key].options;
            return (
              <DrawerItem
                key={route.key}
                label={title || (drawerLabel as string) || route.name}
                icon={drawerIcon as any}
                isSelected={selectedItem === index}
                isFocused={focusedItem === index}
                drawerWidth={drawerWidth}
                isDrawerInFocus={isDrawerInFocus}
                onPress={onItemPress}
                routeName={route.name}
              />
            );
          },
        )}
      </TouchableOpacity>
    </TVFocusGuideView>
  );
};

const areDrawerItemListPropsEqual = (
  prevProps: DrawerItemListProps,
  nextProps: DrawerItemListProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(DrawerItemList, areDrawerItemListPropsEqual);

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
