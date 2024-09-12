import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusics } from '../redux/musicsSlice';
import styled from '@emotion/styled';
import { FaPlay, FaPause, FaEdit, FaTrash } from 'react-icons/fa';
import EditMusicForm from './EditMusicForm';

const MusicListWrapper = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MusicItem = styled.div`
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const MusicDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Info = styled.div`
  text-align: left;
  font-family: 'Arial', sans-serif;
  h3 {
    margin: 0;
    font-size: 1.2em;
  }
  p {
    margin: 5px 0;
    font-size: 1em;
    color: #555;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  &:hover {
    color: #007bff;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #333;
  }
`;

const AudioPlayerWrapper = styled.div`
  width: 100%;
  .audio-player {
    width: 100%;
    border-radius: 20px;
    outline: none;
    box-shadow: none;
  }
`;

const MusicList = () => {
  const dispatch = useDispatch();
  const { musics, loading } = useSelector((state) => state.musics);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [editMusic, setEditMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef({}); // Object to store audio references

  useEffect(() => {
    dispatch(fetchMusics());
  }, [dispatch]);

  const handleEditClick = (music) => {
    setEditMusic(music);
  };

  const handlePlayPauseClick = (music) => {
    const audioRef = audioRefs.current[music._id]; // Get the corresponding audio ref

    // Check if the clicked music is the same as the current music
    if (currentMusic && currentMusic._id === music._id) {
      // If it is, toggle play/pause
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    } else {
      // If a different music item is clicked
      if (currentMusic) {
        const prevAudioRef = audioRefs.current[currentMusic._id];
        if (prevAudioRef) {
          prevAudioRef.pause(); // Pause the previously playing music
          prevAudioRef.currentTime = 0; // Reset to the start
        }
      }

      // Set the new current music and play it
      setCurrentMusic(music);
      setIsPlaying(true);
      audioRef.src = `http://localhost:8000/api/musics/${music.filename}`;
      audioRef.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  };

  return (
    <MusicListWrapper>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {editMusic && (
            <EditMusicForm music={editMusic} onClose={() => setEditMusic(null)} />
          )}
          {musics.map((music) => (
            <MusicItem key={music._id || music.filename || music.title}>
              <MusicDetails>
                <Info>
                  <h3>{music.title}</h3>
                  <p>Artist: {music.artist}</p>
                </Info>
                <ControlButtons>
                  <PlayButton onClick={() => handlePlayPauseClick(music)}>
                    {currentMusic && currentMusic._id === music._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </PlayButton>
                  <ActionButton onClick={() => handleEditClick(music)}>
                    <FaEdit /> 
                  </ActionButton>
                  <ActionButton onClick={() => dispatch({ type: 'musics/deleteMusicSaga', payload: music._id })}>
                    <FaTrash /> 
                  </ActionButton>
                </ControlButtons>
              </MusicDetails>
              <AudioPlayerWrapper>
                {/* Store reference to audio element for each music item */}
                <audio
                  ref={(el) => (audioRefs.current[music._id] = el)} // Save reference in the object
                  className="audio-player"
                  onEnded={() => {
                    setIsPlaying(false);
                    setCurrentMusic(null);
                  }}
                  controls
                />
              </AudioPlayerWrapper>
            </MusicItem>
          ))}
        </>
      )}
    </MusicListWrapper>
  );
};


export default MusicList;
