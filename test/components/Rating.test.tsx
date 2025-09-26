import { FiveStarRating } from '@amazon-devices/kepler-ui-components';
import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import Rating from '../../src/components/Rating';

jest.mock('@amazon-devices/kepler-ui-components', () => {
  return {
    FiveStarRating: jest.fn(() => null),
  };
});

describe('Rating Component', () => {
  it('renders with provided rating and id', () => {
    render(<Rating id={200} rating={4.5} />);

    expect(FiveStarRating).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'md',
        ratingNumber: 4.5,
        ratingText: '(200)',
      }),
      {},
    );
  });

  it('applies styles correctly', () => {
    const { UNSAFE_getByType } = render(<Rating id={100} rating={3.5} />);
    const ratingContainer = UNSAFE_getByType(View);

    expect(ratingContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alignItems: 'center',
          textAlign: 'center',
          marginVertical: 5,
        }),
        expect.objectContaining({
          flexDirection: 'row',
        }),
      ]),
    );
  });
});
