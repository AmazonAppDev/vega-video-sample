// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Filtering criteria for the results from the DataProvider.
 * As of today it only contains a `searchKeyword` filtering criteria
 */
export interface DataProviderFilteringCriteria {
  /**
   * String that the result should contain to remain in the output
   */
  searchKeyword: string;
}
