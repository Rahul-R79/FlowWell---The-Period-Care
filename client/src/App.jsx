import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import SignIn from "./pages/user/auth/SignIn";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./pages/user/auth/ForgotPassword";
import ForgotPassword2 from "./pages/user/auth/ForgotPassword2";
import Home from "./pages/user/home/Home";
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
import AddProducts from "./pages/admin/products/AddProducts";
import EditProducts from "./pages/admin/products/EditProducts";
import Products from "./pages/admin/products/Products";
import ProductPage from "./pages/user/products/ProductPage";
import ProductDetailPage from "./pages/user/products/ProductDetailPage";
import UserPageNotFound from "./pages/user/notFound/UserPageNotFound";
import AdminPageNotFound from "./pages/admin/notFound/AdminPageNotFound";
import ChangePassword from "./pages/user/auth/ChangePassword";
import AddAddress from "./pages/user/address/AddAddress";
import Address from "./pages/user/address/Address";
import EditAddress from "./pages/user/address/EditAddress";
import Wishlist from "./pages/user/wishlist/Wishlist";
import Cart from "./pages/user/cart/Cart";
import CheckoutAddress from "./pages/user/checkoutAddress/CheckoutAddress";
import AddCheckoutAddress from "./pages/user/checkoutAddress/AddCheckoutAddress";
import EditCheckoutAddress from "./pages/user/checkoutAddress/EditCheckoutAddres";
import Payment from "./pages/user/payment/Payment";
import PaymentSuccess from "./pages/user/payment/PaymentSuccess";

function App() {
    const { user, forgotPasswordEmaiVerify, loadingByAction } = useSelector(
        (state) => state.auth
    );
    const { admin } = useSelector((state) => state.adminAuth);
    const isLoggedInUser = Boolean(user);
    const isLoggedInAdmin = Boolean(admin);
    const getUserLoading = loadingByAction?.getCurrentUser;
    const getAdminLoading = loadingByAction?.getCurrentAdmin;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentAdmin());
        dispatch(getCurrentUser());
    }, [dispatch]);

    if (getUserLoading || getAdminLoading) {
        return <LoadingSpinner />;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes - accessible when not logged in */}
                <Route element={<PublicRoute />}>
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/signin' element={<SignIn />} />
                    <Route
                        path='/otpverification'
                        element={<OtpVerification />}
                    />
                    <Route path='/forgotpassword' element={<ForgotPassword />}/>
                </Route>

                {/* Forgot Password */}
                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={forgotPasswordEmaiVerify}
                            redirectPath='/forgotpassword'
                        />
                    }>
                    <Route
                        path='/forgotpassword2'
                        element={<ForgotPassword2 />}
                    />
                </Route>

                {/* Admin Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={isLoggedInAdmin}
                            redirectPath='/admin/signin'
                        />
                    }>
                    <Route path='/admin/dashboard' element={<DashBoard />} />
                    <Route path='/admin/customers' element={<Customers />} />
                    <Route
                        path='/admin/categories'
                        element={<CategoriesPage />}
                    />
                    <Route
                        path='/admin/editcategories/:id'
                        element={<EditCategories />}
                    />
                    <Route
                        path='/admin/addcategories'
                        element={<AddCategories />}
                    />
                    <Route path='/admin/products' element={<Products />} />
                    <Route
                        path='/admin/products/add'
                        element={<AddProducts />}
                    />
                    <Route
                        path='/admin/products/edit/:id'
                        element={<EditProducts />}
                    />
                    <Route path='/admin/*' element={<AdminPageNotFound />} />
                </Route>

                {/* User Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={isLoggedInUser}
                            redirectPath='/signup'
                        />
                    }>
                    <Route path='/profile' element={<UserProfile />} />
                    <Route path="/changepassword" element={<ChangePassword/>} />
                    <Route path='/address/add' element={<AddAddress />} />
                    <Route path='/address' element={<Address />} />
                    <Route path="/address/:id/edit" element={<EditAddress/>} />
                    <Route path="/wishlist" element={<Wishlist/>} /> 
                    <Route path="/cart" element={<Cart/>} />
                    <Route path="/checkout/address" element={<CheckoutAddress/>}/>
                    <Route path="/checkout/add/address" element={<AddCheckoutAddress/>}/>
                    <Route path="/checkout/address/:id/edit" element={<EditCheckoutAddress/>}/>
                    <Route path="/payment" element={<Payment/>} />
                    <Route path="/payment/success" element={<PaymentSuccess/>} />
                </Route>

                {/* Public Routes accessible for everyone*/}
                <Route path='/' element={<Home />} />
                <Route path='/user/product' element={<ProductPage />} />
                <Route path='/user/productdetail/:id' element={<ProductDetailPage />} />
                <Route path='*' element={<UserPageNotFound />} />
                <Route path='/admin/signin' element={<AdminSignIn />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
