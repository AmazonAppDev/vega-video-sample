import { useFocusEffect } from '@amazon-devices/react-navigation__core';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SearchPageScreen } from '../../src/blocks/screen/SearchPageScreen';
import BufferingWindow from '../../src/components/BufferingWindow';
import { Screens } from '../../src/components/navigation/types';
import SearchScreen from '../../src/screens/SearchScreen';

jest.mock('@amazon-devices/react-navigation__core', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('../../src/components/BufferingWindow', () => () => (
  <div>BufferingWindow</div>
));

const mockNavigation = {
  navigate: jest.fn(),
} as any;

const mockRoute = {
  key: 'SearchScreen',
  name: Screens.SEARCH_SCREEN,
  params: {},
} as any;

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (isFocused: boolean) => {
    // Simulate focus/unfocus effect
    (useFocusEffect as jest.Mock).mockImplementationOnce((callback) => {
      if (isFocused) {
        callback();
      }

      return jest.fn();
    });

    return render(
      <SearchScreen navigation={mockNavigation} route={mockRoute} />,
    );
  };

  it('renders the SearchPageScreen with the correct props when focused', () => {
    const { UNSAFE_getByType } = renderComponent(true);

    const searchPageScreen = UNSAFE_getByType(SearchPageScreen);

    expect(searchPageScreen.props.backgroundColor).toBe('black');
    expect(searchPageScreen.props.onSubmit).toBeInstanceOf(Function);
  });

  it('navigates to SearchResultsScreen with the correct search keyword on submit', () => {
    const { UNSAFE_getByType } = renderComponent(true);
    const searchKeyword = 'test keyword';

    fireEvent(UNSAFE_getByType(SearchPageScreen), 'onSubmit', searchKeyword);

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      Screens.SEARCH_RESULTS_SCREEN,
      { searchKeyword },
    );
  });

  it('renders BufferingWindow when not focused', () => {
    const { UNSAFE_getByType } = renderComponent(false);

    const bufferingWindow = UNSAFE_getByType(BufferingWindow);

    expect(bufferingWindow).toBeTruthy();
  });
});
