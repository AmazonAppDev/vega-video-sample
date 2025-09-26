// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ImageURISource } from 'react-native';

export type NavBarItemType = 'category' | 'search' | 'preferences';

export interface NavBarItemAction {
  /** URL or path to the local file containing the imeage that represents the item. */
  iconUri: ImageURISource;
  /** Text that indicates the action of the item. */
  text: string;
  /** Type of the navigation item. */
  type: NavBarItemType;
  /** Action that will be executed when the navigation item is pressed. */
  onPress: () => void;
  /** Action that will be executed when the item receives a focus event. */
  onFocus?: () => void;
}
