import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from "./slices/authSlice";
import { userReducer } from './slices/userSlice';
import { userReferrals } from './slices/userReferrals';
import { hospitalReducer } from './slices/hospitalSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        referral: userReferrals,
        hospital: hospitalReducer,
    }
})
