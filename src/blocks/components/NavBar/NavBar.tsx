// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { HorizontalNavigationBar } from '../HorizontalNavigationBar';
import { VerticalNavigationBar } from '../VerticalNavigationBar';
import { InternalNavBarBarProps } from './InternalNavBarProps';

const NavBarComponent = ({
  navBarItems,
  navBarOrientation,
  navBarBackgroundColor,
  appLogoUri,
  activeNavBarItem,
  alignPreferencesToBottom,
  setNavigationBarIsRendered,
}: InternalNavBarBarProps) => {
  return navBarOrientation === 'vertical' ? (
    <VerticalNavigationBar
      navBarBackgroundColor={navBarBackgroundColor}
      appLogoUri={appLogoUri}
      activeNavBarItem={activeNavBarItem}
      navBarItems={navBarItems}
      alignPreferencesToBottom={alignPreferencesToBottom}
      setNavigationBarIsRendered={setNavigationBarIsRendered}
    />
  ) : (
    <HorizontalNavigationBar
      navBarItems={navBarItems}
      navBarBackgroundColor={navBarBackgroundColor}
      appLogoUri={appLogoUri}
      activeNavBarItem={activeNavBarItem}
      setNavigationBarIsRendered={setNavigationBarIsRendered}
    />
  );
};

const areNavBarPropsEqual = (
  oldProps: InternalNavBarBarProps,
  newProps: InternalNavBarBarProps,
) => {
  return oldProps.activeNavBarItem === newProps.activeNavBarItem;
};

export const NavBar = React.memo(NavBarComponent, areNavBarPropsEqual);
