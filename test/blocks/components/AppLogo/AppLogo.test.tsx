// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { AppLogo } from '../../../../src/blocks/components/AppLogo';

const MOCK_URI = 'app logo';

describe('<AppLogo />', () => {
  it('renders appLogo correctly', () => {
    render(
      <AppLogo appLogoUri={MOCK_URI} imageHeight={100} imageWidth={100} />,
    );
    expect(screen).toMatchSnapshot();
  });
});
