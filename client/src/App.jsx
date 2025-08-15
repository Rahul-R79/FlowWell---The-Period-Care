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
import { getCurrentUser } from "./features/auth/authUserSlice";
import { PublicRoute } from "./components/PublicRoute";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminSignIn from "./pages/admin/AdminSignIn";
import DashBoard from "./pages/admin/DashBoard";
import { getCurrentAdmin } from "./features/auth/authAdminSlice";
import Customers from "./pages/admin/customers/Customers";
import CategoriesPage from "./pages/admin/categories/Categories";
import EditCategories from "./pages/admin/categories/EditCategories";
import AddCategories from "./pages/admin/categories/AddCategories";

function App(){
    const {user, forgotPasswordEmaiVerify, loadingByAction} = useSelector(state => state.auth);
    const {admin} = useSelector(state => state.adminAuth);
    const isLoggedInUser = Boolean(user);
    const isLoggedInAdmin = Boolean(admin);
    const getUserLoading = loadingByAction?.getCurrentUser;
    const getAdminLoading = loadingByAction?.getCurrentAdmin;
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getCurrentAdmin());
        dispatch(getCurrentUser());
    }, [dispatch]);

    if (getUserLoading || getAdminLoading){
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
                <Route element={<ProtectedRoute isAllowed={forgotPasswordEmaiVerify} redirectPath="/forgotpassword"/>}>
                    <Route path="/forgotpassword2" element={<ForgotPassword2 />} />
                </Route>
                <Route element={<ProtectedRoute isAllowed={isLoggedInUser} redirectPath="/signup"/>}>
                    <Route path="/userprofile" element={<UserProfile/>}/>
                </Route>
                <Route path="/" element={<Home/>}/>
                <Route path="/adminsignin" element={<AdminSignIn/>}/>
                <Route element={<ProtectedRoute isAllowed={isLoggedInAdmin} redirectPath="/adminsignin"/>}>
                    <Route path="/dashboard" element={<DashBoard/>} />
                </Route>
                <Route path="/customers" element={<Customers/>}/>
                <Route path="/categories" element={<CategoriesPage/>}/>
                <Route path="/editcategories/:id" element={<EditCategories/>}/>
                <Route path="/addcategories" element={<AddCategories/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;