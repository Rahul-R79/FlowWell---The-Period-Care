import {configureStore, combineReducers}from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminAuthSliceReducer from '../features/auth/authAdminSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const rootReducer = combineReducers({auth: authReducer, adminAuth: adminAuthSliceReducer})

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
