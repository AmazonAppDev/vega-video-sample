import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import { render } from '@testing-library/react-native';
import React from 'react';
import { CaptionOptions } from '../../../src/w3cmedia/mediacontrols/CaptionOptions';
import { CaptionOptionProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

const mockEnableCaption = jest.fn();

import { areComponentPropsEqual } from '../../../src/utils/lodashHelper';

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: 0,
    },
  } as unknown as VideoPlayer,
};

const renderCaptionOptions = (props?: Partial<CaptionOptionProps>) => {
  return (
    <CaptionOptions
      video={videoRef.current as unknown as VideoPlayer}
      enableCaption={mockEnableCaption}
      selectedCaptionId={null}
      {...props}
    />
  );
};
describe('CaptionOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with props', () => {
    const tree = render(
      renderCaptionOptions({
        video: {
          ...videoRef.current,
          textTracks: {
            length: 0,
            getTrackById: jest.fn((id: number) => {
              if (id > 0) {
                return {
                  label: '',
                  id: '',
                };
              }
            }),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          },
        } as unknown as VideoPlayer,
        selectedCaptionId: '0',
      }),
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders without props', () => {
    const tree = render(renderCaptionOptions());
    expect(tree).toMatchSnapshot();
  });
  it('renders without crashing when there are no text tracks', () => {
    const { queryByTestId } = render(renderCaptionOptions());
    expect(queryByTestId('caption-menu-item')).toBeNull();
  });
  it('with props', () => {
    const { queryByTestId } = render(
      renderCaptionOptions({
        video: {
          ...videoRef.current,
          textTracks: {
            length: 0,
            getTrackById: jest.fn((id: number) => {
              if (id > 0) {
                return {
                  label: '',
                  id: '',
                };
              }
            }),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          },
        } as unknown as VideoPlayer,
      }),
    );
    expect(queryByTestId('caption-menu-item')).toBeNull();
  });
});

describe('CaptionOptions with React.memo', () => {
  const EnglishCaptionID = '1';
  const FrenchCaptionId = '2';
  const excludedProps = ['enableCaption'];
  it('does not re-render when same CaptionID is unchanged', () => {
    const { rerender } = render(
      <CaptionOptions
        video={videoRef.current as unknown as VideoPlayer}
        enableCaption={mockEnableCaption}
        selectedCaptionId={EnglishCaptionID}
      />,
    );
    rerender(
      <CaptionOptions
        video={videoRef.current as unknown as VideoPlayer}
        enableCaption={mockEnableCaption}
        selectedCaptionId={EnglishCaptionID}
      />,
    );

    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        video: videoRef.current,
        selectedCaptionId: EnglishCaptionID,
        enableCaption: mockEnableCaption,
      },
      {
        video: videoRef.current,
        selectedCaptionId: EnglishCaptionID,
        enableCaption: mockEnableCaption,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(1);
  });

  it('re-render when CaptionID is changed', () => {
    const { rerender } = render(
      <CaptionOptions
        video={videoRef.current as unknown as VideoPlayer}
        enableCaption={mockEnableCaption}
        selectedCaptionId={EnglishCaptionID}
      />,
    );
    rerender(
      <CaptionOptions
        video={videoRef.current as unknown as VideoPlayer}
        enableCaption={mockEnableCaption}
        selectedCaptionId={FrenchCaptionId}
      />,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledWith(
      {
        video: videoRef.current,
        selectedCaptionId: EnglishCaptionID,
        enableCaption: mockEnableCaption,
      },
      {
        video: videoRef.current,
        selectedCaptionId: FrenchCaptionId,
        enableCaption: mockEnableCaption,
      },
      excludedProps,
    );
    expect(areComponentPropsEqual).toHaveBeenCalledTimes(2);
  });
});
