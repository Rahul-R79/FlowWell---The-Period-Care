import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import SignIn from "./pages/user/auth/SignIn";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./pages/user/auth/ForgotPassword";
import ForgotPassword2 from "./pages/user/auth/ForgotPassword2";
import Home from "./pages/user/home/Home";
import ClearErrorOnRouteChange from "./components/clearErrors";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/user/profile/UserProfile";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";
import { PublicRoute } from "./components/PublicRoute";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminSignIn from "./pages/admin/AdminSignIn";
import DashBoard from "./pages/admin/DashBoard";

function App(){
    const {user, forgotPasswordEmaiVerify, loadingByAction} = useSelector(state => state.auth);
    const isLoggedIn = Boolean(user);
    const dispatch = useDispatch();
    const getuserLoading = loadingByAction?.getCurrentUser

    useEffect(()=>{
        dispatch(getCurrentUser());
    }, [dispatch]);

    if (getuserLoading){
        return <LoadingSpinner/>
    }

    return(
        <BrowserRouter>
            <ClearErrorOnRouteChange/>
            <Routes>
                <Route element={<PublicRoute/>}>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                    <Route path="/forgotpassword" element={<ForgotPassword/>}/>
                    <Route path="/otpverification" element={<OtpVerification />} />
                </Route>
                <Route element={<ProtectedRoute isAllowed={forgotPasswordEmaiVerify} redirectPath="/forgotpassword" />}>
                    <Route path="/forgotpassword2" element={<ForgotPassword2 />} />
                </Route>
                <Route element={<ProtectedRoute isAllowed={isLoggedIn} redirectPath="/signup"/>}>
                    <Route path="/userprofile" element={<UserProfile/>}/>
                </Route>
                <Route path="/" element={<Home/>}/>
                <Route path="/adminsignin" element={<AdminSignIn/>}/>
                <Route path="/dashboard" element={<DashBoard/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;