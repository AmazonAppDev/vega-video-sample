import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from '@amazon-devices/react-navigation__drawer/lib/typescript/src/types';
import {
  DrawerNavigationState,
  ParamListBase,
} from '@amazon-devices/react-navigation__routers';
import { render } from '@testing-library/react-native';
import isEqual from 'lodash/isEqual';
import React from 'react';
import DrawerItemList, {
  DrawerItemListProps,
} from '../../src/components/navigation/navigationDrawerContent/DrawerItemList';

const mockState = {
  index: 0,
  routes: [
    { key: 'home', name: 'Home' },
    { key: 'search', name: 'Search' },
    { key: 'settings', name: 'Settings' },
  ],
} as unknown as DrawerNavigationState<ParamListBase>;
const mockDescriptors = {
  home: {
    options: {
      title: 'Home',
    },
  },
  search: {
    options: {
      title: 'Search',
    },
  },
  settings: {
    options: {
      title: 'Settings',
    },
  },
} as unknown as DrawerDescriptorMap;
const mockNavigation = {
  navigate: jest.fn(),
  dispatch: jest.fn(),
} as unknown as DrawerNavigationHelpers;

const onDrawerListFocusMock = jest.fn();
const onDrawerListBlurMock = jest.fn();
const mockNavigate = jest.fn();
const mockSetFocusedItem = jest.fn();
const mockSetSelectedItem = jest.fn();

const mockProps = {
  state: mockState,
  navigation: mockNavigation,
  descriptors: mockDescriptors,
  isDrawerInFocus: false,
  onDrawerListFocus: onDrawerListFocusMock,
  onDrawerListBlur: onDrawerListBlurMock,
  drawerWidth: 0,
};
const renderDrawerItemList = (props?: Partial<DrawerItemListProps>) => {
  return (
    <DrawerItemList
      state={mockState}
      navigation={mockNavigation}
      descriptors={mockDescriptors}
      isDrawerInFocus={false}
      onDrawerListFocus={onDrawerListFocusMock}
      onDrawerListBlur={onDrawerListBlurMock}
      drawerWidth={0}
      {...props}
    />
  );
};

// Define the onItemPress function
const onItemPress = (routeName: string) => {
  const index = mockState.routes.findIndex((r) => r.name === routeName);
  mockSetFocusedItem(index);
  mockSetSelectedItem(index);
  mockNavigate(routeName);
};

jest.mock('lodash/isEqual', () =>
  jest.requireMock('../helperMocks/MockLodashIsEqual'),
);

describe('DrawerItemList', () => {
  it('renders correctly', () => {
    const component = render(renderDrawerItemList());
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with', () => {
    const component = render(renderDrawerItemList());
    expect(component).toMatchSnapshot();
  });

  it('should set focused item, set selected item, and navigate to the route', () => {
    // Act: Call the onItemPress function with a route name
    const routeName = 'Profile';
    onItemPress(routeName);

    // Assert: Check if the correct functions were called with expected values
    const expectedIndex = mockState.routes.findIndex(
      (r) => r.name === routeName,
    );

    expect(mockSetFocusedItem).toHaveBeenCalledWith(expectedIndex);
    expect(mockSetSelectedItem).toHaveBeenCalledWith(expectedIndex);
    expect(mockNavigate).toHaveBeenCalledWith(routeName);
  });

  it('re-renders when props are not equal', () => {
    const { rerender } = render(<DrawerItemList {...mockProps} />);
    rerender(<DrawerItemList {...mockProps} />);
    expect(jest.mocked(isEqual)).toHaveBeenCalled();
  });
});
