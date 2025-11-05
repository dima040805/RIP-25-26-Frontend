import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface ResearchCart {
  id?: number;
  planets_count?: number;
  planets?: any[];
  status?: string;
  creator_login?: string;
  date_create?: string;
  date_research?: string;
}

interface ResearchPlanet {
  id: number;
  name: string;
  image: string;
  star_radius: number;
  planet_shine?: number;
  planet_radius?: number;
}

interface ResearchDetail {
  id: number;
  count: number;
  researchPlanets?: ResearchPlanet[];
  planets?: ResearchPlanet[];
  date_research?: string;
  [key: string]: any;
}

interface ResearchState {
  research_id?: number;
  planets_count: number;
  loading: boolean;
  researchCart: ResearchCart | null;
  error: string | null;
  researchDetail: ResearchDetail | null;
  saveLoading: {
    date: boolean;
    planets: { [key: number]: boolean };
  };
}

const initialState: ResearchState = {
  research_id: undefined,
  planets_count: 0,
  loading: false,
  researchCart: null,
  researchDetail: null,
  error: null,
  saveLoading: {
    date: false,
    planets: {}
  }
};

export const getResearchCart = createAsyncThunk(
  'research/getResearchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.research.researchCartList();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { planets_count: 0, planets: [] };
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки корзины');
    }
  }
);

export const addToResearch = createAsyncThunk(
  'research/addToResearch',
  async (planetId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.planet.addToResearchCreate(planetId);
      dispatch(getResearchCart());
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        dispatch(getResearchCart());
        return { message: 'already_added' };
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка добавления');
    }
  }
);

export const removeFromResearch = createAsyncThunk(
  'research/removeFromResearch',
  async ({ planetId, researchId }: { planetId: number; researchId: number }, { rejectWithValue }) => {
    try {
      const response = await api.planetsResearch.planetsResearchDelete(planetId, researchId);
      return { planetId, researchId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления');
    }
  }
);

export const getResearchDetail = createAsyncThunk(
  'research/getResearchDetail',
  async (researchId: number, { rejectWithValue }) => {
    try {
      const response = await api.research.researchDetail(researchId);
      const data = response.data;
      const normalizedData: ResearchDetail = {
        id: data.id,
        count: data.count || data.planets_count || 0,
        researchPlanets: data.researchPlanets || data.planets || [],
        date_research: data.date_research,
        ...data
      };
      return normalizedData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки исследования');
    }
  }
);

export const deleteResearch = createAsyncThunk(
  'research/deleteResearch',
  async (researchId: number, { rejectWithValue }) => {
    try {
      const response = await api.research.deleteResearchDelete(researchId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления исследования');
    }
  }
);

export const updateResearchDate = createAsyncThunk(
  'research/updateResearchDate',
  async ({ researchId, date }: { researchId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await api.research.changeResearchUpdate(researchId, {
        date_research: date
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления даты');
    }
  }
);

export const updatePlanetShine = createAsyncThunk(
  'research/updatePlanetShine',
  async ({ 
    planetId, 
    researchId, 
    shine 
  }: { 
    planetId: number; 
    researchId: number; 
    shine: number 
  }, { rejectWithValue }) => {
    try {
      const response = await api.planetsResearch.planetsResearchUpdate(
        planetId, 
        researchId, 
        { planet_shine: shine }
      );
      return { planetId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления блеска');
    }
  }
);

export const formResearch = createAsyncThunk(
  'research/formResearch',
  async (researchId: number, { rejectWithValue }) => {
    try {
      const response = await api.research.formUpdate(researchId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка подтверждения исследования');
    }
  }
);

const researchSlice = createSlice({
  name: 'research',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearResearch: (state) => {
      state.researchCart = null;
      state.planets_count = 0;
      state.research_id = undefined;
    },
    removePlanetOptimistic: (state, action) => {
      const planetId = action.payload;
      if (state.researchDetail) {
        const planets = state.researchDetail.researchPlanets || state.researchDetail.planets || [];
        const updatedPlanets = planets.filter(planet => planet.id !== planetId);
        
        if (state.researchDetail.researchPlanets) {
          state.researchDetail.researchPlanets = updatedPlanets;
        }
        if (state.researchDetail.planets) {
          state.researchDetail.planets = updatedPlanets;
        }
        state.researchDetail.count = updatedPlanets.length;
      }
    },
    revertPlanetRemoval: (state) => {
      // В реальном приложении здесь нужно восстановить предыдущее состояние
      // Для простоты просто перезагружаем данные
      if (state.researchDetail?.id) {
        // Можно добавить логику для восстановления состояния
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResearchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResearchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.researchCart = action.payload;
        state.planets_count = action.payload.planets_count || 0;
        state.research_id = action.payload.id;
      })
      .addCase(getResearchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.researchCart = null;
        state.planets_count = 0;
        state.research_id = undefined;
      })
      
      .addCase(getResearchDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.researchDetail = null;
      })
      .addCase(getResearchDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.researchDetail = action.payload;
      })
      .addCase(getResearchDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.researchDetail = null;
      })
      
      .addCase(deleteResearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResearch.fulfilled, (state) => {
        state.loading = false;
        state.researchDetail = null;
        state.researchCart = null;
        state.planets_count = 0;
        state.research_id = undefined;
      })
      .addCase(deleteResearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateResearchDate.pending, (state) => {
        state.saveLoading.date = true;
        state.error = null;
      })
      .addCase(updateResearchDate.fulfilled, (state, action) => {
        state.saveLoading.date = false;
        if (state.researchDetail) {
          state.researchDetail.date_research = action.meta.arg.date;
        }
      })
      .addCase(updateResearchDate.rejected, (state, action) => {
        state.saveLoading.date = false;
        state.error = action.payload as string;
      })
      
      // updatePlanetShine
      .addCase(updatePlanetShine.pending, (state, action) => {
        const { planetId } = action.meta.arg;
        state.saveLoading.planets[planetId] = true;
        state.error = null;
      })
      .addCase(updatePlanetShine.fulfilled, (state, action) => {
        const { planetId } = action.meta.arg;
        state.saveLoading.planets[planetId] = false;
        
        // Обновляем данные в researchDetail
        if (state.researchDetail) {
          const planets = state.researchDetail.researchPlanets || state.researchDetail.planets || [];
          const updatedPlanets = planets.map(planet => 
            planet.id === planetId 
              ? { ...planet, planet_shine: action.meta.arg.shine }
              : planet
          );
          
          if (state.researchDetail.researchPlanets) {
            state.researchDetail.researchPlanets = updatedPlanets;
          }
          if (state.researchDetail.planets) {
            state.researchDetail.planets = updatedPlanets;
          }
        }
      })
      .addCase(updatePlanetShine.rejected, (state, action) => {
        const { planetId } = action.meta.arg;
        state.saveLoading.planets[planetId] = false;
        state.error = action.payload as string;
      })
      
      // removeFromResearch
      .addCase(removeFromResearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromResearch.fulfilled, (state) => {
        state.loading = false;
        // Данные уже обновлены оптимистично через removePlanetOptimistic
      })
      .addCase(removeFromResearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // В случае ошибки перезагружаем актуальные данные
        if (state.researchDetail?.id) {
          // Можно добавить автоматическую перезагрузку или оставить как есть
        }
      })
      
      // formResearch
      .addCase(formResearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formResearch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(formResearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearResearch, removePlanetOptimistic, revertPlanetRemoval } = researchSlice.actions;
export default researchSlice.reducer;