import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import update from 'immutability-helper';
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        details: null,
        updated: null,
        subscribers: [],
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
        gotAllSubscribersInfo: (user, action) => {
            user.loading = false;
            user.subscribers = action?.payload;
        },
        userInfoUpdated: (user, action) => {
            user.loading = false;
            user.details = action?.payload?.user;
        },
        userRoleUpdated: (user, action) => {
            user.loading = false;

            const index = user?.subscribers?.findIndex(item => item._id === action?.payload?.subscribers?._id);
            user.subscribers = update(user.subscribers, { [index]: { $set: action.payload.subscribers } })
        },
        userDeleted: (user, action) => {
            user.loading = false;
            user.subscribers = update(user.subscribers, { $splice: [[action.payload.id, 1]] })
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
            user.subscribers = [];
            user.updated = null;
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
    gotAllSubscribersInfo,
    userRoleUpdated,
    userDeleted,
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

export const getAllSubcribersInfo = (history) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/subscribers",
        method: "get",
        history,
        onStart: userRequested.type,
        onSuccess: gotAllSubscribersInfo.type,
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

export const updateUserRole = ({ value, id, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: `/user/update_role/${id}`,
        method: "patch",
        data: { role: value },
        history,
        onStart: userRequested.type,
        onSuccess: userRoleUpdated.type,
        onError: userRequestFailed.type
    }))
}

export const deleteUser = ({ id, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: `/user/delete/${id}`,
        method: "delete",
        history,
        onStart: userRequested.type,
        onSuccess: userDeleted.type,
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