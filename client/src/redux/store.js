import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // Correct import

const rootReducer = combineReducers({
    user: userReducer,
    theme:themeReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Fix variable name

export const store = configureStore({
    reducer: persistedReducer, // Corrected reference
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Correct syntax
        }),
});

export const persistor = persistStore(store);
