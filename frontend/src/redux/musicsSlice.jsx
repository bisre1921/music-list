import { createSlice } from '@reduxjs/toolkit';

const musicsSlice = createSlice({
    name: "musics",
    initialState: {
        musics: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchMusics: (state) => {
            state.loading = true;
        },
        fetchMusicsSuccess: (state, action) => {
            state.loading = false;
            state.musics = action.payload;
        },
        fetchMusicsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addMusic: (state) => {
            state.loading = true; 
        },
        addMusicSuccess: (state, action) => {
            state.loading = false;
            state.musics.push(action.payload); 
        },
        addMusicFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteMusic: (state, action) => {
            state.musics = state.musics.filter(music => music._id !== action.payload);
        },
        editMusic: (state, action) => {
            const index = state.musics.findIndex((music) => music._id === action.payload._id);
            if (index !== -1) {
                state.musics[index] = action.payload;
            }
        },
    }
});

export const {
    fetchMusics,
    fetchMusicsSuccess,
    fetchMusicsFailure,
    addMusic,
    addMusicSuccess,
    addMusicFailure,
    deleteMusic,
    editMusic
} = musicsSlice.actions;

export default musicsSlice.reducer;
