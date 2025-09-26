import { DrawerActions, useNavigation } from '@amazon-devices/react-navigation__core';
import { fireEvent, render } from '@testing-library/react-native';
import isEqual from 'lodash/isEqual';
import React from 'react';
import DrawerContent from '../../src/components/navigation/navigationDrawerContent/DrawerContent';
import DrawerItemList from '../../src/components/navigation/navigationDrawerContent/DrawerItemList';

jest.mock('@amazon-devices/react-navigation__core', () => ({
  useNavigation: jest.fn(),
  DrawerActions: {
    openDrawer: jest.fn(),
    closeDrawer: jest.fn(),
  },
  useNavigationState: jest.fn(),
}));

jest.mock('lodash/isEqual', () =>
  jest.requireMock('../helperMocks/MockLodashIsEqual'),
);

const mockState = {
  index: 0,
  routes: [
    { key: 'home', name: 'Home' },
    { key: 'search', name: 'Search' },
    { key: 'settings', name: 'Settings' },
  ],
};

const mockDescriptors = {
  home: {
    options: {},
    navigation: {
      dispatch: jest.fn(),
    },
  },
  search: {
    options: {},
    navigation: {
      dispatch: jest.fn(),
    },
  },
  settings: {
    options: {},
    navigation: {
      dispatch: jest.fn(),
    },
  },
};

describe('DrawerContent Component', () => {
  let navigationMock: { dispatch: any };
  let mockProps: any;

  beforeEach(() => {
    navigationMock = {
      dispatch: jest.fn(),
    };
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  mockProps = {
    state: mockState,
    navigation: { dispatch: jest.fn() },
    descriptors: mockDescriptors,
  };

  it('renders correctly', () => {
    const component = render(<DrawerContent {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with', () => {
    const component = render(<DrawerContent {...mockProps} />);
    expect(component).toMatchSnapshot();
    expect(DrawerItemList).toBeDefined();
  });

  it('re-renders when props are not equal', () => {
    const { rerender } = render(<DrawerContent {...mockProps} />);
    rerender(<DrawerContent {...mockProps} />);
    expect(jest.mocked(isEqual)).toHaveBeenCalled();
  });
  it('should handle focus correctly', () => {
    const { UNSAFE_getByType } = render(<DrawerContent {...mockProps} />);

    const drawerItemList = UNSAFE_getByType(DrawerItemList);
    fireEvent(drawerItemList, 'onDrawerListFocus');

    expect(navigationMock.dispatch).toHaveBeenCalledWith(
      DrawerActions.openDrawer(),
    );
  });

  it('should handle blur correctly', () => {
    const { UNSAFE_getByType } = render(<DrawerContent {...mockProps} />);

    const drawerItemList = UNSAFE_getByType(DrawerItemList);
    fireEvent(drawerItemList, 'onDrawerListBlur');

    expect(navigationMock.dispatch).toHaveBeenCalledWith(
      DrawerActions.closeDrawer(),
    );
  });
});
