// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NavBarItemAction } from '../NavigationBarItem';

export interface NavBarProps {
  /** List of items that will appear in the navigation bar. */
  navBarItems: NavBarItemAction[];
  /** Color for the navigation bar background in hexadecimal. */
  navBarBackgroundColor?: string;
  /** Orientation of the navigation bar, it can be vertical or horizontal */
  navBarOrientation?: 'vertical' | 'horizontal';
  /** URL for the app logo or path to the file in the app directory. */
  appLogoUri?: string;
  /** This is the identifier of the nav bar item that we want to select as active. */
  activeNavBarItem?: string;
  /** This is a callback function to get access to selected navigation item ref. */
  selectedItemRefCallback?: (node: any) => void;
  /** Vertical navigation only. Align items with type preferences to the bottom of the navigation bar */
  alignPreferencesToBottom?: boolean;
}
