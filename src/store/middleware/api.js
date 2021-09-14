import axios from "axios";
import * as actions from "../api";
import { useHistory } from "react-router-dom";
import { saveState, loadState } from "../../helpers/auth";

axios.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest.url.includes("/user/refresh_token")) {
        const history = useHistory();
        //store.commit("clearUserData");
        history.push("/");
        return Promise.reject(error);
    }
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh_token`, null, { withCredentials: true })
        originalRequest.headers.Authorization = response?.data?.access_token
        saveState(response?.data?.access_token)
        return axios(originalRequest);
    }
    return Promise.reject(error);
});

const api = ({ dispatch, getState }) => next => async action => {
    const state = loadState() && loadState().user && loadState();
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const {
        url,
        method,
        data,
        onSuccess,
        onStart,
        onError,
        withCredentials
    } = action.payload;

    if (onStart) dispatch({ type: onStart })
    next(action);

    try {
        const response = await axios.request({
            baseURL: process.env.REACT_APP_API_URL,
            url,
            method,
            data,
            withCredentials: withCredentials && withCredentials,
            headers: { Authorization: `${state && `Bearer ${state.token}`}` },
        })
        //General
        dispatch(actions.apiCallSuccess(response.data));
        //Specific
        if (onSuccess) dispatch({ type: onSuccess, payload: response?.data });

    } catch (error) {
        //General
        dispatch(actions.apiCallFailed(error?.response?.data?.message));
        //Specific
        if (onError) dispatch({ type: onError, payload: error?.response?.data?.message })
    }

}

export default api;