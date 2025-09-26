import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import GradientButton from '../../src/components/GradientButton';
import { L2_GRADIENT_COLORS } from '../../src/constants';

const onPressMock = jest.fn();
describe('GradientButton', () => {
  it('renders correctly', () => {
    const tree = render(
      <GradientButton
        label="Press Me"
        onPress={onPressMock}
        colors={L2_GRADIENT_COLORS}
        variant="secondary"
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});
