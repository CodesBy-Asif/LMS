import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/ApiSlice";

interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

const initialState = {
    user:"",
    token:""
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegtration: (state, action) => {
            state.token = action.payload.token;
        },
        userLogin: (state, action) => {
            state.token = action.payload.acessToken;
            state.user = action.payload.user;
        },
        userLogout: (state) => {
            state.token = "";
            state.user = "";
        },

    },
})

export const { userRegtration, userLogin, userLogout } = authSlice.actions;

export default authSlice.reducer;