import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  searchName: string
  searchHistory: string[]
}

const initialState: SearchState = {
  searchName: '',
  searchHistory: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchName: (state, action: PayloadAction<string>) => {
      state.searchName = action.payload
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      if (action.payload && !state.searchHistory.includes(action.payload)) {
        state.searchHistory.push(action.payload)
      }
    },
    clearSearch: (state) => {
      state.searchName = ''
    }
  }
})

export const { setSearchName, addToHistory, clearSearch } = searchSlice.actions
export default searchSlice.reducer