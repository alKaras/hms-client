import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    isLoading: 'loading',
    error: null,
    hospitals: [],
    specificHospital: null
}

export const fetchHospitals = createAsyncThunk('hospital/fetchAll', async() => {
    const {data} = await axios.get(`hospital/fetch`);
    return data;
})

export const fetchHospital = createAsyncThunk('hospital/fetchOne', async(id, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`hospital/fetch/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createHospital = createAsyncThunk('hospital/create', async(params, {rejectWithValue}) => {
    try {
        const {data} = await axios.post(`hospital/create`, params);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const destroyHospital = createAsyncThunk('hospital/destroy', async(id) => {
    const {data} = await axios.delete(`hospital/delete/${id}`);
    return data;
})

const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchHospitals.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(fetchHospitals.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.hospitals = action.payload.data
            state.error = null
        })
        .addCase(fetchHospitals.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        .addCase(fetchHospital.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(fetchHospital.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.specificHospital = action.payload.data
            state.error = null
        })
        .addCase(fetchHospital.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        .addCase(createHospital.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(createHospital.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.specificHospital = action.payload.data
            state.error = null
        })
        .addCase(createHospital.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        
        .addCase(destroyHospital.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(destroyHospital.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
        })
        .addCase(destroyHospital.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })

    }
})

export const hospitalReducer = hospitalSlice.reducer;

