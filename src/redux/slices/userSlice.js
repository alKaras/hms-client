import axios from '../../utils/axios';
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
    users: [],
    currentPage: 1,
    totalPages: 1,
    isLoading: 'loading',
    error: null,
}

export const createUser = createAsyncThunk('user/create', async(params, {rejectWithValue}) => {
    try {
        const {data} = await axios.post('/user/create', params);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const getUsers = createAsyncThunk('user/fetch', async({page = 1, perPage = 10}) => {
    const {data} = await axios.get('/user/fetch', {
        params: {page, per_page: perPage}
    });
    return data;
})

export const getUser = createAsyncThunk('user/fetchById', async(_id, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`/user/fetch/${_id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createUser.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(createUser.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.user = action.payload.data
        })
        .addCase(createUser.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        .addCase(getUsers.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.users = action.payload.data
            state.currentPage = action.payload.meta.current_page
            state.totalPages = action.payload.meta.last_page
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
        
        .addCase(getUser.pending, (state) => {
            state.isLoading = 'loading'
            state.error = null
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.isLoading = 'loaded'
            state.error = null
            state.user = action.payload.data
        })
        .addCase(getUser.rejected, (state, action) => {
            state.isLoading = 'error'
            state.error = action.payload.message
        })
    }
})

export const selectUsers = (state) => (state.user.users);
export const selectUser = (state) => (state.user.user);
export const selectStatus = (state) => (state.user.isLoading);

export const userReducer = userSlice.reducer;