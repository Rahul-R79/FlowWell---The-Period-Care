import {configureStore, combineReducers}from '@reduxjs/toolkit';
import authUserSliceReducer from '../features/auth/authUserSlice';
import adminAuthSliceReducer from '../features/auth/authAdminSlice'
import userSliceReducer from '../features/userSlice'
import categorySliceReducer from '../features/categorySlice'
import adminProductSliceReducer from '../features/products/adminProductSlice';
import userProductSliceReducer from '../features/products/userProductSlice';
import profileSliceReducer from '../features/profileSlice';
import addressSliceReducer from '../features/addressSlice';
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
    address: addressSliceReducer
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
