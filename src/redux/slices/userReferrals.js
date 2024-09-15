import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    isLoading: 'loading',
    error: null,
    referral: null,
    userReferrals: [],
    firstThreeReferrals: [],
}

export const fetchUserReferrals = createAsyncThunk('referral/fetchByUser', async(_, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`userreferral/fetch`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchFirstThreeReferrals = createAsyncThunk('referral/fetchFirstThree', async() => {
        const {data} = await axios.get('userreferral/fetch', {params: {limit: 3}})
        return data;
})

export const fetchReferralById = createAsyncThunk('referral/fetchOne', async(referral_id, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`userreferral/fetch/${referral_id}`);
        console.log(data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createReferralForUser = createAsyncThunk('referral/create', async(params, {rejectWithValue}) => {
    try {
        const {data} = await axios.post(`userreferral/create`, params);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const userReferralsSlice = createSlice({
    name: 'referral',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserReferrals.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(fetchUserReferrals.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.userReferrals = action.payload.data
        })
        .addCase(fetchUserReferrals.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        .addCase(fetchReferralById.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(fetchReferralById.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.referral = action.payload.data
        })
        .addCase(fetchReferralById.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        .addCase(createReferralForUser.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(createReferralForUser.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.referral = action.payload.data
        })
        .addCase(createReferralForUser.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        .addCase(fetchFirstThreeReferrals.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(fetchFirstThreeReferrals.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.firstThreeReferrals = action.payload.data
        })
        .addCase(fetchFirstThreeReferrals.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload?.data
        })
    }
})

export const selectUserReferrals =(state) => (state.referral.userReferrals);
export const selectReferral = (state) => (state.referral.referral);

export const userReferrals = userReferralsSlice.reducer;