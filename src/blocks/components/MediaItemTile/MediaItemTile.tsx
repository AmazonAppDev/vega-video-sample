// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

import { Card } from '@amazon-devices/kepler-ui-components';
import { COMMON_STYLES } from '../../constants/commonStyles';
import { convertSecondsToFormattedTime } from '../../helpers';
import { MediaItemTileProps } from './MediaItemTileProps';
import { useMediaItemTileStyle } from './useMediaItemTileStyle';

const FOCUS_ANIMATION_DURATION_MS = 150;
const BASE_FOCUS_SCALE = 1;

const MediaItemTileComponent = ({
  testID,
  item,
  listItemWidth,
  mediaItemStyleConfig,
  onItemFocused,
  onItemSelected,
  onItemBlurred,
  itemFocusScale = BASE_FOCUS_SCALE,
  cardTitleStyle,
}: MediaItemTileProps) => {
  const { style, imageSizes } = useMediaItemTileStyle(
    listItemWidth,
    mediaItemStyleConfig?.mediaItemTileImageAspectRatio ?? 'widescreen',
  );
  const animatedScale = useRef(new Animated.Value(BASE_FOCUS_SCALE)).current;
  const animatedViewRef = useRef<any>(null);
  const [enableDescription, setEnableDescription] = useState(
    mediaItemStyleConfig?.mediaItemTileShowDescription,
  );

  useLayoutEffect(() => {
    animatedScale.setValue(BASE_FOCUS_SCALE);
  }, [animatedScale]);

  const focusAnimation = (
    focusGained: boolean,
    duration = FOCUS_ANIMATION_DURATION_MS,
  ): {
    animation?: Animated.CompositeAnimation;
  } => {
    const newScale = focusGained ? itemFocusScale : BASE_FOCUS_SCALE;
    return {
      animation: Animated.timing(animatedScale, {
        toValue: newScale,
        duration,
        useNativeDriver: true,
      }),
    };
  };

  const handleOnFocusAnimation = React.useCallback(
    (focused: boolean) => {
      if (itemFocusScale === BASE_FOCUS_SCALE) {
        return;
      }
      focusAnimation(focused).animation?.start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focusAnimation],
  );

  const handleBlur = () => {
    onItemBlurred?.();
    handleOnFocusAnimation(false);
  };

  const handleFocus = () => {
    onItemFocused?.(item);
    handleOnFocusAnimation(true);
  };

  const handlePress = () => {
    onItemSelected?.(item, animatedViewRef.current);
  };

  const handleTitleTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (
        enableDescription &&
        event.nativeEvent.lines.length >= COMMON_STYLES.maxLinesLarge
      ) {
        setEnableDescription(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Animated.View
      ref={animatedViewRef}
      testID={testID}
      style={[
        {
          justifyContent: 'center',
          overflow: 'hidden',
          transform: [{ scale: animatedScale }],
        },
      ]}>
      <Card
        style={style.cardWrapper}
        focusedStyle={style.cardWrapper}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onPress={handlePress}>
        <Card.Image
          source={{ uri: item.thumbnail }}
          style={style.cardImage}
          width={imageSizes.imageWidth}
          height={imageSizes.imageHeight}
          size={'lg'}
          focusedStyle={style.focusedCardImage}
        />
        <Card.Body>
          <Card.Title
            style={[style.cardTitle, cardTitleStyle]}
            focusedStyle={style.focusedCardTitle}
            numberOfLines={COMMON_STYLES.maxLinesLarge}
            onTextLayout={handleTitleTextLayout}>
            {item.title +
              (item.duration
                ? ` - (${convertSecondsToFormattedTime(
                    Math.round(item.duration),
                  )})`
                : '')}
          </Card.Title>
          {mediaItemStyleConfig?.mediaItemTileShowDescription &&
            enableDescription && (
              <Card.Subtitle numberOfLines={COMMON_STYLES.maxLinesShort}>
                {item.description}
              </Card.Subtitle>
            )}
        </Card.Body>
      </Card>
    </Animated.View>
  );
};

export const MediaItemTile = React.memo(MediaItemTileComponent);
