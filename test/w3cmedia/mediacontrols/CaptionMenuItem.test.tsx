// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';
import React from 'react';
import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';
import { CaptionMenuItem } from '../../../src/w3cmedia/mediacontrols/CaptionMenuItem';
import { CaptionMenuItemProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

const onPressMock = jest.fn();

const renderCaptionButton = (props?: Partial<CaptionMenuItemProps>) => {
  return (
    <CaptionMenuItem text={'Some Text'} onPress={onPressMock} {...props} />
  );
};
describe('CaptionMenuItem tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with select', () => {
    const component = render(renderCaptionButton({ selected: true }));
    expect(component).toMatchSnapshot();
  });
});

describe('React.memo behavior for CaptionMenuItem', () => {
  const excludedProps = ['onPress', 'testID'];
  it('does not re-render when caption menu is unchanged', () => {
    const { rerender } = render(
      <CaptionMenuItem
        text={'English'}
        onPress={onPressMock}
        selected={true}
      />,
    );
    rerender(
      <CaptionMenuItem
        text={'English'}
        onPress={onPressMock}
        selected={true}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      { text: 'English', selected: true, onPress: onPressMock },
      { text: 'English', selected: true, onPress: onPressMock },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });
  it('re-render when caption menu is unchanged', () => {
    const { rerender } = render(
      <CaptionMenuItem
        text={'English'}
        onPress={onPressMock}
        selected={true}
      />,
    );
    rerender(
      <CaptionMenuItem text={'French'} onPress={onPressMock} selected={true} />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      { text: 'English', selected: true, onPress: onPressMock },
      { text: 'French', selected: true, onPress: onPressMock },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
