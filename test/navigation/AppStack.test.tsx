import { createStackNavigator } from '@amazon-devices/react-navigation__stack';
import { render } from '@testing-library/react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AppStack from '../../src/components/navigation/AppStack';
import { Screens } from '../../src/components/navigation/types';

jest.mock('../../src/screens/DetailsScreen', () => 'DetailsScreen');
jest.mock('../../src/screens/PlayerScreen', () => 'PlayerScreen');
jest.mock('../../src/screens/SearchResultsScreen', () => 'SearchResultsScreen');
jest.mock('../../src/screens/FeedbackScreen', () => 'FeedbackScreen');
jest.mock('../../src/components/navigation/AppDrawer', () => 'AppDrawer');
jest.mock('../../src/store/search/searchSlice', () => ({
  fetchPlaylists: jest.fn(),
}));

jest.mock('@amazon-devices/react-navigation__stack', () => ({
  createStackNavigator: jest.fn().mockReturnValue({
    Navigator: jest.fn(({ children }) => <div>{children}</div>),
    Screen: jest.fn(({ children }) => <div>{children}</div>),
  }),
}));

const mockStore = configureMockStore();

describe('AppStack', () => {
  let store: any;
  let mockDispatch: any;

  beforeEach(() => {
    store = mockStore({
      videoDetail: {
        watchList: [],
        purchasedList: [],
        rentList: [],
      },
    });
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation(
      (callback: (state: any) => any) => callback(store.getState()),
    );
  });

  const setup = () => {
    return render(<AppStack />);
  };

  it('renders correctly', () => {
    const { toJSON } = setup();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the navigator with the correct screens', () => {
    setup();
    const createStack = createStackNavigator();

    expect(createStack.Navigator).toHaveBeenCalled();
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.APP_DRAWER }),
      expect.any(Object),
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.DETAILS_SCREEN }),
      expect.any(Object),
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.PLAYER_SCREEN }),
      expect.any(Object),
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.SEARCH_RESULTS_SCREEN }),
      expect.any(Object),
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.FEEDBACK_SCREEN }),
      expect.any(Object),
    );
  });

  it('navigator has correct screen options', () => {
    setup();
    const createStack = createStackNavigator();
    const navigatorProps = (createStack.Navigator as jest.Mock).mock
      .calls[0][0];

    expect(navigatorProps.screenOptions).toEqual({
      headerShown: false,
      animationEnabled: false,
    });
  });

  it('uses Suspense for lazy-loaded components', () => {
    const createStack = createStackNavigator();

    const screenCalls = (createStack.Screen as jest.Mock).mock.calls;

    const testSuspense = (screenName: string) => {
      const screenComponent = screenCalls.find(
        (call) => call[0].name === screenName,
      )[0].component;
      const SuspenseComponent = screenComponent({ navigation: {}, route: {} });
      expect(SuspenseComponent.type).toBe(React.Suspense);
      expect(SuspenseComponent.props.fallback).toBeDefined();
    };

    testSuspense(Screens.DETAILS_SCREEN);
    testSuspense(Screens.PLAYER_SCREEN);
    testSuspense(Screens.SEARCH_RESULTS_SCREEN);
    testSuspense(Screens.FEEDBACK_SCREEN);
  });
});
