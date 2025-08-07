import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import SignIn from "./pages/user/auth/SignIn";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./pages/user/auth/ForgotPassword";
import ForgotPassword2 from "./pages/user/auth/ForgotPassword2";
import Home from "./pages/user/Home";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/forgotpassword" element={<ForgotPassword/>}/>
                <Route path="/otpverification" element={<OtpVerification/>}/>
                <Route path="/forgotpassword2" element={<ForgotPassword2/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;