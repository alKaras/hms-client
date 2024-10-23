import axios from '../utils/axios';

//-- User API Route controllers
export const createUser = async (params) => {
    return await axios.post('/user/create', params);
}

export const editUser = async(_id, params) => {
    return await axios.put(`/user/edit/${_id}`, params)
}

export const getUsers = async ({page = 1, perPage = 10}) => {
    return await axios.get(`/user/fetch`, {
        params: {page, per_page: perPage}
    });
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

export const fetchHospitalServices = async (params) => {
    return await axios.post('hospital/fetch/services', params);
}

//Departments route controller
export const fetchDepartments = async () => {
    return await axios.get('department/fetch');
}

export const fetchDepartment  = async(_id) => {
    return await axios.get(`department/fetch/${_id}`);
}

export const createDepartment = async(params) => {
    return await axios.post('department/create', params);
}

export const importDepartment = async (file) => {
    return await axios.post('department/import', file, {
        headers: {
            'Content-type': 'multipart/form-data',
        }
    });
}

export const editDepartment = async(_id, params) => {
    return await axios.put(`department/edit/${_id}`, params);
}

//Doctor route controller
export const fetchDoctorsCollection = async() => {
    return await axios.get('doctors/fetch');
}

export const fetchSingleDoctor = async(_id) => {
    return await axios.get(`doctors/fetch/${_id}`);
}

export const createDoctor = async (params) => {
    return await axios.post(`doctors/create`, params);
}

export const importDoctors = async(file) => {
    return await axios.post(`doctors/import`, file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

/**
 * Get DoctorList by service id method
 * @param {"service_id"} params 
 * @method POST
 * @returns 
 */
export const fetchDoctorByService = async(params) => {
    return await axios.post(`doctors/getbyservice`, params);
}

export const editDoctor = async(_id, params) => {
    return await axios.put(`doctors/edit/${_id}`, params);
}

//Service route controller

export const fetchServicesCollection = async() => {
    return await axios.get('services/fetch');
}

export const fetchSingleService = async(_id) => {
    return await axios.get(`services/fetch/${_id}`);
}

/**
 * Get services by doctor id
 * @param {number} params {doctor_id}
 * @returns 
 */
export const fetchServicesByDoctorId = async(params) => {
    return await axios.post(`services/getbydoctor`, params);
}

export const createService = async (params) => {
    return await axios.post(`services/create`, params);
}

export const importServices = async(file) => {
    return await axios.post(`services/import`, file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

export const editService = async(_id, params) => {
    return await axios.put(`services/edit/${_id}`, params);
}

//TimeSlots route controller

export const getTimeSlotsCollection = async() => {
    return await axios.get('timeslots/fetch');
}

export const getTimeSlotById = async(_id) => {
    return await axios.get(`timeslots/${_id}/getbyid`);
}

export const createTimeSlot = async(params) => {
    return await axios.post('timeslots/create', params);
}

export const editTimeSlot = async(_id, params) => {
    return await axios.put(`timeslots/${_id}/edit`, params);
}

export const destroyTimeSlot = async(_id) => {
    return await axios.delete(`timeslots/${_id}/destroy`);
}

// /**
//  * Get Timeslot by Doctor method | timeslots/getbydoctor POST
//  * @param {"doctor_id"} params 
//  * @returns 
//  */
// export const getTimeSlotsByDoctor = async(params) => {
//     return await axios.post(`timeslots/getbydoctor`, params);
// }

// /**
//  * Get Timeslot By Service method | timeslots/getbyservice
//  * @param {"service_id"} params
//  * @method POST
//  * @returns 
//  */
// export const getTimeSlotsByService = async(params) => {
//     return await axios.post(`timeslots/getbyservice`, params);
// }

/**
 * Get Timeslot by specific date method | timeslots/getbydate POST doctor_id/service_id optional
 * @param {"date", "doctor_id", "service_id"} params 
 * @returns 
 */

export const getTimeSlotsByFilter = async(params) => {
    return await axios.post(`timeslots/getbydate`, params);
}

/**
 * Bulk generation of timeslots
 * @param {"doctor_id", "service_id", "start_time", "end_time", "price"} params 
 * @returns 
 */
export const generateTimeSlots = async(params) => {
    return await axios.post(`timeslots/generate`, params);
}

//Shopping Cart route controller

/**
 * Get shopping cart
 * shoppingcart/get
 */

export const getShoppingCart = async() => {
    return await axios.get(`shoppingcart/items/get`);
}

/**
 * Add item shopping cart
 */
export const setItemToCart = async(params) => {
    return await axios.post(`shoppingcart/item/add`, params);
}

/**
 * Checkout shoppingcart/checkout
 */
export const checkout = async() => {
    return await axios.post(`shoppingcart/checkout`);
}

/**
 * Checkout cancel
 */
export const cancelCheckout = async (params) => {
    return await axios.post(`checkout/cancel`, params);
}

/**
 * Reset shopping cart
 */
export const resetShoppingCart = async (id) => {
    return await axios.delete(`shoppingcart/${id}/reset`);
}

/**
 * Remove specific item from shopping cart
 */
export const removeItemFromCart = async(id) => {
    return await axios.delete(`shoppingcart/item/${id}/remove`);
}

/**
 * Get Order by sessionId / orderId
 */
export const getOrderByFilter = async(params) => {
    return await axios.post(`order/get`, params);
}

/**
 * Download pdf files for timeslot
*/

export const downloadPdfTimeslot = async(id) => {
    return await axios.get(`timeslot/${id}/download-timeslot`, {
        responseType: 'blob',
    });
}

/**
 * Hospital reviews routes
 */

/**
 * Get all hospital reviews
 */
export const getHospitalReviews = async(params) => {
    return await axios.post(`hospital/reviews/get`, params);
}

/**
 * Create new hospital review
 */
export const createHospitalReviews = async(params) => {
    return await axios.post(`hospital/reviews/create`, params);
}

/**
 * Get count of hospital reviews
 */
export const getCountOfHospitalReviews = async(params) => {
    return await axios.post(`hospital/reviews/getcount`, params);
}

/**
 * Remove hospital review
 */
export const removeHospitalReview = async(id) => {
    return await axios.delete(`hospital/review/item/${id}/remove`);
}

/**
 * Get average rating for hospital
 */
export const getAverageRatingForHospital = async(params) => {
    return await axios.post(`hospital/rating`, params);
}