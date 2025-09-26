// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Background } from '@amazon-devices/kepler-ui-components';
import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { NavBarItemAction } from '../../components/NavigationBarItem';
import { ScreenLoader } from '../../components/ScreenLoader';
import { SearchInput } from '../../components/SearchInput';
import {
  generateBackgroundStyle,
  generateColorOverlayStyle,
  generateImageSources,
} from '../../helpers/helpers';
import { useIsRenderingComplete } from '../../hooks/useIsRenderingComplete';
import { getCommonStyles } from '../../styles/CommonStyles';
import { SearchPageScreenProps } from './SearchPageScreenProps';
import { getSearchPageScreenStyles } from './SearchPageScreenStyles';

/**
 * Kepler block for full screen search page with an input fie
 * ld to search content.
 */
export const SearchPageScreen = ({
  backgroundImageUri,
  backgroundColor,
  backgroundColorOverlay,
  navBarConfig,
  onSubmit,
}: SearchPageScreenProps) => {
  const navigationBarRendering = useIsRenderingComplete();
  const wrapperLayout =
    navBarConfig?.navBarOrientation === 'vertical' ? 'narrow' : 'wide';
  const styles = getSearchPageScreenStyles(wrapperLayout);
  const commonStyles = getCommonStyles();
  const navBarItems = useMemo(
    () => navBarConfig?.navBarItems,
    [navBarConfig?.navBarItems],
  );

  return (
    <View style={styles.searchPageScreenWrapper}>
      <Background
        type={backgroundImageUri ? 'image' : 'solid'}
        imageSources={generateImageSources(backgroundImageUri)}
        colorOverlayStyle={generateColorOverlayStyle(
          backgroundImageUri,
          backgroundColor,
        )}
        backgroundStyle={generateBackgroundStyle(
          backgroundImageUri,
          backgroundColor,
          backgroundColorOverlay,
        )}
        containerStyle={commonStyles.backgroundContainer}>
        {navigationBarRendering.isRendered || !navBarConfig ? (
          <TVFocusGuideView
            trapFocusDown={true}
            trapFocusRight={true}
            trapFocusUp={wrapperLayout !== 'wide'}
            trapFocusLeft={wrapperLayout !== 'narrow'}
            style={styles.searchPageContainer}
            testID="search_page_screen_content">
            <SearchInput onSubmit={onSubmit} placeholderText=" search..." />
          </TVFocusGuideView>
        ) : (
          <ScreenLoader testID="search_page_screen_loading_content" />
        )}
        {navBarConfig && (
          <NavBar
            navBarItems={navBarItems as NavBarItemAction[]}
            navBarOrientation={navBarConfig.navBarOrientation}
            navBarBackgroundColor={navBarConfig.navBarBackgroundColor}
            appLogoUri={navBarConfig?.appLogoUri}
            activeNavBarItem={navBarConfig.activeNavBarItem}
            alignPreferencesToBottom={navBarConfig.alignPreferencesToBottom}
            setNavigationBarIsRendered={
              navigationBarRendering.setRenderingCompleted
            }
          />
        )}
      </Background>
    </View>
  );
};
