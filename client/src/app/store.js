import {configureStore, combineReducers}from '@reduxjs/toolkit';
import authUserSliceReducer from '../features/auth/authUserSlice';
import adminAuthSliceReducer from '../features/auth/authAdminSlice'
import userSliceReducer from '../features/userSlice'
import categorySliceReducer from '../features/categorySlice'
import adminProductSliceReducer from '../features/products/adminProductSlice';
import userProductSliceReducer from '../features/products/userProductSlice';
import profileSliceReducer from '../features/profileSlice';
import addressSliceReducer from '../features/addressSlice';
import wishlistSliceReducer from '../features/wishlistSlice';
import cartSliceReducer from '../features/cartSlice';
import orderSliceReducer from '../features/orders/orderSlice';
import adminOrderReducer from '../features/orders/adminOrderSlice';
import adminCouponReducer from '../features/coupons/adminCouponSlice';
import couponReducer from '../features/coupons/couponSlice';
import walletReducer from '../features/walletSlice';
import userReferralReducer from '../features/referral/userReferralSlice';
import adminReferralReducer from '../features/referral/adminReferralSlice';
import adminSalesReportReducer from '../features/salesReportSlice';
import userReviewReducer from '../features/reviewSlice';
import adminDashboardReducer from '../features/dashboardSlice';
import adminBannerReducer from '../features/banner/adminBannerSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const rootReducer = combineReducers({
    auth: authUserSliceReducer, 
    adminAuth: adminAuthSliceReducer,
    users: userSliceReducer,
    category: categorySliceReducer,
    adminProducts: adminProductSliceReducer,
    userProducts: userProductSliceReducer,
    profile: profileSliceReducer,
    address: addressSliceReducer,
    wishlist: wishlistSliceReducer,
    cart: cartSliceReducer,
    order: orderSliceReducer,
    adminOrder: adminOrderReducer,
    adminCoupon: adminCouponReducer,
    coupon: couponReducer,
    wallet: walletReducer,
    userReferral: userReferralReducer,
    adminReferral: adminReferralReducer,
    salesReport: adminSalesReportReducer,
    review: userReviewReducer,
    dashboard: adminDashboardReducer,
    adminBanner: adminBannerReducer
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'adminAuth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck: false,
    })
});

export const persistor = persistStore(store);
