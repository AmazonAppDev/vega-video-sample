import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface RentListItem {
  videoID: string;
  rentedOn: string;
}

export interface VideoDetailState {
  purchasedList: Array<string>;
  watchList: Array<string>;
  rentList: Array<RentListItem>;
}

const initialState: VideoDetailState = {
  purchasedList: [],
  watchList: [],
  rentList: [],
};

export const videoDetailSlice = createSlice({
  name: 'videoDetail',
  initialState,
  reducers: {
    addToWatchList: (state, action: PayloadAction<string>) => {
      state.watchList = [...state.watchList, action.payload];
    },
    removeFromWatchList: (state, action: PayloadAction<string>) => {
      state.watchList?.splice(state.watchList.indexOf(action.payload), 1);
    },
    addToPurchaseList: (state, action: PayloadAction<string>) => {
      state.purchasedList = [...state.purchasedList, action.payload];
    },
    removeFromPurchaseList: (state, action: PayloadAction<string>) => {
      state.purchasedList?.splice(
        state.purchasedList.indexOf(action.payload),
        1,
      );
    },
    addToRentList: (state, action: PayloadAction<RentListItem>) => {
      state.rentList = [...state.rentList, action.payload];
    },
    removeFromRentList: (state, action: PayloadAction<string>) => {
      state.rentList = state.rentList.filter(
        (rentListItem) => rentListItem.videoID !== action.payload,
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToWatchList,
  removeFromWatchList,
  addToPurchaseList,
  removeFromPurchaseList,
  addToRentList,
  removeFromRentList,
} = videoDetailSlice.actions;

export const videoDetailSelectors = {
  watchList: (state: RootState) => state.videoDetail.watchList,
  purchasedList: (state: RootState) => state.videoDetail.purchasedList,
  rentList: (state: RootState) => state.videoDetail.rentList,
};

export default videoDetailSlice.reducer;
