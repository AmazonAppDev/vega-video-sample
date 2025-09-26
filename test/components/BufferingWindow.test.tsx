import LottieView from '@amazon-devices/lottie-react-native';
import { describe } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import BufferingWindow, { styles } from '../../src/components/BufferingWindow';

describe('BufferingWindow Test Cases', () => {
  it('renders correctly', () => {
    const tree = render(<BufferingWindow />);
    expect(tree).toMatchSnapshot();
  });

  it('View is present in component', async () => {
    const { queryByTestId } = render(<BufferingWindow />);
    const view = queryByTestId('buffering-view');
    expect(view).toBeDefined();
  });

  it('LottieView is present in component with correct props', async () => {
    const { UNSAFE_queryAllByType } = render(<BufferingWindow />);
    const lottieView = UNSAFE_queryAllByType(LottieView);
    expect(lottieView).toBeDefined();
    const lottieViewWithStyles = lottieView.find(
      (lottie) => lottie.props.style === styles.loader,
    );
    expect(lottieViewWithStyles).toBeTruthy();
    const lottieViewWithSource = lottieView.find(
      (lottie) =>
        lottie.props.source === require('../../src/js/resources/loader.json'),
    );
    expect(lottieViewWithSource).toBeTruthy();
    const lottieViewWithLoop = lottieView.find(
      (lottie) => lottie.props.loop === true,
    );
    expect(lottieViewWithLoop).toBeTruthy();
  });
});
