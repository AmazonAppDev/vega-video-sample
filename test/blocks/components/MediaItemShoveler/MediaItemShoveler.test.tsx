// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { MediaItemShoveler } from '../../../../src/blocks/components/MediaItemShoveler';
import { MediaItem } from '../../../../src/blocks/types';

const PLAYLIST_NAME = 'PLAYLIST_NAME';
const VIDEO_ITEMS: MediaItem[] = [
  {
    id: 'id1',
    title: 'TITLE1',
    description: 'DESCRIPTION1',
    mediaSourceType: 'url',
    mediaType: 'video',
  },
  {
    id: 'id2',
    title: 'TITLE2',
    description: 'DESCRIPTION2',
    mediaSourceType: 'url',
    mediaType: 'video',
  },
];

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('<MediaItemShoveler />', () => {
  it('renders default nonFeatured MediaItemShoveler with playlistName', () => {
    render(
      <MediaItemShoveler
        items={VIDEO_ITEMS}
        featured={false}
        showPlaylistName={true}
        playlistName={PLAYLIST_NAME}
      />,
    );
    expect(screen).toMatchSnapshot();
  });

  it('renders default featured MediaItemShoveler with no playlistName', () => {
    render(
      <MediaItemShoveler
        items={VIDEO_ITEMS}
        featured={true}
        showPlaylistName={false}
        playlistName={PLAYLIST_NAME}
      />,
    );
    expect(screen).toMatchSnapshot();
  });
});
