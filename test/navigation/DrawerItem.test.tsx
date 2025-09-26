import { fireEvent, render } from '@testing-library/react-native';
import isEqual from 'lodash/isEqual';
import React from 'react';
import SearchSvg from '../../src/assets/svgr/SearchSVG';
import DrawerItem, {
  DrawerItemProps,
} from '../../src/components/navigation/navigationDrawerContent/DrawerItem';
import { COLORS } from '../../src/styles/Colors';

jest.mock('lodash/isEqual', () =>
  jest.requireMock('../helperMocks/MockLodashIsEqual'),
);

describe('DrawerItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockOnPress = jest.fn();

  const defaultProps: DrawerItemProps = {
    isSelected: false,
    isFocused: false,
    isDrawerInFocus: false,
    drawerWidth: 0,
    label: 'Test Label',
    icon: jest.fn(),
    onPress: mockOnPress,
    routeName: 'Profile',
  };
  const renderDrawerItem = (props?: Partial<DrawerItemProps>) => {
    return (
      <DrawerItem
        isSelected={false}
        isFocused={false}
        isDrawerInFocus={false}
        drawerWidth={0}
        label="Test Label"
        routeName="Profile"
        onPress={mockOnPress}
        {...props}
      />
    );
  };
  it('renders correctly', () => {
    const { getByText, toJSON } = render(renderDrawerItem());

    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Test Label')).toBeTruthy();
  });
  it('renders correctly with `isSelected`, `isFocused`, `isDrawerInFocus` enabled', () => {
    const { getByText, toJSON } = render(
      renderDrawerItem({
        isSelected: true,
        isFocused: true,
        isDrawerInFocus: true,
        drawerWidth: 300,
      }),
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Test Label')).toBeTruthy();
  });
  it('renders correctly with `isSelected`, `isFocused` enabled and `isDrawerInFocus` disabled', () => {
    const { getByText, toJSON } = render(
      renderDrawerItem({
        isSelected: true,
        isFocused: true,
        isDrawerInFocus: false,
        drawerWidth: 0,
      }),
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Test Label')).toBeTruthy();
  });
  it('renders correctly with `icon` and `isSelected` enabled', () => {
    const { getByText, toJSON } = render(
      renderDrawerItem({
        isSelected: true,
        isFocused: true,
        isDrawerInFocus: false,
        drawerWidth: 0,
        icon: () => {
          return (
            <SearchSvg
              testID="searchsvg"
              width={40}
              height={40}
              stroke={COLORS.SMOKE_WHITE}
              fill={COLORS.SMOKE_WHITE}
            />
          );
        },
      }),
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Test Label')).toBeTruthy();
  });
  it('renders correctly with `icon` and `isSelected` disabled', () => {
    const { getByText, toJSON } = render(
      renderDrawerItem({
        isSelected: false,
        isFocused: true,
        isDrawerInFocus: false,
        drawerWidth: 0,
        icon: () => {
          return (
            <SearchSvg
              testID="searchsvg"
              width={40}
              height={40}
              stroke={COLORS.SMOKE_WHITE}
              fill={COLORS.SMOKE_WHITE}
            />
          );
        },
      }),
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('does not re-render when props are unchanged', () => {
    const { rerender } = render(renderDrawerItem());

    rerender(renderDrawerItem());

    expect(isEqual).not.toHaveBeenCalledWith(defaultProps, defaultProps);
  });

  it('should call handleTouch and onPress when the view is touched', () => {
    const routeName = 'Profile';
    const { getByTestId } = render(renderDrawerItem());
    const view = getByTestId('touchableView');
    fireEvent(view, 'responderRelease', { preventDefault: jest.fn() });
    expect(mockOnPress).toHaveBeenCalledWith(routeName);
  });
});
