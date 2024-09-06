import {Route, Routes} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import HospitalInfo from "./pages/HospitalInfo";
import AdminHome from "./pages/Adminpanel/Home";

function App() {
    return (
        <div className={"_container"}>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path='/hospital/:id' element={<HospitalInfo />} />
                <Route path='/adminpanel' element={<AdminHome />} />
             </Routes>
        </div>
    );
}

export default App;
