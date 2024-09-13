import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { fetchMusics, fetchMusicsSuccess, fetchMusicsFailure, editMusic } from './musicsSlice';

function* fetchMusicsSaga() {
  const backendUrl = process.env.VITE_BACKEND_URL;
    try {
      const response = yield call(axios.get, `${backendUrl}/api/musics`);
      yield put(fetchMusicsSuccess(response.data));
    } catch (error) {
      yield put(fetchMusicsFailure(error.message));
    }
}

function* editMusicSaga(action) {
    try {
      const { id, updatedMusic } = action.payload;
      const response = yield call(axios.put, `${backendUrl}/api/musics/${id}`, updatedMusic);
      yield put(editMusic(response.data)); 
      yield put(fetchMusics());
    } catch (error) {
      console.error('Failed to update music:', error);
    }
}

function* deleteMusicSaga(action) {
    try {
      yield call(axios.delete, `${backendUrl}/api/musics/${action.payload}`);
      yield put(fetchMusics()); 
    } catch (error) {
      console.error('Failed to delete music:', error);
    }
}

function* rootSaga() {
    yield takeEvery(fetchMusics.type, fetchMusicsSaga);
    yield takeEvery('musics/editMusicSaga', editMusicSaga);
    yield takeEvery('musics/deleteMusicSaga', deleteMusicSaga);
}

export default rootSaga;
