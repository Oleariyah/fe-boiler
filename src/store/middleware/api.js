import axios from "axios";
import * as actions from "../api";
import { Redirect } from "react-router-dom";
import { getUserToken } from "../user";
import { useDispatch } from "react-redux";

axios.interceptors.request.use((config) => {
    config.withCredentials = true;
    config.retry = false;
    console.log(config)
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && originalRequest?.url?.includes("/user/refresh_token")) {
        <Redirect to="/login" />
        return Promise.reject(error);
    } else if (error?.response?.status === 401 && !originalRequest?.retry) {
        originalRequest.retry = true;
        const dispatch = useDispatch();
        dispatch(getUserToken(null))
    }
    return Promise.reject(error);
});

const api = ({ dispatch, getState }) => next => async action => {
    const token = getState().entities?.user?.token;
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onSuccess, onStart, onError } = action.payload;

    if (onStart) dispatch({ type: onStart })
    next(action);

    try {
        const response = await axios.request({
            baseURL: process.env.REACT_APP_API_URL,
            url,
            method,
            data,
            headers: { Authorization: `${token && `Bearer ${token}`}` },
        })
        //General
        dispatch(actions.apiCallSuccess(response.data));
        //Specific
        if (onSuccess) dispatch({ type: onSuccess, payload: response?.data });

    } catch (error) {
        //General
        dispatch(actions.apiCallFailed(error?.response?.data?.message));
        //Specific
        if (onError) dispatch({ type: onError })
    }

}

export default api;