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
        }
    }
})

const {
    userRequested,
    userRequestFailed,
    gotUserInfo,
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

//Selectors
//Memoization
export const getUser = createSelector(
    state => state.entities.user,
    user => user
)


export default slice.reducer;