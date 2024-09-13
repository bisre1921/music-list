import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { editMusic } from '../redux/musicsSlice'; 
import styled from '@emotion/styled';

const EditMusicForm = ({ music, onClose }) => {
  const dispatch = useDispatch(); 
  const [title, setTitle] = useState(music.title);
  const [artist, setArtist] = useState(music.artist);
  const [musicType, setMusicType] = useState(music.musicType);

  const handleEdit = (e) => {
    e.preventDefault();
    const updatedMusic = { ...music, title, artist, musicType };
    dispatch({ type: 'musics/editMusicSaga', payload: { id: music._id, updatedMusic } }); 
    onClose();
  };

  return (
    <Modal 
      isOpen={true} 
      onRequestClose={onClose} 
      ariaHideApp={false} 
      contentLabel="Edit Music"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        },
        content: {
          background: 'transparent', 
          border: 'none',
          borderRadius: '15px', 
          maxHeight: '90vh', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
        }
      }}
    >
      <PageContainer>
        <FormContainer>
          <Header>Edit Music</Header>
          <StyledForm onSubmit={handleEdit}>
            <FormField>
              <label>Music Title</label>
              <StyledInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </FormField>
            <FormField>
              <label>Artist</label>
              <StyledInput type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            </FormField>
            <FormField>
              <label>Music Type</label>
              <StyledSelect value={musicType} onChange={(e) => setMusicType(e.target.value)} required>
                <option value="reggae">Reggae</option>
                <option value="hiphop">Hip-Hop</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="other">Other</option>
              </StyledSelect>
            </FormField>
            <ButtonContainer>
              <StyledButton type="submit">Save</StyledButton>
              <StyledButton type="button" onClick={onClose}>Cancel</StyledButton>
            </ButtonContainer>
          </StyledForm>
        </FormContainer>
      </PageContainer>
    </Modal>
  );
};

export default EditMusicForm;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e2f, #252530);
  background-attachment: fixed;
`;

const FormContainer = styled.div`
  background: rgba(50, 50, 70, 0.8); /* Changed to a darker background */
  backdrop-filter: blur(15px);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Header = styled.h2`
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: 20px;
  letter-spacing: 1.5px;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  label {
    color: #FFD700;
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

const StyledInput = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease-in-out;
  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 10px #FFD700;
  }
`;

const StyledSelect = styled.select`
  padding: 12px;
  border-radius: 10px;
  border: none;
  background-color: rgba(100, 100, 120, 0.8); /* Changed to a darker background for visibility */
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease-in-out;
  &:focus {
    background-color: rgba(100, 100, 120, 1); /* Slightly darker on focus */
    box-shadow: 0 0 10px #FFD700;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  background-color: #FFD700;
  color: black;
  border: none;
  padding: 12px;
  font-size: 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  &:hover {
    background-color: #ffdf00;
    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.5);
    transform: translateY(-3px);
  }
`;
