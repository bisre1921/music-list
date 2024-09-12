import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchMusics } from '../redux/musicsSlice'; 
import { useNavigate } from 'react-router-dom'; 
import styled from '@emotion/styled';

const MusicForm = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [type, setType] = useState('reggae');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('file', file);
    formData.append('type', type); 

    try {
        await axios.post('http://localhost:8000/api/musics/upload', formData);
        alert('Music uploaded successfully');
        dispatch(fetchMusics());
        setTitle("");
        setArtist("");
        setFile(null);
        fileInputRef.current.value = "";
        navigate('/');
    } catch (error) {
        alert('Error uploading music');
        console.log(error)
    }
};

  return (
    <PageContainer>
      <FormContainer>
        <Header>Upload Your Music</Header>
        <StyledForm onSubmit={handleSubmit}>
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
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="reggae">Reggae</option>
                <option value="hiphop">Hip-Hop</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="other">Other</option>
            </select>
          </FormField>
          <FormField>
            <label>MP3 File</label>
            <FileInput type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} accept=".mp3" />
          </FormField>
          <StyledButton type="submit">Upload Music</StyledButton>
        </StyledForm>
      </FormContainer>
    </PageContainer>
  );
};

export default MusicForm;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e2f, #252530);
  background-attachment: fixed;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  max-width: 500px;
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

const FileInput = styled.input`
  padding: 12px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
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
