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

  // Categorize musics
  const categorizedMusics = musics.reduce((acc, music) => {
    const category = music.musicType || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(music);
    return acc;
  }, {});

  // Separate 'Other' category musics
  const otherMusics = categorizedMusics['Other'] || [];
  delete categorizedMusics['Other'];

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
                      <ControlButton onClick={() => pauseMusic(music._id)}>
                        <FaPause />
                      </ControlButton>
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

      {/* Render Other category musics last */}
      {otherMusics.length > 0 && (
        <MusicSection>
          <SectionTitle>Other</SectionTitle>
          {otherMusics.map((music) => (
            <MusicItem key={music._id}>
              <MusicDetails>
                <Info>
                  <h3>{music.title}</h3>
                  <p>Artist: {music.artist}</p>
                </Info>
                <Actions>
                  {playingMusicId === music._id ? (
                    <ControlButton onClick={() => pauseMusic(music._id)}>
                      <FaPause />
                    </ControlButton>
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
                    <ControlButton onClick={() => (playingMusicId === music._id ? pauseMusic(music._id) : resumeMusic(music._id))}>
                      {playingMusicId === music._id && !isPaused ? <FaPause /> : <FaPlay />}
                    </ControlButton>
                    <ControlButton onClick={() => stopMusic(music._id)}>
                      Stop
                    </ControlButton>
                  </ControlButtons>
                  <ProgressBar
                    type="range"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleProgressChange}
                  />
                  <VolumeControl
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => {
                      if (audioElement) {
                        audioElement.volume = e.target.value;
                      }
                    }}
                  />
                </AudioPlayer>
              )}
            </MusicItem>
          ))}
        </MusicSection>
      )}

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
  max-width: 1152px; /* Set maximum width */
  margin: 0 auto; /* Center the content */
  background: linear-gradient(145deg, #1a1a1a, #2b2b2b);
  color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  transition: background 0.3s ease;
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5rem;
    color: #FFD700;
  }
`;

const MusicSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #FFD700;
  display: inline-block;
`;

const MusicItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: #2b2b2b;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const MusicDetails = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`;

const Info = styled.div`
  flex-grow: 1;
  margin-right: 20px;
  
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 5px 0;
    color: #CCCCCC;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: #FFD700;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 10px;
  padding: 10px 15px; /* Optional, can add for a better look */
  border-radius: 5px; /* Optional for rounded edges */
  transition: color 0.3s ease;

  &:hover {
    color: #FFC300;
  }
`;


const AudioPlayer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding: 15px;
  background: #333;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
`;

const TimeDisplay = styled.div`
  color: #FFD700;
  margin-bottom: 10px;
  font-size: 1rem;
  text-align: center;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProgressBar = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #444;
  border-radius: 5px;
  outline: none;
  margin-bottom: 10px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
  }
`;

const VolumeControl = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #444;
  border-radius: 5px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
  }
`;

const NoMusic = styled.p`
  text-align: center;
  color: #CCCCCC;
  font-size: 1.2rem;
`;
