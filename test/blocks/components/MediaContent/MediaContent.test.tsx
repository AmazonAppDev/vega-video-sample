// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { MediaContent } from '../../../../src/blocks/components/MediaContent';
import { MediaPlaylist } from '../../../../src/blocks/types';

const MOCK_PLAYLIST: MediaPlaylist[] = [
  {
    playlistName: 'TEST PLAYLIST',
    medias: [
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
    ],
  },
  {
    playlistName: 'TEST PLAYLIST 2',
    medias: [
      {
        id: 'id1',
        title: 'TITLE3',
        description: 'DESCRIPTION3',
        mediaSourceType: 'url',
        mediaType: 'video',
      },
      {
        id: 'id2',
        title: 'TITLE4',
        description: 'DESCRIPTION4',
        mediaSourceType: 'url',
        mediaType: 'video',
      },
    ],
  },
];

jest.mock('@amazon-devices/react-navigation__core', () => {
  return {
    useFocusEffect: jest.fn(),
  };
});

// Mock the MediaItemShovelerList component
jest.mock('../../../../src/blocks/components/MediaItemShovelerList', () => ({
  MediaItemShovelerList: ({ playlists }) => (
    <div data-testid="media-item-shoveler-list">
      {playlists.map((playlist) => (
        <div key={playlist.playlistName}>{playlist.playlistName}</div>
      ))}
    </div>
  ),
}));

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('<MediaContent />', () => {
  it('renders shoveler layout', () => {
    render(<MediaContent playlists={MOCK_PLAYLIST} layout={'shoveler'} />);
    expect(screen).toMatchSnapshot();
  });

  it('renders grid layout', () => {
    render(<MediaContent playlists={MOCK_PLAYLIST} layout={'grid'} />);
    expect(screen).toMatchSnapshot();
  });
});
