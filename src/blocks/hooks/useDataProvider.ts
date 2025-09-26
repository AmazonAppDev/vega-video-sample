// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useCallback, useEffect, useState } from 'react';
import {
  DataProvider,
  DataProviderFilteringCriteria,
  DataProviderInput,
  DataProviderState,
  INITIAL_STATE,
  KeplerBlocksError,
  MediaItem,
  MediaItemListDataProviderState,
  MediaPlaylist,
  PlaylistListDataProviderState,
} from '../types';

const MAXIMUM_RETRIES = 2;

export function useGetContentDataProvider(dataProvider: DataProvider) {
  return useDataProvider(dataProvider, {
    type: 'getContent',
  }) as PlaylistListDataProviderState;
}

export function useGetContentByCriteriaDataProvider(
  dataProvider: DataProvider,
  searchCriteria: DataProviderFilteringCriteria,
) {
  return useDataProvider(dataProvider, {
    type: 'search_by_criteria',
    searchCriteria,
  }) as PlaylistListDataProviderState;
}

export function useGetRelatedContentDataProvider(
  dataProvider: DataProvider,
  mediaItem: MediaItem,
  category?: string,
) {
  return useDataProvider(dataProvider, {
    type: 'get_related_content',
    mediaItem,
    playlistName: category,
  }) as MediaItemListDataProviderState;
}

function useDataProvider(
  dataProvider: DataProvider,
  dataProviderInput: DataProviderInput,
) {
  const [dataProviderState, setDataProviderState] =
    useState<DataProviderState>(INITIAL_STATE);

  const getDataProviderData = () => {
    switch (dataProviderInput.type) {
      case 'search_by_criteria':
        return dataProvider.getContentByCriteria(
          dataProviderInput.searchCriteria,
        );
      case 'get_related_content':
        return dataProvider.getRelatedContent(
          dataProviderInput.mediaItem,
          dataProviderInput.playlistName,
        );
      default:
        return dataProvider.getContent();
    }
  };

  const getDataProviderDataWithAutoRetry = useCallback(() => {
    let retries = 0;
    const fetchData = () => {
      getDataProviderData()
        .then((dataProviderData: MediaPlaylist[] | MediaItem[]) => {
          const hasDataToDisplay =
            dataProviderData && dataProviderData.length > 0;
          setDataProviderState({
            ...INITIAL_STATE,
            dataStatus: hasDataToDisplay ? 'LOADED' : 'NO_DATA',
            data: dataProviderData,
          });
        })
        .catch((e: any) => {
          if (retries < MAXIMUM_RETRIES) {
            retries++;
            fetchData();
          } else {
            setDataProviderState({
              ...INITIAL_STATE,
              dataStatus: 'ERROR',
              error:
                e instanceof KeplerBlocksError
                  ? e
                  : new KeplerBlocksError(
                      'RUNTIME',
                      'There was an unexpected error. Please try again later.',
                      e,
                    ),
            });
          }
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDataProviderState({ ...INITIAL_STATE, dataStatus: 'LOADING' });
    getDataProviderDataWithAutoRetry();
    setDataProviderState((previous) => ({
      ...previous,
      retry: getDataProviderDataWithAutoRetry,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ...dataProviderState, retry: getDataProviderDataWithAutoRetry };
}
