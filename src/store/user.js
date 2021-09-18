import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        details: null,
        lastFetch: null
    },
    reducers: {
        userRequested: (user) => {
            user.loading = true;
        },
        gotUserInfo: (user, action) => {
            user.loading = false;
            user.details = action?.payload;
        },
        userRequestFailed: (user) => {
            user.loading = false;
        },
        userReset: (user) => {
            user.loading = false;
            user.details = null;
            user.lastFetch = null;
        },
    }
})

const {
    userRequested,
    userRequestFailed,
    gotUserInfo,
    userReset
} = slice.actions;

//Action Creators
export const getUserInfo = () => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/infor",
        method: "get",
        onStart: userRequested.type,
        onSuccess: gotUserInfo.type,
        onError: userRequestFailed.type
    }))
}

export const resetUser = () => (dispatch) => dispatch({ type: userReset.type })

//Selectors
//Memoization
export const getUser = createSelector(
    state => state.entities.user,
    user => user
)


export default slice.reducer;