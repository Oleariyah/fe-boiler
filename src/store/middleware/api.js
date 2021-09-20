import axios from "axios";
import * as actions from "../api";
import { saveState, logout } from "../../helpers/auth";

axios.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 400 && ["/user/login", "/user/refresh_token"].indexOf(originalRequest.url) > -1) {
        logout()
        return Promise.reject(error);
    }
    if (error.response.status === 400 && !originalRequest._retry) {
        originalRequest._retry = true;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh_token`, null, { withCredentials: true })
        originalRequest.headers.Authorization = response?.data?.access_token
        saveState(response?.data?.access_token)
        return axios(originalRequest);
    }
    return Promise.reject(error);
});

const api = ({ dispatch, getState }) => next => async action => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const {
        url,
        method,
        data,
        onSuccess,
        onStart,
        onError,
        onReset,
        type,
        history
    } = action.payload;

    if (onStart) dispatch({ type: onStart })
    next(action);

    try {
        const state = getState();
        const response = await axios.request({
            baseURL: process.env.REACT_APP_API_URL,
            url,
            method,
            data,
            withCredentials: true,
            headers: {
                Authorization: `${state && `Bearer ${state?.entities?.auth?.token}`}`,
                "Content-Type": type && type,
            }
        })
        //General
        dispatch(actions.apiCallSuccess(response.data));
        //Specific
        if (onSuccess) dispatch({ type: onSuccess, payload: response?.data });
        if (onReset) dispatch(actions.apiResetStore());

    } catch (error) {
        const originalRequest = error.config;
        if (error?.response?.status === 400 && originalRequest?.url?.includes("/user/refresh_token")) {
            dispatch(actions.apiResetStore());
            history.push("/")
        }
        //General
        dispatch(actions.apiCallFailed(error?.response?.data?.message));
        //Specific
        if (onError) dispatch({ type: onError, payload: error?.response?.data?.message })
    }

}

export default api;