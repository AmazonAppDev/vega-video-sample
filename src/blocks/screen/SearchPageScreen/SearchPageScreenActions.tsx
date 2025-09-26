// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Actions the SearchPageScreen exposes for allowing to control the TextInput inside.
 */
export interface SearchPageScreenActions {
  /** Focuses TextInput from SearchPageScreen.
   * It will allow developers to focus the TextInput on demand and not only in the predefined cases. */
  requestSearchInputFocus: () => void;
  /** Releases focus of TextInput from SearchPageScreen.
   * It will allow developers to remove the focus from the TextInput on demand and not only in the
   * predefined cases.*/
  clearSearchInputFocus: () => void;
}
