import {Route, Routes, useNavigate} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import HospitalInfo from "./pages/HospitalInfo";
import AdminHome from "./pages/Adminpanel/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DoctorsPage from "./pages/Adminpanel/DoctorsPage";
import ServicesPage from "./pages/Adminpanel/ServicesPage";
import UsersPage from "./pages/Adminpanel/UsersPage";
import Reports from "./pages/Adminpanel/Reports";
import HospitalPage from "./pages/Adminpanel/Settings/HospitalPage";
import Departments from "./pages/Adminpanel/Settings/Departments";
import OrderHistory from "./pages/Adminpanel/Settings/OrderHistory";
import UserProfile from "./pages/User/Profile";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getMe, selectIsUnauthorized} from "./redux/slices/authSlice";
import CreateUser from "./pages/Adminpanel/UsersPage/CreateUser";
import EditUser from "./pages/Adminpanel/UsersPage/EditUser";
import Referrals from "./pages/User/Referrals";
import ActionHospital from "./pages/Adminpanel/Settings/HospitalPage/ActionHospital";
import { ActionDepartment } from "./pages/Adminpanel/Settings/HospitalPage/ActionDepartment";
import { ActionDoctors } from "./pages/Adminpanel/Settings/HospitalPage/ActionDoctors";
import { ActionServices } from "./pages/Adminpanel/Settings/HospitalPage/ActionServices";
import { TimeSlotPicker } from "./pages/TimeslotPicker";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isAlertShown, setIsAlertShown] = useState(false);
    const isUnAuthorized = useSelector(selectIsUnauthorized);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isUnAuthorized && !isAlertShown) {
            alert("Your session has expired. Please log in again.");
            setIsAlertShown(true);  // Mark the alert as shown
            navigate('/sign-in');  // Redirect to login page
        }
    }, [isUnAuthorized, isAlertShown, navigate]);

    return (
        <div className={"_container"}>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path={"/sign-in"} element={<Login />} />
                <Route path={"/sign-up"} element={<Register />} />
                {/* UserProfile routes */}
                <Route path='/user/profile' element={<UserProfile />} />
                <Route path='user/referrals' element={<Referrals />} />


                <Route path='/adminpanel' element={<AdminHome />} />
                <Route path='/adminpanel/doctors' element={<DoctorsPage />} />
                <Route path='/adminpanel/services' element={<ServicesPage />} />
                {/* Users routes */}
                <Route path='/adminpanel/users' element={<UsersPage />} />
                <Route path='/adminpanel/user/create' element={<CreateUser />} />
                <Route path='/adminpanel/user/:_id/edit/' element={<EditUser /> } />

                 {/* Hospital routes  */}
                <Route path='/adminpanel/settings/:_id/hospital' element={<HospitalPage specific={true} />} />
                <Route path='/adminpanel/hospitals' element={<HospitalPage specific={false} />} />
                <Route path='/hospital/:id' element={<HospitalInfo />} />
                <Route path='/adminpanel/hospital/create' element={<ActionHospital isEdit={false} />} />
                <Route path='/adminpanel/hospital/:_id/edit' element={<ActionHospital isEdit={true} />} />

                {/* Department routes */}
                <Route path='/adminpanel/hospital/department/create' element={<ActionDepartment isEdit={false} />} />
                <Route path='/adminpanel/hospital/department/:_id/edit' element={<ActionDepartment isEdit={true} />} />

                {/* Doctor routes */}
                <Route path='/adminpanel/hospital/doctor/create' element={<ActionDoctors isEdit={false} />} />
                <Route path='/adminpanel/hospital/doctor/:_id/edit' element={<ActionDoctors isEdit={true} />} />

                <Route path='/adminpanel/reports' element={<Reports />} />

                {/* Services routes */}
                <Route path='/adminpanel/hospital/service/create' element={<ActionServices />} />

                <Route path='/hospital/doctor/:_id/timeslots' element={<TimeSlotPicker isDoctorPage={true} />} />
                <Route path='/hospital/service/:_id/timeslots' element={<TimeSlotPicker isServicePage={true} />} />

                {/* <Route path='/adminpanel/settings/departments' element={<Departments />} /> */}
                <Route path="/adminpanel/order-history" element={<OrderHistory />} />
             </Routes>
        </div>
    );
}

export default App;
