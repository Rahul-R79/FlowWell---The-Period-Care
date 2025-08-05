import {configStore} from '@reduxjs/toolkit';

const store = configStore({
    reducer: {
        auth: authReducer
    }
});

export default store;