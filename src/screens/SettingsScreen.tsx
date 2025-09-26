import { Button } from '@amazon-devices/kepler-ui-components';
import LinearGradient from '@amazon-devices/react-linear-gradient';
import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { useFocusEffect } from '@amazon-devices/react-navigation__core';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AccountLoginWrapperInstance } from '../AccountLoginWrapper';
import BufferingWindow from '../components/BufferingWindow';
import ConnectionComponent from '../components/ConnectionComponent';
import LocaleComponent from '../components/LocaleComponent';
import LoginInformation from '../components/LoginInformation';
import { AppDrawerScreenProps, Screens } from '../components/navigation/types';
import { isAccountLoginEnabled } from '../config/AppConfig';
import {
  setLoginStatus,
  settingsSelectors,
} from '../store/settings/SettingsSlice';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';
import { useDeviceInfo } from '../utils/useDeviceInfo';

interface ItemProps {
  title: string;
  value: string | undefined;
}

const ListItem: React.FC<ItemProps> = React.memo(({ title, value }) => (
  <View style={styles.rowView} testID={`item-${title}`}>
    <Text style={styles.subHeading}>{title}: </Text>
    <Text style={styles.subHeadingValue}>{value}</Text>
  </View>
));

const SettingsScreen: React.FC<AppDrawerScreenProps<Screens.SETTINGS_SCREEN>> =
  React.memo(({ navigation }) => {
    const dispatch = useDispatch();
    const loginStatus = useSelector(settingsSelectors.loginStatus);
    const { deviceInfo, isLoading, fetchDeviceInfo } = useDeviceInfo();

    useFocusEffect(
      useCallback(() => {
        fetchDeviceInfo();
      }, [fetchDeviceInfo]),
    );

    const handleOnToggleLoginStatus = useCallback(() => {
      dispatch(setLoginStatus(!loginStatus));
      AccountLoginWrapperInstance.updateStatus(!loginStatus);
    }, [dispatch, loginStatus]);

    const listData: ItemProps[] = useMemo(() => {
      if (!deviceInfo) {
        return [];
      }
      return [
        { title: 'Application Name', value: deviceInfo.applicationName },
        { title: 'Model', value: deviceInfo.modelName },
        { title: 'System Name', value: deviceInfo.systemName },
        { title: 'Version', value: deviceInfo.versionName },
        { title: 'Device Type', value: deviceInfo.deviceType },
        { title: 'Base OS', value: deviceInfo.baseOS },
        { title: 'Manufacturer', value: deviceInfo.manufacturer },
      ];
    }, [deviceInfo]);

    const renderListItems = useCallback(() => {
      return listData.map((item) => (
        <ListItem key={item.title} title={item.title} value={item.value} />
      ));
    }, [listData]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <BufferingWindow testID="buffering-view-settingsScreen-loading" />
        </View>
      );
    }

    return (
      <TVFocusGuideView
        style={styles.container}
        testID="settings-main-view"
        autoFocus>
        <LinearGradient
          testID={`${COLORS.GRAY}-${COLORS.DARK_GRAY}-${COLORS.DARK_GRAY}-${COLORS.BLACK}`}
          colors={[
            COLORS.GRAY,
            COLORS.DARK_GRAY,
            COLORS.DARK_GRAY,
            COLORS.BLACK,
          ]}
          style={styles.linearGradient}>
          <Text style={styles.title}>Settings</Text>
          <LocaleComponent />
          <ConnectionComponent testID="connection-component" />
          {isAccountLoginEnabled() && (
            <LoginInformation
              loginStatus={loginStatus}
              handleOnToggleLoginStatus={handleOnToggleLoginStatus}
            />
          )}
          <View style={styles.listContainer}>{renderListItems()}</View>
          <TVFocusGuideView trapFocusRight>
            <Button
              label="Feedback"
              onPress={() => {
                navigation.navigate(Screens.FEEDBACK_SCREEN);
              }}
              variant="secondary"
              mode="outlined"
              focusedStyle={styles.buttonFocused}
              style={styles.feedbackButton}
              labelStyle={styles.buttonLabel}
              size="sm"
            />
          </TVFocusGuideView>
        </LinearGradient>
      </TVFocusGuideView>
    );
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
  },
  linearGradient: {
    borderRadius: scaleUxToDp(5),
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: scaleUxToDp(20),
    paddingHorizontal: '25%',
  },
  title: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(70),
    marginTop: scaleUxToDp(20),
    marginBottom: scaleUxToDp(30),
  },
  listContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  rowView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleUxToDp(25),
    paddingHorizontal: 0,
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: 1,
  },
  subHeading: {
    fontSize: scaleUxToDp(26),
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  subHeadingValue: {
    fontSize: scaleUxToDp(26),
    color: COLORS.WHITE,
  },
  feedbackButton: {
    marginTop: 10,
    backgroundColor: COLORS.TRANSPARENT,
    color: COLORS.GRAY,
    borderColor: COLORS.GRAY,
    borderWidth: 3,
    borderRadius: scaleUxToDp(15),
    paddingHorizontal: scaleUxToDp(20),
  },
  buttonLabel: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(22),
  },
  buttonFocused: {
    borderColor: COLORS.ORANGE,
  },
});

export default React.memo(SettingsScreen);
