import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toastNotification from "./middleware/toast";
import reset from "./middleware/reset";
import storage from 'redux-persist/lib/storage'
import api from "./middleware/api";
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: [
        ...getDefaultMiddleware({
            serializableCheck: false
        }),
        logger("console"),
        toastNotification,
        api,
        reset
    ]
});

const persistor = persistStore(store);

export { store, persistor }