// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  DARK_GRAY: '#1C1C1C',
  LIGHT_GRAY: '#C2C2C2',
  GRAY: '#8F8F8F',
  BLUE: '#0000FF',
  RED: '#FF0000',
  YELLOW: '#FFFF00',
  VERY_DARK_GRAY: '#5d5d5d',
  LIME_GREEN: '#d9dbda',
  STRONG_RED: '#C82647',
  PALE_LIGHT_BLUE: '#F8F8FF',
  DOVE_GRAY: '#6A6A6A',
  SILVER: '#c2c2c2',
  OFF_WHITE: '#F1F1F1',
  INVISIBLE_BLACK: '#00000000',
  TRANSPARENT_OFF_WHITE: '#787878',
  TRANSLUCENT_OFF_WHITE: '#303030',
};

export const NAVIGATION_ITEM_COLORS = {
  text: {
    focused: COLORS.OFF_WHITE,
    active: COLORS.TRANSPARENT_OFF_WHITE,
    default: COLORS.INVISIBLE_BLACK,
  },

  icon: {
    focused: COLORS.BLACK,
    selected: COLORS.OFF_WHITE,
    active: COLORS.OFF_WHITE,
    default: COLORS.OFF_WHITE,
  },

  iconBg: {
    focused: COLORS.OFF_WHITE,
    selected: COLORS.TRANSLUCENT_OFF_WHITE,
    active: COLORS.INVISIBLE_BLACK,
    default: COLORS.INVISIBLE_BLACK,
  },
};
