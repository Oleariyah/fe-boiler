import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import { saveState, logout } from "../helpers/auth";

const slice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isLogged: false,
        token: "",
        lastFetch: null
    },
    reducers: {
        authReset: (auth) => {
            auth.loading = false;
            auth.isLogged = false;
            auth.token = "";
            auth.lastFetch = null;
        },
        authRequested: (auth) => {
            auth.loading = true;
        },
        userRegistered: (auth) => {
            auth.loading = false;
        },
        userLoggedIn: (auth) => {
            auth.isLogged = true;
            auth.loading = false;
            auth.lastFetch = Date.now();
        },
        userLoggedInViaGoogle: (auth) => {
            auth.isLogged = true;
            auth.loading = false;
            auth.lastFetch = Date.now();
        },
        userLoggedInViaFacebook: (auth) => {
            auth.isLogged = true;
            auth.loading = false;
            auth.lastFetch = Date.now();
        },
        sentResetPasswordLink: (auth) => {
            auth.loading = false;
        },
        gotUserToken: (user, action) => {
            user.loading = false;
            user.token = action?.payload?.access_token;
            user.lastFetch = Date.now();
            saveState(action?.payload?.access_token);
        },
        accountActivated: (auth) => {
            auth.loading = false;
        },
        userLoggedOut: (user) => {
            user.loading = false;
            user.isLogged = false
            user.token = "";
            logout();
        },
        authRequestFailed: (auth) => {
            auth.loading = false;
        }
    }
})

const {
    userLoggedInViaGoogle,
    userLoggedInViaFacebook,
    authRequested,
    userLoggedIn,
    authRequestFailed,
    userRegistered,
    sentResetPasswordLink,
    accountActivated,
    userLoggedOut,
    gotUserToken,
    authReset
} = slice.actions;

//Action Creators
export const loginUser = ({ data, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/login",
        method: "post",
        data,
        history,
        onStart: authRequested.type,
        onSuccess: userLoggedIn.type,
        onError: authRequestFailed.type
    }))
}

export const registerUser = ({ data, history }) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/register",
        method: "post",
        data,
        history,
        onStart: authRequested.type,
        onSuccess: userRegistered.type,
        onError: authRequestFailed.type
    }))
}

export const resetPassword = ({ data, history }) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/forgot",
        method: "post",
        data,
        history,
        onStart: authRequested.type,
        onSuccess: sentResetPasswordLink.type,
        onError: authRequestFailed.type
    }))
}

export const loginWithGoogle = ({ data, history }) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/google_login",
        method: "post",
        data,
        history,
        onStart: authRequested.type,
        onSuccess: userLoggedInViaGoogle.type,
        onError: authRequestFailed.type
    }))
}

export const loginWithFacebook = ({ data, history }) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/facebook_login",
        method: "post",
        data,
        history,
        onStart: authRequested.type,
        onSuccess: userLoggedInViaFacebook.type,
        onError: authRequestFailed.type
    }))
}

export const activateAccount = ({ token, history }) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/activation",
        method: "post",
        data: { activation_token: token },
        history,
        onStart: authRequested.type,
        onSuccess: accountActivated.type,
        onError: authRequestFailed.type
    }))
}

export const getUserToken = ({ data, history }) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/refresh_token",
        method: "post",
        data,
        history,
        onStart: authRequested.type,
        onSuccess: gotUserToken.type,
        onError: authRequestFailed.type
    }))
}

export const logoutUser = (history) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/logout",
        method: "get",
        history,
        onStart: authRequested.type,
        onSuccess: userLoggedOut.type,
        onError: authRequestFailed.type,
        onReset: true
    }))
}

export const resetAuth = () => (dispatch) => dispatch({ type: authReset.type })

//Selectors
//Memoization
export const getAuthDetails = createSelector(
    state => state.entities.auth,
    auth => auth
)


export default slice.reducer;