
import axios from '../../utils/axios';
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    roles: null,
    isLoading: 'loading',
    error: null,
    isRegistered: false,
    isUnAuthorized: false
}

export const loginUser = createAsyncThunk('auth/loginUser', async (params, {_, rejectWithValue}) => {
    try {
        const {data} = await axios.post('/auth/login', params);
        console.log(data);

        if (data.access_token){
            window.localStorage.setItem("token", data.access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        }
        return data;
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue}) => {
    try {
        const {data} = await axios.get('/user/me');
        return data;
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

export const registerUser = createAsyncThunk('auth/registerUser', async (params, { rejectWithValue }) => {
    try {
        const {data} = await axios.post('/auth/register', params);
        return data;
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.error = null
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = 'loading'
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = 'loaded'
                state.user = action.payload.user
                state.error = null
                state.isRegistered = true
                state.isUnAuthorized = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = 'error'
                state.error = action.payload.message
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = 'loading'
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = 'loaded'
                state.user = action.payload.user
                state.token = action.payload.access_token
                state.roles = action.payload.roles
                state.error = null
                state.isUnAuthorized = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = 'error'
                state.error = action.payload.message
            })
            .addCase(getMe.pending, (state) => {
                state.isLoading = 'loading'
                state.error = null
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = 'loaded'
                state.user = action.payload?.user
                state.token = localStorage.getItem('token')
                state.error = null
                state.isUnAuthorized = false;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = 'error'
                state.error = action.payload.message
                state.isUnAuthorized = action.payload.message === 'Token not provided' ? false : true;
            })
    }
})

export const selectIsRegged = (state) => (state.auth.isRegistered);
export const selectIsLogged = (state) => Boolean(state.auth.token);
export const selectIsUnauthorized = (state) => (state.auth.isUnAuthorized); 
export const infoAboutUser = (state) => (state.auth.user);
export const selectStatus = (state) => (state.auth.isLoading);
export const selectRoles = (state) => (state.auth.roles);

export const {logout} = authSlice.actions;
export const authReducer = authSlice.reducer;

