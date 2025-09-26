import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export let CountryCode: string | null = null;
export interface FocusState {
  currentFocusedScreen: string;
}

const initialState: FocusState = {
  currentFocusedScreen: '',
};

export const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    setCurrentFocus: (state, action: PayloadAction<FocusState>) => {
      state.currentFocusedScreen = action.payload.currentFocusedScreen;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentFocus } = focusSlice.actions;

export const focusSelectors = {
  getCurrentFocus: (state: RootState) => state.focus.currentFocusedScreen,
};

export default focusSlice.reducer;
