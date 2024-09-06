import {Route, Routes} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import HospitalInfo from "./pages/HospitalInfo";
import AdminHome from "./pages/Adminpanel/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
    return (
        <div className={"_container"}>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path={"/sign-in"} element={<Login />} />
                <Route path={"/sign-up"} element={<Register />} />
                <Route path='/hospital/:id' element={<HospitalInfo />} />
                <Route path='/adminpanel' element={<AdminHome />} />
             </Routes>
        </div>
    );
}

export default App;
