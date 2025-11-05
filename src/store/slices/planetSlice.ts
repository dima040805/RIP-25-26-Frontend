import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Planet } from '../../modules/PlanetsTypes'
import { api } from '../../api'

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

export const fetchPlanets = createAsyncThunk(
  'planets/fetchPlanets',
  async (searchName: string | undefined, { rejectWithValue }) => {
    try {
      const response = await api.planets.planetsList({ 
        planet_name: searchName 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки планет');
    }
  }
);

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
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanets.fulfilled, (state, action) => {
        state.loading = false;
        state.planets = action.payload as Planet[]; 
     })
      .addCase(fetchPlanets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
})

export const { setPlanets, setLoading, setError, clearError } = planetsSlice.actions
export default planetsSlice.reducer