// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TitleData } from '../../types/TitleData';
import { areComponentPropsEqual } from '../../utils/lodashHelper';
import Header from './Header';
import Preview from './Preview';

interface MiniDetailsProps {
  selectedTitle?: TitleData;
}

const MiniDetails = ({ selectedTitle }: MiniDetailsProps) => {
  return (
    <View style={styles.container}>
      <Preview posterUrl={selectedTitle?.thumbnail} />
      <Header data={selectedTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
});

const areMiniDetailsPropsEqual = (
  prevProps: MiniDetailsProps,
  nextProps: MiniDetailsProps,
) => {
  return areComponentPropsEqual(
    prevProps.selectedTitle,
    nextProps.selectedTitle,
  );
};

export default React.memo(MiniDetails, areMiniDetailsPropsEqual);
