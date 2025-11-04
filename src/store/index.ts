import { configureStore } from '@reduxjs/toolkit'
import planetsReducer from './slices/planetSlice'
import searchReducer from './slices/searchSlice'

export const store = configureStore({
  reducer: {
    planets: planetsReducer,
    search: searchReducer,
  },
  devTools: true // Для Redux DevTools
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch