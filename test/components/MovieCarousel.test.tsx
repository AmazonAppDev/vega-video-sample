import { render } from '@testing-library/react-native';
import React from 'react';
import MovieCarousel from '../../src/components/MovieCarousel';
import { TitleData } from '../../src/types/TitleData';

describe('MovieCarousel', () => {
  const mockData: TitleData[] = [
    {
      id: '1',
      title: 'Movie 1',
      uri: 'https://example.com/video1.mp4',
      categories: ['Action'],
      channelID: 'channel1',
      posterUrl: 'https://example.com/poster1.jpg',
      description: 'An action-packed thriller',
      duration: 120,
      rating: '4.5',
      releaseDate: '2024-01-01',
      mediaType: 'video',
      mediaSourceType: 'url',
      rentAmount: '',
      secure: false,
      uhd: false,
      format: '',
      thumbnail: 'https://example.com/thumbnail1.jpg',
    },
    {
      id: '2',
      title: 'Movie 2',
      uri: 'https://example.com/video2.mp4',
      categories: ['Comedy'],
      channelID: 'channel2',
      posterUrl: 'https://example.com/poster2.jpg',
      description: 'A hilarious comedy',
      duration: 90,
      rating: '4.7',
      releaseDate: '2023-05-10',
      mediaType: 'video',
      mediaSourceType: 'url',
      rentAmount: '',
      secure: false,
      uhd: false,
      format: '',
      thumbnail: 'https://example.com/thumbnail2.jpg',
    },
  ];

  it('renders the MovieCarousel', () => {
    const { getByTestId } = render(
      <MovieCarousel
        heading="Featured Movies"
        data={mockData}
        cardDimensions={{ width: 100, height: 150 }}
        testID="carousel-container"
      />,
    );

    const carousel = getByTestId('carousel-container');
    expect(carousel).toBeTruthy();
  });

  it('renders the correct number of tiles', () => {
    const { getByTestId } = render(
      <MovieCarousel
        heading="Featured Movies"
        data={mockData}
        cardDimensions={{ width: 100, height: 150 }}
        testID="carousel-container-2"
      />,
    );

    const carousel = getByTestId('carousel-container-2');
    expect(carousel.props.data.length).toBe(2); // We expect 2 items based on mockData
  });
});
