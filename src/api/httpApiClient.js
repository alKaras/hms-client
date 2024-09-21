import axios from '../utils/axios';

//-- User API Route controllers
export const createUser = async (params) => {
    return await axios.post('/user/create', params);
}

export const editUser = async(_id, params) => {
    return await axios.put(`/user/edit/${_id}`, params)
}

export const getUsers = async () => {
    return await axios.get('/user/fetch');
}

export const getUser = async (_id) => {
    return await axios.get(`/user/fetch/${_id}`);
}

export const resendVerification = async (userEmail) => {
    return await axios.post('/auth/email-resend-verification', { email: userEmail })
}

export const fetchRoles = async () => {
    return await axios.get('/roles/search');
}

export const attachRole = async (_id, role) => {
    return await axios.post(`/user/attach-role/${_id}`, { role: role })
}

export const detachRole = async (_id, role) => {
    return await axios.post(`/user/detach-role/${_id}`, { role: role })
}

//-- User Referrals route controllers
export const fetchUserReferrals = async () => {
    return await axios.get(`userreferral/fetch`);
}

export const fetchFirstThreeReferrals = async () => {
    return await axios.get('userreferral/fetch', {params: {limit: 3}})
}

export const fetchReferralById = async(referral_id) => {
    return await axios.get(`userreferral/fetch/${referral_id}`);
}

export const createReferralForUser = async(params) => {
    return await axios.post(`userreferral/create`, params);
}

//-- Hospital route controllers
export const fetchHospitals = async () => {
    return await axios.get(`hospital/fetch`);
}

export const fetchHospital = async (id) => {
    return await axios.get(`hospital/fetch/${id}`);
}

export const createHospital = async(params) => {
    return await axios.post(`hospital/create`, params);
}

export const editHospital = async (_id, params) => {
    return await axios.put(`hospital/edit/${_id}`, params)
}

export const fetchHospitalDepartments = async (id) => {
    return await axios.get(`hospital/fetch/${id}/departments`);
}

export const fetchHospitalDoctors = async (params) => {
    return await axios.post('hospital/fetch/doctors', params)
}

//-- Service route controller


