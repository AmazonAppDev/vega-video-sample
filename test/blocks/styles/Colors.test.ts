// Colors.test.ts

import {
  COLORS,
  NAVIGATION_ITEM_COLORS,
} from '../../../src/blocks/styles/Colors';

describe('COLORS', () => {
  test('should have all color values defined', () => {
    expect(COLORS.WHITE).toBe('#FFFFFF');
    expect(COLORS.BLACK).toBe('#000000');
    expect(COLORS.DARK_GRAY).toBe('#1C1C1C');
    expect(COLORS.LIGHT_GRAY).toBe('#C2C2C2');
    expect(COLORS.GRAY).toBe('#8F8F8F');
    expect(COLORS.BLUE).toBe('#0000FF');
    expect(COLORS.RED).toBe('#FF0000');
    expect(COLORS.YELLOW).toBe('#FFFF00');
    expect(COLORS.VERY_DARK_GRAY).toBe('#5d5d5d');
    expect(COLORS.LIME_GREEN).toBe('#d9dbda');
    expect(COLORS.STRONG_RED).toBe('#C82647');
    expect(COLORS.PALE_LIGHT_BLUE).toBe('#F8F8FF');
    expect(COLORS.DOVE_GRAY).toBe('#6A6A6A');
    expect(COLORS.SILVER).toBe('#c2c2c2');
    expect(COLORS.OFF_WHITE).toBe('#F1F1F1');
    expect(COLORS.INVISIBLE_BLACK).toBe('#00000000');
    expect(COLORS.TRANSPARENT_OFF_WHITE).toBe('#787878');
    expect(COLORS.TRANSLUCENT_OFF_WHITE).toBe('#303030');
  });

  test('should have valid hex color format', () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

    Object.values(COLORS).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});

describe('NAVIGATION_ITEM_COLORS', () => {
  test('should have correct text color states', () => {
    expect(NAVIGATION_ITEM_COLORS.text.focused).toBe(COLORS.OFF_WHITE);
    expect(NAVIGATION_ITEM_COLORS.text.active).toBe(
      COLORS.TRANSPARENT_OFF_WHITE,
    );
    expect(NAVIGATION_ITEM_COLORS.text.default).toBe(COLORS.INVISIBLE_BLACK);
  });

  test('should have correct icon color states', () => {
    expect(NAVIGATION_ITEM_COLORS.icon.focused).toBe(COLORS.BLACK);
    expect(NAVIGATION_ITEM_COLORS.icon.selected).toBe(COLORS.OFF_WHITE);
    expect(NAVIGATION_ITEM_COLORS.icon.active).toBe(COLORS.OFF_WHITE);
    expect(NAVIGATION_ITEM_COLORS.icon.default).toBe(COLORS.OFF_WHITE);
  });

  test('should have correct icon background color states', () => {
    expect(NAVIGATION_ITEM_COLORS.iconBg.focused).toBe(COLORS.OFF_WHITE);
    expect(NAVIGATION_ITEM_COLORS.iconBg.selected).toBe(
      COLORS.TRANSLUCENT_OFF_WHITE,
    );
    expect(NAVIGATION_ITEM_COLORS.iconBg.active).toBe(COLORS.INVISIBLE_BLACK);
    expect(NAVIGATION_ITEM_COLORS.iconBg.default).toBe(COLORS.INVISIBLE_BLACK);
  });
});
