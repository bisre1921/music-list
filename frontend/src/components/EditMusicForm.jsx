import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { editMusic } from '../redux/musicsSlice'; 

const EditMusicForm = ({ music, onClose }) => {
  const dispatch = useDispatch(); 
  const [title, setTitle] = useState(music.title);
  const [artist, setArtist] = useState(music.artist);

  const handleEdit = (e) => {
    e.preventDefault();
    const updatedMusic = { ...music, title, artist }; 
    dispatch({ type: 'musics/editMusicSaga', payload: { id: music._id, updatedMusic } }); 
    onClose();
  };

  return (
    <Modal isOpen={true} onRequestClose={onClose} ariaHideApp={false} contentLabel="Edit Music">
      <h2>Edit Music</h2>
      <form onSubmit={handleEdit}>
        <label>Music Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Artist</label>
        <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
        <button type="submit">Save</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default EditMusicForm;
