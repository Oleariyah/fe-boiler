import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        token: "",
        lastFetch: null
    },
    reducers: {
        userRequested: (user) => {
            user.loading = true;
        },
        gotUserToken: (user, action) => {
            user.loading = true;
            user.token = action?.payload?.access_token;
        },
        userRequestFailed: (user, action) => {
            user.loading = false;
        }
    }
})

const {
    gotUserToken,
    userRequested,
    userRequestFailed,
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


//Selectors
//Memoization
export const getUser = createSelector(
    state => state.entities.user,
    user => user
)


export default slice.reducer;