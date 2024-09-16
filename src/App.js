import {Route, Routes} from "react-router-dom";
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
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {getMe} from "./redux/slices/authSlice";
import CreateUser from "./pages/Adminpanel/UsersPage/CreateUser";
import EditUser from "./pages/Adminpanel/UsersPage/EditUser";
import Referrals from "./pages/User/Referrals";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

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
                <Route path='/adminpanel/settings/hospital' element={<HospitalPage specific={true} />} />
                <Route path='/adminpanel/hospitals' element={<HospitalPage specific={false} />} />
                <Route path='/hospital/:id' element={<HospitalInfo />} />

                <Route path='/adminpanel/reports' element={<Reports />} />

                <Route path='/adminpanel/settings/departments' element={<Departments />} />
                <Route path="/adminpanel/order-history" element={<OrderHistory />} />
             </Routes>
        </div>
    );
}

export default App;
