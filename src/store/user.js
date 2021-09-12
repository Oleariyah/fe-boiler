import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        token: "",
        details: null,
        lastFetch: null
    },
    reducers: {
        userRequested: (user) => {
            user.loading = true;
        },
        gotUserToken: (user, action) => {
            user.loading = false;
            user.token = action?.payload?.access_token;
        },
        gotUserInfo: (user, action) => {
            user.loading = true;
            user.details = action?.payload;
        },
        userRequestFailed: (user, action) => {
            user.loading = false;
            user.token = ""
        }
    }
})

const {
    gotUserToken,
    userRequested,
    userRequestFailed,
    gotUserInfo,
} = slice.actions;

//Action Creators
export const getUserToken = (value) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/refresh_token",
        method: "post",
        data: value,
        onStart: userRequested.type,
        onSuccess: gotUserToken.type,
        onError: userRequestFailed.type,
        withCredentials: true
    }))
}

export const getUserInfo = () => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/infor",
        method: "get",
        onStart: userRequested.type,
        onSuccess: gotUserInfo.type,
        onError: userRequestFailed.type
    }))
}

//Selectors
//Memoization
export const getUser = createSelector(
    state => state.entities.user,
    user => user
)


export default slice.reducer;