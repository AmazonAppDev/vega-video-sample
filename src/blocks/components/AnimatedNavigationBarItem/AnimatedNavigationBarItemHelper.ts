// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NAVIGATION_ITEM_COLORS } from '../../styles/Colors';

export const getTextColor = (isFocused: boolean, isActive: boolean) => {
  if (isFocused) {
    return NAVIGATION_ITEM_COLORS.text.focused;
  } else if (isActive) {
    return NAVIGATION_ITEM_COLORS.text.active;
  } else {
    return NAVIGATION_ITEM_COLORS.text.default;
  }
};

export const getIconColors = (
  isFocused: boolean,
  isActive: boolean,
  isSelected: boolean,
) => {
  if (isFocused) {
    return {
      iconColor: NAVIGATION_ITEM_COLORS.icon.focused,
      iconBgColor: NAVIGATION_ITEM_COLORS.iconBg.focused,
    };
  } else if (isSelected) {
    return {
      iconColor: NAVIGATION_ITEM_COLORS.icon.selected,
      iconBgColor: NAVIGATION_ITEM_COLORS.iconBg.selected,
    };
  } else if (isActive) {
    return {
      iconColor: NAVIGATION_ITEM_COLORS.icon.active,
      iconBgColor: NAVIGATION_ITEM_COLORS.iconBg.active,
    };
  } else {
    return {
      iconColor: NAVIGATION_ITEM_COLORS.icon.default,
      iconBgColor: NAVIGATION_ITEM_COLORS.iconBg.default,
    };
  }
};
