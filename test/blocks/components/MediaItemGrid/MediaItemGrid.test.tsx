// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { MediaItemGrid } from '../../../../src/blocks/components/MediaItemGrid';
import { MediaItem } from '../../../../src/blocks/types';

const MOCK_PLAYLIST_NAME = 'PLAYLIST_NAME';
const MOCK_VIDEO_ITEMS: MediaItem[] = [
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

describe('<MediaItemGrid />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <MediaItemGrid
        playlistName={MOCK_PLAYLIST_NAME}
        items={MOCK_VIDEO_ITEMS}
        showPlaylistName={true}
        mediaItemTileColumnNumber={4}
      />,
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with no video items', () => {
    const tree = renderer.create(
      <MediaItemGrid
        playlistName={MOCK_PLAYLIST_NAME}
        items={[]}
        mediaItemTileColumnNumber={4}
      />,
    );
    expect(tree).toMatchSnapshot();
    expect(tree.root.findAllByType(Text)).toHaveLength(0);
  });

  it('renders correctly with no playlist name', () => {
    const tree = renderer.create(
      <MediaItemGrid
        playlistName={''}
        items={MOCK_VIDEO_ITEMS}
        mediaItemTileColumnNumber={4}
      />,
    );
    expect(tree).toMatchSnapshot();
    expect(tree.root.findAllByType(Text)).toHaveLength(0);
  });
});
