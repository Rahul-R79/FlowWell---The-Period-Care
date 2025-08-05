import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import SignIn from "./pages/user/auth/SignIn";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./pages/user/auth/ForgotPassword";
import ForgotPassword2 from "./pages/user/auth/ForgotPassword2";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/signUp" element={<SignUp/>}/>
                <Route path="/signIn" element={<SignIn/>}/>
                <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                <Route path="/otpVerification" element={<OtpVerification/>}/>
                <Route path="/forgotPassword2" element={<ForgotPassword2/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;