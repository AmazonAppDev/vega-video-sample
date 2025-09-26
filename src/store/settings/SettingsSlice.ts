import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { OptionType } from '../../components/RadioPicker';
import { LoginStatus } from '../../constants';

export let CountryCode: string | null = null;
export interface SettingsState {
  countryCode: OptionType | null;
  loginStatus: boolean;
}

const initialState: SettingsState = {
  countryCode: null,
  loginStatus: LoginStatus.SIGNED_IN, // Dummy login status, not real services connections
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCountryCode: (state, action: PayloadAction<OptionType>) => {
      if (action.payload && action.payload.code) {
        state.countryCode = action.payload;
        CountryCode = action.payload.code;
      }
    },
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.loginStatus = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCountryCode, setLoginStatus } = settingsSlice.actions;

export const settingsSelectors = {
  countryCode: (state: RootState) => state?.settings?.countryCode,
  loginStatus: (state: RootState) => state?.settings?.loginStatus,
};

export default settingsSlice.reducer;
