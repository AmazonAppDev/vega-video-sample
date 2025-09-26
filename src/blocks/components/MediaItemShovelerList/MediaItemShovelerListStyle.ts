// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';
import { WrapperLayout } from '../../constants/layouts';

export const createItemShovelerListStyle = (wrapperLayout?: WrapperLayout) => {
  return {
    style: StyleSheet.create({
      shovelerWrapper: {
        flex: 1,
        marginLeft: wrapperLayout === 'narrow' ? 140 : 90,
        marginTop: wrapperLayout === 'narrow' ? 30 : 180,
      },
    }),
  };
};
