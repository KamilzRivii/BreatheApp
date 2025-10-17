import { createSlice } from '@reduxjs/toolkit';
import { Exercise } from '../types';

interface ExercisesState {
  exercises: Exercise[];
}

const initialState: ExercisesState = {
  exercises: [
    {
      id: '478',
      name: '4-7-8',
      description: 'Uspokojenie i sen',
      duration: '5 min',
      color: 'white',
      icon: '🌙',
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 8,
    },
    {
      id: 'box',
      name: 'Równe odstępy',
      description: 'Koncentracja i focus',
      duration: '10 min',
      color: 'white',
      icon: '🎯',
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 15,
    },
    {
      id: 'deep',
      name: 'Głębokie Oddechy',
      description: 'Relaks i odprężenie',
      duration: '7 min',
      color: 'white',
      icon: '🍃',
      inhale: 4,
      exhale: 8,
      cycles: 12,
    },
    {
      id: 'energy',
      name: 'Energia',
      description: 'Pobudzenie organizmu',
      duration: '3 min',
      color: 'white',
      icon: '⚡',
      inhale: 2,
      exhale: 2,
      cycles: 20,
    },
  ],
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {},
});

export default exercisesSlice.reducer;