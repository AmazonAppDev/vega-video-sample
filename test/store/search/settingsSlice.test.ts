import { configureStore } from '@reduxjs/toolkit';
import { OptionType } from '../../../src/components/RadioPicker';
import SettingsSlice, {
  setCountryCode,
  setLoginStatus,
} from '../../../src/store/settings/SettingsSlice';

const localeOptions: OptionType[] = [
  { label: 'Option 1', value: '1', code: 'A' },
  { label: 'Option 2', value: '2', code: 'B' },
  { label: 'Option 3', value: '3', code: 'C' },
];

describe('settingsSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        settings: SettingsSlice,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState().settings;
    expect(state.countryCode).toBe(null);
    expect(state.loginStatus).toBe(true);
  });

  it('should handle setCountryCode', () => {
    store.dispatch(setCountryCode(localeOptions[0]));
    const state = store.getState().settings;
    expect(state.countryCode).toEqual(localeOptions[0]);
  });

  it('should handle setLoginStatus', () => {
    store.dispatch(setLoginStatus(false));
    const state = store.getState().settings;
    expect(state.loginStatus).toBe(false);
  });
});
