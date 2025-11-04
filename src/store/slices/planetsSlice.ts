import { createSlice } from '@reduxjs/toolkit'
import type { Planet } from '../../modules/PlanetsTypes'

interface PlanetsState {
  planets: Planet[]
  loading: boolean
  error: string | null
}

const initialState: PlanetsState = {
  planets: [],
  loading: false,
  error: null
}

const planetsSlice = createSlice({
  name: 'planets',
  initialState,
  reducers: {
    setPlanets: (state, action) => {
      state.planets = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setPlanets, setLoading, setError } = planetsSlice.actions
export default planetsSlice.reducer