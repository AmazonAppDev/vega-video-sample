// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { NavBarItemAction } from '../NavigationBarItem';
import { NavBar } from './NavBar';
import { NavBarProps } from './NavBarProps';

export const NavBarWrapper = ({
  navBarItems,
  navBarConfig,
  setNavigationBarIsRendered,
}: NavBarWrapperProps) => {
  return (
    <NavBar
      navBarItems={navBarItems}
      navBarOrientation={navBarConfig.navBarOrientation}
      navBarBackgroundColor={navBarConfig.navBarBackgroundColor}
      appLogoUri={navBarConfig?.appLogoUri}
      activeNavBarItem={navBarConfig.activeNavBarItem}
      alignPreferencesToBottom={navBarConfig.alignPreferencesToBottom}
      setNavigationBarIsRendered={setNavigationBarIsRendered}
    />
  );
};

interface NavBarWrapperProps {
  navBarItems: NavBarItemAction[];
  navBarConfig: NavBarProps;
  setNavigationBarIsRendered?: (isNavigationBarRendered: boolean) => void;
}
