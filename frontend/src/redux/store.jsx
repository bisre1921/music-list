import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import musicsReducer from './musicsSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        musics: musicsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: false,
            serializableCheck: {
                ignoredActions: ['musics/addMusic'], 
                ignoredPaths: ['payload.musicData'], 
            },
        }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
