import {
  ContentIdNamespaces,
  ContentInteractionType,
  ContentPersonalizationServer,
  CustomerListType,
} from '@amazon-devices/kepler-content-personalization';
import { useTheme } from '@amazon-devices/kepler-ui-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Platform, Systrace } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonConfig, Screens } from '../../components/navigation/types';
import {
  isContentPersonalizationEnabled,
  isInAppPurchaseEnabled,
} from '../../config/AppConfig';
import { getClassics } from '../../data/local/classics';
import { IAPConstants } from '../../iap/IAPConstants';
import { IAPManager } from '../../iap/utils/IAPManager';
import {
  getMockContentEntitlement,
  getMockContentID,
  getMockContentInteraction,
  getMockCustomerListEntry,
} from '../../personalization/mock/ContentPersonalizationMocks';
import { settingsSelectors } from '../../store/settings/SettingsSlice';
import {
  addToPurchaseList,
  addToRentList,
  addToWatchList,
  removeFromPurchaseList,
  removeFromRentList,
  removeFromWatchList,
  RentListItem,
  videoDetailSelectors,
} from '../../store/videoDetail/videoDetailSlice';
import { getVerticalCardDimensionsMd } from '../../styles/ThemeAccessors';
import { TitleData } from '../../types/TitleData';
import { focusManager } from '../../utils/FocusManager';
import { translate } from '../../utils/translationHelper';

const AddIcon = require('../../assets/add_solid.png');
const DeleteIcon = require('../../assets/delete_icon.png');
const PlayIcon = require('../../assets/play_solid.png');
const TransactionIcon = require('../../assets/transaction_solid.png');

const Constants = {
  PLAY_MOVIE: 'Play Movie',
  ADD_TO_LIST: 'Add to List',
  PURCHASE_SUBSCRIPTION: 'Purchase Subscription',
  RENT: 'Rent',
  RELATED_MOVIES: 'Related Movies:',
  REMOVE_FROM_LIST: 'Remove from List',
  REMOVE_SUBSCRIPTION: 'Remove Subscription',
  REMOVE_RENTAL: 'Remove Rental',
};

export const useDetailScreenLogic = (navigation: any, route: any) => {
  const [loading, setLoading] = useState(true);
  const [relatedData, setRelatedData] = useState<Array<TitleData>>([]);
  const [format, setFormat] = useState(route.params.data.format);
  const [showAddToWatchList, setShowAddToWatchList] = useState(true);
  const [showAddSubscription, setShowAddSubscription] = useState(true);
  const [showAddRental, setShowAddRental] = useState(true);
  const [rentalTimestamp, setRentalTimestamp] = useState<string | null>(null);

  const videoID = route.params.data.id;
  const watchList = useSelector(videoDetailSelectors.watchList);
  const purchasedList = useSelector(videoDetailSelectors.purchasedList);
  const rentList = useSelector(videoDetailSelectors.rentList);
  const countryCode = useSelector(settingsSelectors.countryCode);
  const dispatch = useDispatch();

  const currentTitle = useRef<string>(route.params.data.title);
  const focusableElementRef = useRef<any>(null);
  const playMovieButtonRef = useRef<any>(null);

  const rating = route.params.data.rating ?? '';
  const rentAmount = `${translate('currency', countryCode?.code)}${
    route.params.data.rentAmount
  }`;

  const theme = useTheme();
  const cardDimensions = useMemo(
    () => getVerticalCardDimensionsMd(theme),
    [theme],
  );

  useEffect(() => {
    let isMounted = true;

    // Can make this async if it is needed
    const loadData = () => {
      setLoading(true);
      const data = getClassics();
      if (isMounted) {
        setRelatedData(data);
        setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const navigateBack = useCallback(() => {
    navigation.navigate(Screens.HOME_SCREEN);
    return true;
  }, [navigation]);

  useEffect(() => {
    if (Systrace.isEnabled()) {
      Systrace.beginEvent('nav_details_screen');
      Systrace.endEvent();
    }
  }, []);

  useEffect(() => {
    if (Platform.isTV) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        navigateBack,
      );
      return () => backHandler.remove();
    }
  }, [navigateBack]);

  useEffect(() => {
    if (playMovieButtonRef?.current?.requestTVFocus) {
      playMovieButtonRef.current.requestTVFocus();
    }

    return () => {
      // Restore focus when leaving this screen
      if (route.params.focusId) {
        const focusKey = `tile_${route.params.focusId}`;
        focusManager.restoreFocus(focusKey);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for screen changes and update format
  const checkDetailScreenChanged = useCallback(() => {
    return currentTitle.current !== route.params.data.title;
  }, [currentTitle, route.params.data.title]);

  useEffect(() => {
    if (isInAppPurchaseEnabled()) {
      IAPManager.getPurchaseUpdates();
    }
  }, []);

  useEffect(() => {
    const { data } = route.params;
    if (checkDetailScreenChanged()) {
      console.info('Moved onto new Detail Screen');
      setFormat(data.format);
    }
  }, [route.params, checkDetailScreenChanged]);

  // IAP and personalization handlers
  const onPressPurchaseSubscription = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.MONTHLY_SUBSCRIPTION_SKU);
    try {
      dispatch(addToPurchaseList(videoID));
      setShowAddSubscription(false);
    } catch (e) {
      console.error(`k_sub_ent: ${e}`);
    }
  }, [dispatch, videoID]);

  const onPressRent = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.PURCHASE_TITLE_SKU);
    try {
      const currentDate = new Date().toISOString();
      const rentDetails = { videoID, rentedOn: currentDate };
      setRentalTimestamp(currentDate);
      if (isContentPersonalizationEnabled()) {
        console.info(
          'k_content_per: Reporting new Content entitlement for the purchase/rent',
        );
        const contentEntitlement = getMockContentEntitlement();
        ContentPersonalizationServer.reportNewContentEntitlement(
          contentEntitlement,
        );
      }
      dispatch(addToRentList(rentDetails));
      setShowAddRental(false);
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
  }, [dispatch, videoID]);

  const onPressAddToListHandler = useCallback(() => {
    dispatch(addToWatchList(videoID));
    if (isContentPersonalizationEnabled()) {
      console.info(
        'k_content_per: Reporting new Customer List entry for add to list',
      );
      try {
        const contentId = getMockContentID(
          videoID,
          ContentIdNamespaces.NAMESPACE_CDF_ID,
        );
        const customerListEntry = getMockCustomerListEntry(
          CustomerListType.WATCHLIST,
          contentId,
        );
        ContentPersonalizationServer.reportNewCustomerListEntry(
          CustomerListType.WATCHLIST,
          customerListEntry,
        );
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }
    setShowAddToWatchList(false);
  }, [dispatch, videoID]);

  const onPressRemoveSubscription = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.MONTHLY_SUBSCRIPTION_SKU);
    try {
      dispatch(removeFromPurchaseList(videoID));
      setShowAddSubscription(true);
    } catch (e) {
      console.error(`k_sub_ent: ${e}`);
    }
  }, [dispatch, videoID]);

  const onPressRemoveRent = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.PURCHASE_TITLE_SKU);
    try {
      if (isContentPersonalizationEnabled()) {
        console.info(
          'k_content_per: Reporting removed Content Entitlement for the purchase/rent',
        );
        const contentEntitlement = getMockContentEntitlement();
        ContentPersonalizationServer.reportRemovedContentEntitlement(
          contentEntitlement,
        );
      }
      dispatch(removeFromRentList(videoID));
      setShowAddRental(true);
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
  }, [dispatch, videoID]);

  const onPressRemoveFromListHandler = useCallback(() => {
    dispatch(removeFromWatchList(videoID));
    if (isContentPersonalizationEnabled()) {
      console.info(
        'k_content_per: Reporting Customer List entry for removing from list',
      );
      try {
        const contentId = getMockContentID(
          videoID,
          ContentIdNamespaces.NAMESPACE_CDF_ID,
        );
        const customerListEntry = getMockCustomerListEntry(
          CustomerListType.WATCHLIST,
          contentId,
        );
        ContentPersonalizationServer.reportRemovedCustomerListEntry(
          CustomerListType.WATCHLIST,
          customerListEntry,
        );
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }
    setShowAddToWatchList(true);
  }, [dispatch, videoID]);

  const navigateToPlayer = useCallback(async () => {
    if (isContentPersonalizationEnabled()) {
      console.info(
        'k_content_per: Reporting new Content Interaction for INGRESS',
      );
      try {
        const contentId = getMockContentID(
          videoID,
          ContentIdNamespaces.NAMESPACE_CDF_ID,
        );
        const contentInteraction = getMockContentInteraction(
          ContentInteractionType.INGRESS,
          contentId,
        );
        ContentPersonalizationServer.reportNewContentInteraction(
          contentInteraction,
        );
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }

    // Register focus restoration callback
    const focusKey = `player_return_${route.params.data.id}`;
    focusManager.registerFocusCallback(focusKey, () => {
      if (focusableElementRef.current?.requestTVFocus) {
        focusableElementRef.current.requestTVFocus();
      }
      if (playMovieButtonRef.current?.requestTVFocus) {
        playMovieButtonRef.current.requestTVFocus();
      }
    });

    const data = {
      data: route.params.data,
      focusId: route.params.data.id,
    };

    navigation.navigate(Screens.PLAYER_SCREEN, data);
  }, [
    navigation,
    route.params.data,
    videoID,
    focusableElementRef,
    playMovieButtonRef,
  ]);

  // Button configuration
  const buttonConfig: ButtonConfig[] = [
    {
      onPress: navigateToPlayer,
      image: PlayIcon,
      label: Constants.PLAY_MOVIE,
      ref: focusableElementRef,
      testID: 'details-action-play-movie-btn',
    },
    {
      onPress: showAddToWatchList
        ? onPressAddToListHandler
        : onPressRemoveFromListHandler,
      image: showAddToWatchList ? AddIcon : DeleteIcon,
      label: showAddToWatchList
        ? Constants.ADD_TO_LIST
        : Constants.REMOVE_FROM_LIST,
      testID: 'details-action-add-remove-btn',
    },
  ];

  if (isInAppPurchaseEnabled()) {
    buttonConfig.push({
      onPress: showAddSubscription
        ? onPressPurchaseSubscription
        : onPressRemoveSubscription,
      image: showAddSubscription ? TransactionIcon : DeleteIcon,
      label: showAddSubscription
        ? Constants.PURCHASE_SUBSCRIPTION
        : Constants.REMOVE_SUBSCRIPTION,
      testID: 'details-action-purchase-remove-subscription-btn',
    });
    buttonConfig.push({
      onPress: showAddRental ? onPressRent : onPressRemoveRent,
      image: showAddRental ? TransactionIcon : DeleteIcon,
      label: showAddRental ? Constants.RENT : Constants.REMOVE_RENTAL,
      testID: 'details-action-rent-remove-btn',
    });
  }

  useEffect(() => {
    if (videoID) {
      setShowAddToWatchList(!watchList.includes(videoID));
      setShowAddSubscription(!purchasedList.includes(videoID));
      const foundMovie = rentList.find(
        (item: RentListItem) => item.videoID === videoID,
      );
      if (foundMovie) {
        setRentalTimestamp(foundMovie.rentedOn);
        setShowAddRental(false);
      } else {
        setShowAddRental(true);
      }
    }
  }, [videoID, watchList, purchasedList, rentList]);

  const onBlurPlayMovie = () => {
    if (playMovieButtonRef?.current?.blur) {
      playMovieButtonRef.current.blur();
    }
  };

  return {
    loading,
    relatedData,
    buttonConfig,
    cardDimensions,
    playMovieButtonRef,
    navigateBack,
    onBlurPlayMovie,
    format,
    rating,
    rentalInfo: {
      showAddRental,
      rentalTimestamp,
      rentAmount,
    },
  };
};
