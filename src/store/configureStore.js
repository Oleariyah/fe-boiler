import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toastNotification from "./middleware/toast";
import api from "./middleware/api";

export default function configureAppStore() {
    return configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware(),
            logger("console"),
            toastNotification,
            api,
        ]
    });
}