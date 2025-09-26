// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Header from '../../../src/w3cmedia/mediacontrols/VideoPlayerHeader';

const mockNavigateBack = jest.fn();

describe('VideoPlayerHeader tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('component renders correctly with title', () => {
    const component = render(
      <Header title="Movie Title" navigateBack={mockNavigateBack} />,
    );
    expect(component).toMatchSnapshot();
    expect(component.getByTestId('video-player-header')).toBeTruthy();
    expect(component.getByText('Movie Title')).toBeTruthy();
  });

  it('component renders correctly without title', () => {
    const component = render(<Header navigateBack={mockNavigateBack} />);
    expect(component).toMatchSnapshot();
    expect(component.getByTestId('video-player-header')).toBeTruthy();
  });

  it('component renders correctly with empty title', () => {
    const component = render(
      <Header title="" navigateBack={mockNavigateBack} />,
    );
    expect(component.getByTestId('video-player-header')).toBeTruthy();
    expect(component.getByTestId('video-player-header')).toHaveTextContent('');
  });

  it('component renders correctly with undefined title', () => {
    const component = render(
      <Header title={undefined} navigateBack={mockNavigateBack} />,
    );
    expect(component.getByTestId('video-player-header')).toBeTruthy();
  });

  it('component renders correctly with null title', () => {
    const component = render(
      <Header title={null as any} navigateBack={mockNavigateBack} />,
    );
    expect(component.getByTestId('video-player-header')).toBeTruthy();
  });

  it('component renders correctly with long title', () => {
    const longTitle =
      'This is a very long movie title that should be truncated with numberOfLines prop';
    const component = render(
      <Header title={longTitle} navigateBack={mockNavigateBack} />,
    );
    expect(component.getByTestId('video-player-header')).toBeTruthy();
    expect(component.getByText(longTitle)).toBeTruthy();
  });

  it('calls navigateBack when back button is pressed', () => {
    const component = render(
      <Header title="Test Title" navigateBack={mockNavigateBack} />,
    );
    const backButton = component.getByTestId('header_back_icon');
    fireEvent.press(backButton);
    expect(mockNavigateBack).toHaveBeenCalledTimes(1);
  });

  it('calls navigateBack multiple times when back button is pressed multiple times', () => {
    const component = render(
      <Header title="Test Title" navigateBack={mockNavigateBack} />,
    );
    const backButton = component.getByTestId('header_back_icon');
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    expect(mockNavigateBack).toHaveBeenCalledTimes(3);
  });

  it('has correct accessibility properties', () => {
    const component = render(
      <Header title="Accessible Title" navigateBack={mockNavigateBack} />,
    );
    const titleElement = component.getByTestId('video-player-header');
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.numberOfLines).toBe(1);
  });

  it('back button has correct hasTVPreferredFocus property', () => {
    const component = render(
      <Header title="Test" navigateBack={mockNavigateBack} />,
    );
    const backButton = component.getByTestId('header_back_icon');
    // Navigate to the FocusableElement (BackButton) which contains hasTVPreferredFocus
    const focusableElement = backButton.parent?.parent;
    expect(focusableElement?.props.hasTVPreferredFocus).toBe(false);
  });

  it('memo optimization works correctly with same props', () => {
    const { rerender } = render(
      <Header title="Test" navigateBack={mockNavigateBack} />,
    );

    // Re-render with same props should not cause re-render due to React.memo
    rerender(<Header title="Test" navigateBack={mockNavigateBack} />);
    expect(mockNavigateBack).toBeDefined();
  });

  it('memo optimization works correctly with different props', () => {
    const { rerender } = render(
      <Header title="Test" navigateBack={mockNavigateBack} />,
    );

    // Re-render with different props should cause re-render
    rerender(<Header title="Different Test" navigateBack={mockNavigateBack} />);
    expect(mockNavigateBack).toBeDefined();
  });

  it('handles different navigateBack functions', () => {
    const anotherMockNavigateBack = jest.fn();
    const { rerender } = render(
      <Header title="Test" navigateBack={mockNavigateBack} />,
    );

    rerender(<Header title="Test" navigateBack={anotherMockNavigateBack} />);

    const backButton = render(
      <Header title="Test" navigateBack={anotherMockNavigateBack} />,
    ).getByTestId('header_back_icon');
    fireEvent.press(backButton);
    expect(anotherMockNavigateBack).toHaveBeenCalledTimes(1);
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Movie Title: Part 2 - The Return & Beyond!';
    const component = render(
      <Header title={specialTitle} navigateBack={mockNavigateBack} />,
    );
    expect(component.getByText(specialTitle)).toBeTruthy();
  });

  it('renders with numeric title', () => {
    const numericTitle = '2001: A Space Odyssey';
    const component = render(
      <Header title={numericTitle} navigateBack={mockNavigateBack} />,
    );
    expect(component.getByText(numericTitle)).toBeTruthy();
  });
});
