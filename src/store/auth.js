import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isLogged: false,
        newUser: false,
        isAdmin: false,
        lastFetch: null
    },
    reducers: {
        authRequested: (auth) => {
            auth.loading = true;
        },
        userRegistered: (auth, action) => {
            auth.newUser = true;
            auth.loading = false;
        },
        userLoggedIn: (auth, action) => {
            auth.newUser = false;
            auth.isAdmin = false;
            auth.isLogged = true;
            auth.loading = false;
            auth.lastFetch = Date.now();
        },
        userLoggedInViaGoogle: (auth, action) => {
            auth.newUser = false;
            auth.isAdmin = false;
            auth.isLogged = true;
            auth.loading = false;
            auth.lastFetch = Date.now();
        },
        userLoggedInViaFacebook: (auth, action) => {
            auth.newUser = false;
            auth.isAdmin = false;
            auth.isLogged = true;
            auth.loading = false;
            auth.lastFetch = Date.now();
        },
        sentResetPasswordLink: (auth, action) => {
            auth.loading = false;
        },
        authRequestFailed: (auth, action) => {
            auth.loading = false;
        },
        accountActivated: (auth, action) => {
            auth.loading = false;
        },
        userLoggedOut: (auth, action) => {
            auth.isLogged = false;
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
    userLoggedOut
} = slice.actions;

//Action Creators
export const loginUser = (value) => (dispatch, getState) => {
    dispatch(apiCallBegan({
        url: "/user/login",
        method: "post",
        data: value,
        onStart: authRequested.type,
        onSuccess: userLoggedIn.type,
        onError: authRequestFailed.type
    }))
}

export const registerUser = (value) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/register",
        method: "post",
        data: value,
        onStart: authRequested.type,
        onSuccess: userRegistered.type,
        onError: authRequestFailed.type
    }))
}

export const resetPassword = (value) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/forgot",
        method: "post",
        data: value,
        onStart: authRequested.type,
        onSuccess: sentResetPasswordLink.type,
        onError: authRequestFailed.type
    }))
}

export const loginWithGoogle = (value) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/google_login",
        method: "post",
        data: value,
        onStart: authRequested.type,
        onSuccess: userLoggedInViaGoogle.type,
        onError: authRequestFailed.type
    }))
}

export const loginWithFacebook = (value) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/facebook_login",
        method: "post",
        data: value,
        onStart: authRequested.type,
        onSuccess: userLoggedInViaFacebook.type,
        onError: authRequestFailed.type
    }))
}

export const activateAccount = (value) => (dispatch) => {
    dispatch(apiCallBegan({
        url: "/user/activation",
        method: "post",
        data: value,
        onStart: authRequested.type,
        onSuccess: accountActivated.type,
        onError: authRequestFailed.type
    }))
}

export const logoutUser = () => apiCallBegan({
    onSuccess: userLoggedOut.type,
})

//Selectors
//Memoization
export const getAuthDetails = createSelector(
    state => state.entities.auth,
    auth => auth
)


export default slice.reducer;