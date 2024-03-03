import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/User';
const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
export default store;