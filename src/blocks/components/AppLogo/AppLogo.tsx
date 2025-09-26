// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { Image } from 'react-native';
import { AppLogoProps } from './AppLogoProps';
import { appLogoStyles } from './AppLogoStyles';

const AppLogoComponent = ({
  appLogoUri,
  imageWidth,
  imageHeight,
  imageRoundedCorner,
}: AppLogoProps) => {
  if (!appLogoUri) {
    return null;
  }

  const styles = appLogoStyles();

  return (
    <Image
      source={{ uri: appLogoUri }}
      style={[
        imageRoundedCorner && styles.roundedImage,
        { width: imageWidth, height: imageHeight },
      ]}
    />
  );
};

export const AppLogo = React.memo(AppLogoComponent);
