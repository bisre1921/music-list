import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchMusics } from '../redux/musicsSlice'; 

const MusicForm = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/api/musics/upload', formData);
      alert('Music uploaded successfully');
      dispatch(fetchMusics()); 
      setTitle("");
      setArtist("");
      setFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      alert('Error uploading music');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Music Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Artist</label>
        <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
      </div>
      <div>
        <label>MP3 File</label>
        <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} accept=".mp3" />
      </div>
      <button type="submit">Upload Music</button>
    </form>
  );
};

export default MusicForm;
