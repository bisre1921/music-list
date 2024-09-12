import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusics } from '../redux/musicsSlice';
import styled from '@emotion/styled';
import { FaPlay, FaPause, FaEdit, FaTrash } from 'react-icons/fa';
import EditMusicForm from './EditMusicForm';
import axios from 'axios';

const MusicList = () => {
  const dispatch = useDispatch();
  const { musics, loading } = useSelector((state) => state.musics || []);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRefs = useRef({}); 

  useEffect(() => {
    dispatch(fetchMusics());
  }, [dispatch]);

  const playMusic = (filename, id) => {
    if (playingMusicId && playingMusicId !== id) {
      stopMusic(playingMusicId);
    }

    const audio = new Audio(`http://localhost:8000/api/musics/${filename}`);
    audioRefs.current[id] = audio;

    audio.play();
    setPlayingMusicId(id);
    setIsPaused(false); 
    setAudioElement(audio);

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setPlayingMusicId(null);
      setIsPaused(false);
      delete audioRefs.current[id]; 
      setCurrentTime(0);
    });
  };

  const stopMusic = (id) => {
    if (audioRefs.current[id]) {
      audioRefs.current[id].pause();
      delete audioRefs.current[id]; 
      setPlayingMusicId(null);
      setIsPaused(false); 
      setCurrentTime(0);
      setAudioElement(null); 
    }
  };

  const pauseMusic = (id) => {
    if (audioRefs.current[id]) {
      audioRefs.current[id].pause(); 
      setIsPaused(true); 
    }
  };

  const resumeMusic = (id) => {
    if (audioRefs.current[id]) {
      audioRefs.current[id].play(); 
      setIsPaused(false); 
    }
  };

  const handleEditClick = (music) => {
    setSelectedMusic(music);
    setIsEditing(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this music?')) {
      await axios.delete(`http://localhost:8000/api/musics/${id}`);
      dispatch(fetchMusics());
    }
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setSelectedMusic(null);
  };

  const handleProgressChange = (e) => {
    const value = e.target.value;
    if (audioElement) {
      audioElement.currentTime = (value / 100) * duration; 
      setCurrentTime(audioElement.currentTime);
    }
  };

  const categorizedMusics = musics.reduce((acc, music) => {
    const category = music.musicType || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(music);
    return acc;
  }, {});

  return (
    <MusicListWrapper>
      <h1>Music Collection</h1>
      {Object.entries(categorizedMusics).map(([category, musicList]) => (
        <MusicSection key={category}>
          <SectionTitle>{category}</SectionTitle>
          {musicList.length > 0 ? (
            musicList.map((music) => (
              <MusicItem key={music._id}>
                <MusicDetails>
                  <Info>
                    <h3>{music.title}</h3>
                    <p>Artist: {music.artist}</p>
                  </Info>
                  <Actions>
                    {playingMusicId === music._id ? (
                      <>
                        <ControlButton onClick={() => pauseMusic(music._id)}>
                          <FaPause />
                        </ControlButton>
                      </>
                    ) : (
                      <ControlButton onClick={() => playMusic(music.filename, music._id)}>
                        <FaPlay />
                      </ControlButton>
                    )}
                    <ControlButton onClick={() => handleEditClick(music)}>
                      <FaEdit />
                    </ControlButton>
                    <ControlButton onClick={() => handleDeleteClick(music._id)}>
                      <FaTrash />
                    </ControlButton>
                  </Actions>
                </MusicDetails>
                {(playingMusicId === music._id || audioRefs.current[music._id]) && (
                  <AudioPlayer>
                    <TimeDisplay>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </TimeDisplay>
                    <ControlButtons>
                      {playingMusicId === music._id && isPaused ? (
                        <ControlButton onClick={() => resumeMusic(music._id)}>
                          <FaPlay />
                        </ControlButton>
                      ) : (
                        <ControlButton onClick={() => pauseMusic(music._id)}>
                          <FaPause />
                        </ControlButton>
                      )}
                      <ControlButton onClick={() => stopMusic(music._id)}>
                        Stop
                      </ControlButton>
                    </ControlButtons>
                    <ProgressBar
                      type="range"
                      value={(currentTime / duration) * 100 || 0}
                      onChange={handleProgressChange}
                    />
                  </AudioPlayer>
                )}
              </MusicItem>
            ))
          ) : (
            <NoMusic>No {category} music found</NoMusic>
          )}
        </MusicSection>
      ))}
      {isEditing && selectedMusic && (
        <EditMusicForm music={selectedMusic} onClose={closeEditForm} />
      )}
    </MusicListWrapper>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default MusicList;

const MusicListWrapper = styled.div`
  padding: 40px;
  background: linear-gradient(145deg, #2f2f42, #1f1f2e);
  color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
`;

const MusicSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #FFD700;
  font-size: 2.5rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 10px;
`;

const MusicItem = styled.div`
  background: rgba(50, 50, 60, 0.8);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: rgba(60, 60, 80, 0.8);
  }
`;

const MusicDetails = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Info = styled.div`
  h3 {
    margin: 0;
    color: #FFD700;
  }
  p {
    margin: 0;
    color: #ccc;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: none;
  color: #FFD700;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

const AudioPlayer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TimeDisplay = styled.span`
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const ProgressBar = styled.input`
  type: range;
  width: 100%;
  cursor: pointer;
  margin-top: 5px;
`;

const NoMusic = styled.p`
  color: #ccc;
  font-size: 1.2rem;
  text-align: center;
`;
