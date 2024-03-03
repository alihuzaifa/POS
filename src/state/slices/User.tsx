import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
    mode: "light" | "dark",
    count: number,
    isLogin: boolean,
    isForget: boolean
}
const initialState: UserState = {
    mode: "dark",
    count: 0,
    isLogin: false,
    isForget: false,
};
const UserCounterSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        setMode: (state, { payload }: PayloadAction<"light" | "dark">) => {
            state.mode = payload
        },
        setCount: (state, { payload }: PayloadAction<number>) => {
            state.count = payload
        },
        setIsLogin: (state) => {
            state.isLogin = !state?.isLogin
        },
        setIsForget: (state) => {
            state.isForget = !state?.isForget
        },
    },
});
export const {
    setMode,
    setCount,
    setIsLogin,
    setIsForget
} = UserCounterSlice.actions;
export default UserCounterSlice.reducer;