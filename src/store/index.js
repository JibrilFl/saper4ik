import { configureStore } from '@reduxjs/toolkit';
import game from '../features/game/gameSlice';

export const store = configureStore({
  reducer: {
    game
  },
  devTools: process.env.NODE_ENV !== 'production'
});