import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import RadioButton from '../../src/components/RadioButton';

import { areComponentPropsEqual } from '../../src/utils/lodashHelper';

describe('RadioButton renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(
      <RadioButton
        label={''}
        onSelect={jest.fn()}
        testID={'radio-button-1'}
        selected={true}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('React.memo behavior for RadioButton', () => {
  const mockOnSelect = jest.fn();
  const firstRadiolabel = 'radio-button-1';
  const secondRadiolabel = 'radio-button-2';

  it('does not re-render when same radioButton is selected', () => {
    const numberOfTimesRadioButtonRendered = 1;

    const { rerender } = render(
      <RadioButton
        label={firstRadiolabel}
        onSelect={mockOnSelect}
        testID={firstRadiolabel}
        selected={true}
      />,
    );
    rerender(
      <RadioButton
        label={firstRadiolabel}
        onSelect={mockOnSelect}
        testID={firstRadiolabel}
        selected={true}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(true, true);
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(
      numberOfTimesRadioButtonRendered,
    );
  });

  it('re-renders when other radioButton is selected', () => {
    const { rerender } = render(
      <RadioButton
        label={firstRadiolabel}
        onSelect={mockOnSelect}
        testID={firstRadiolabel}
        selected={true}
      />,
    );
    rerender(
      <RadioButton
        label={secondRadiolabel}
        onSelect={mockOnSelect}
        testID={secondRadiolabel}
        selected={false}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(true, false);
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
