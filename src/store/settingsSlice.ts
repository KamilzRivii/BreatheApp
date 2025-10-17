import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: 'pl' | 'en';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const initialState: SettingsState = {
  language: 'pl',
  soundEnabled: true,
  vibrationEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'pl' | 'en'>) => {
      state.language = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleVibration: (state) => {
      state.vibrationEnabled = !state.vibrationEnabled;
    },
  },
});

export const { setLanguage, toggleSound, toggleVibration } = settingsSlice.actions;
export default settingsSlice.reducer;