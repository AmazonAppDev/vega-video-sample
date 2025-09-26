// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NavBarProps } from '../../components/NavBar';

export interface SearchPageScreenProps {
  /** Property that, in case of being true, applies a scrim to the background to make it easier to read the text displayed. */
  backgroundColorOverlay?: boolean;
  /** URL for the background image source */
  backgroundImageUri?: string;
  /** Color for the screen background in hexadecimal */
  backgroundColor?: string;
  /** Attribute containing navigation bar configuration */
  navBarConfig?: NavBarProps;
  /** Action that will run when the user submits the search. Typically, it will be navigating to the SearchResultScreen kepler block. */
  onSubmit: (searchKeyword: string) => void;
}
