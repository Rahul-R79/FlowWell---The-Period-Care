import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import SignIn from "./pages/user/auth/SignIn";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./pages/user/auth/ForgotPassword";
import ForgotPassword2 from "./pages/user/auth/ForgotPassword2";
import Home from "./pages/user/Home";
import ClearErrorOnRouteChange from "./components/clearErrors";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
    const {forgotPasswordEmaiVerify} = useSelector(state => state.auth);
    return(
        <BrowserRouter>
            <ClearErrorOnRouteChange/>
            <Routes>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/forgotpassword" element={<ForgotPassword/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/otpverification" element={<OtpVerification />} />
                <Route element={<ProtectedRoute isAllowed={forgotPasswordEmaiVerify} redirectPath="/forgotpassword" />}>
                    <Route path="/forgotpassword2" element={<ForgotPassword2 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;