import { NAVIGATION_ITEM_COLORS } from '../../styles/Colors';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export const getItemColor = (isFocused: boolean, isSelected: boolean) => {
  if (isFocused) {
    return {
      itemColor: NAVIGATION_ITEM_COLORS.icon.focused,
      itemBgColor: NAVIGATION_ITEM_COLORS.iconBg.focused,
    };
  } else if (isSelected) {
    return {
      itemColor: NAVIGATION_ITEM_COLORS.icon.selected,
      itemBgColor: NAVIGATION_ITEM_COLORS.iconBg.selected,
    };
  } else {
    return {
      itemColor: NAVIGATION_ITEM_COLORS.icon.default,
      itemBgColor: NAVIGATION_ITEM_COLORS.iconBg.default,
    };
  }
};
