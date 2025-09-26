import { Header, HeaderProps } from '@amazon-devices/kepler-ui-components';
import { RouteProp } from '@amazon-devices/react-navigation__core';
import { StackNavigationProp } from '@amazon-devices/react-navigation__stack';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Systrace } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {
  AppStackParamList,
  Screens,
} from '../../src/components/navigation/types';
import { IAPManager } from '../../src/iap/utils/IAPManager';
import DetailsScreen from '../../src/screens/DetailsScreen';

jest.mock('../../src/utils/translationHelper', () => ({
  getSelectedLocale: jest.fn().mockReturnValue('en-US'),
  translate: jest.fn().mockReturnValue('mocked translation'),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Systrace.isEnabled = jest.fn().mockImplementation(() => true);
  RN.Systrace.beginEvent = jest.fn();
  RN.Systrace.endEvent = jest.fn();
  return RN;
});

jest.mock('../../src/personalization/mock/ContentPersonalizationMocks', () => ({
  __esModule: true,
  getMockPlaybackEventForVideo: jest.fn(),
  getMockContentEntitlement: jest.fn(),
  getMockContentID: jest.fn(),
  getMockContentInteraction: jest.fn(),
  getMockCustomerListEntry: jest.fn(),
}));

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as StackNavigationProp<AppStackParamList, Screens.DETAILS_SCREEN>;
const mockRoute: any = {
  params: {
    data: {
      title: 'Test Movie',
      id: '123',
      description: 'Test description',
      posterUrl: 'https://example.com/poster.jpg',
      rating: 4.5,
    },
    sendDataOnBack: jest.fn(),
  },
} as unknown as RouteProp<AppStackParamList, Screens.PLAYER_SCREEN>;

const mockStore = configureMockStore();

const renderDetailsScreen = () => {
  return <DetailsScreen navigation={mockNavigation} route={mockRoute} />;
};

describe('Details Component', () => {
  const ContentPersonalizationServer =
    require('@amazon-devices/kepler-content-personalization').ContentPersonalizationServer;

  let store: any;
  let mockDispatch: any;

  beforeEach(() => {
    store = mockStore({
      videoDetail: {
        watchList: [],
        purchasedList: [],
        rentList: [],
      },
      settingsSelectors: {
        countryCode: {},
        loginStatus: false,
      },
    });
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation(
      (callback: (state: any) => any) => callback(store.getState()),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with given props', () => {
    const { getByTestId } = render(renderDetailsScreen());

    expect(getByTestId('details-action-play-movie-btn')).toBeTruthy();
    expect(getByTestId('details-action-add-remove-btn')).toBeTruthy();
  });

  it('renders component and call Systrace event with it is mounted', () => {
    render(renderDetailsScreen());
    expect(Systrace.isEnabled).toHaveBeenCalled();
    expect(Systrace.beginEvent).toHaveBeenCalled();
    expect(Systrace.endEvent).toHaveBeenCalled();
  });

  it('navigates back when the back button is pressed', () => {
    const { UNSAFE_getByType } = render(renderDetailsScreen());
    fireEvent(UNSAFE_getByType(Header), 'onBackPress');
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('handles play movie button press', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    const playMovieButton = getByTestId('details-action-play-movie-btn');
    await act(async () => {
      fireEvent.press(playMovieButton);
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Player', {
      data: mockRoute.params.data,
      sendDataOnBack: expect.any(Function),
    });
  });

  it('updates selectedFileType when route params title changes', () => {
    const { rerender, getByTestId } = render(renderDetailsScreen());
    mockRoute.params.data.title = 'New Title';
    rerender(renderDetailsScreen());
    const component = getByTestId('detail-header');
    const componetHeaderProp = component.findByProps(
      (props: HeaderProps) => props.title === 'New Title',
    );
    expect(componetHeaderProp).toBeTruthy();
  });

  it('should add to watchlist when ADD_TO_LIST button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportNewCustomerListEntry,
      ).toHaveBeenCalled();
    });
  });

  it('should handle add to watch list error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportNewCustomerListEntry as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should remove from watchlist when REMOVE_FROM_LIST button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportRemovedCustomerListEntry,
      ).toHaveBeenCalled();
    });
    expect(getByTestId('details-action-add-remove-btn')).toBeTruthy();
  });

  it('should handle remove from watchlist error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportRemovedCustomerListEntry as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should purchase subscription when Purchase Subscription button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    await waitFor(() => {
      expect(IAPManager.triggerPurchase).toHaveBeenCalledWith(
        expect.any(String),
      );
    });
  });

  it('should rent movie when Rent button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(IAPManager.triggerPurchase).toHaveBeenCalledWith(
        expect.any(String),
      );
    });
  });

  it('should handle rent movie error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportNewContentEntitlement as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should remove rental when Remove Rental button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportRemovedContentEntitlement,
      ).toHaveBeenCalled();
    });
  });

  it('should handle remove rent error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportRemovedContentEntitlement as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should handle Navigate Player error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportNewContentInteraction as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-play-movie-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should not report to watchlist when ContentPersonalization is not enabled', async () => {
    jest.mock('../../src/config/AppConfig', () => ({
      isContentPersonalizationEnabled: jest.fn(() => false),
      isInAppPurchaseEnabled: jest.fn(() => false),
    }));
    render(renderDetailsScreen());
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportNewCustomerListEntry,
      ).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportRemovedCustomerListEntry,
      ).not.toHaveBeenCalled();
    });
  });
});
