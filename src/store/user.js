import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        details: null,
        updated: null,
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
        userInfoUpdated: (user, action) => {
            user.loading = false;
            user.details = action?.payload?.user;
        },
        userPasswordChanged: (user, action) => {
            user.loading = false;
        },
        userAvatarChanged: (user, action) => {
            user.loading = false;
            user.details = { ...user.details, avatar: action.payload.url }
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
    userInfoUpdated,
    userPasswordChanged,
    userAvatarChanged,
    userReset
} = slice.actions;

//Action Creators
export const getUserInfo = (history) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/infor",
        method: "get",
        history,
        onStart: userRequested.type,
        onSuccess: gotUserInfo.type,
        onError: userRequestFailed.type
    }))
}

export const updateUserInfo = ({ data, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/update",
        method: "patch",
        data,
        onStart: userRequested.type,
        onSuccess: userInfoUpdated.type,
        onError: userRequestFailed.type
    }))
}

export const updateUserAvatar = ({ data, type, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/api/upload_avatar",
        method: "post",
        data,
        type,
        history,
        onStart: userRequested.type,
        onSuccess: userAvatarChanged.type,
        onError: userRequestFailed.type,
    }))
}

export const changeUserPassword = ({ data, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/reset",
        method: "post",
        data,
        history,
        onStart: userRequested.type,
        onSuccess: userPasswordChanged.type,
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