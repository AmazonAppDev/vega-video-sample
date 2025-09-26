import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import focusSlice from './focus/focusSlice';
import searchSlice from './search/searchSlice';
import settingsReducer, { SettingsState } from './settings/SettingsSlice';
import videoDetailReducer, {
  VideoDetailState,
} from './videoDetail/videoDetailSlice';

interface Store {
  videoDetail: VideoDetailState;
  settings: SettingsState;
}

const loadState = async () => {
  try {
    const serializedState = await AsyncStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};

const saveState = async (state: Store) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export let store: any;

export const initializeStore = async () => {
  const preloadedState = await loadState();
  store = configureStore({
    reducer: {
      //@ts-ignore
      videoDetail: videoDetailReducer,
      settings: settingsReducer,
      search: searchSlice,
      focus: focusSlice,
    },
    preloadedState,
  });

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
