import { configureStore } from '@reduxjs/toolkit'
import planetsReducer from './slices/planetSlice'
import searchReducer from './slices/searchSlice'
import userReducer from './slices/userSlice'; // Добавляем
import researchReducer from './slices/researchSlice'; // Добавляем

export const store = configureStore({
  reducer: {
    planets: planetsReducer,
    search: searchReducer,
    user: userReducer, 
    research: researchReducer, // Добавляем
  },
  devTools: true // Для Redux DevTools
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch