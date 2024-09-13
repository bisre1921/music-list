import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusics } from '../redux/musicsSlice';
import styled from '@emotion/styled';
import { FaPlay, FaPause, FaEdit, FaTrash } from 'react-icons/fa';
import EditMusicForm from './EditMusicForm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MusicList = () => {
  const dispatch = useDispatch();
  const { musics, loading, error } = useSelector((state) => state.musics || []);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRefs = useRef({});

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    dispatch(fetchMusics());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load music data.");
    }
  }, [error]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const playMusic = (filename, id) => {
    try {
      if (playingMusicId && playingMusicId !== id) {
        stopMusic(playingMusicId);
      }

      const audio = new Audio(`${backendUrl}/api/musics/${filename}`);
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
        toast.info('Music has ended.');
      });
    } catch (err) {
      toast.error('Error playing the music.');
    }
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
      try {
        await axios.delete(`${backendUrl}/api/musics/${id}`);
        dispatch(fetchMusics());
        toast.success('Music deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete the music.');
      }
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

  const otherMusics = categorizedMusics['Other'] || [];
  delete categorizedMusics['Other'];

  return (
    <MusicListWrapper>
      <ToastContainer />
      <h1>Melody Mix</h1>
      {Object.entries(categorizedMusics).map(([category, musicList]) => (
        <MusicSection key={category}>
          <SectionTitle>{`${category} Musics`}</SectionTitle>
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
))}

        </MusicSection>
      )}

      {isEditing && selectedMusic && (
        <EditMusicForm music={selectedMusic} onClose={closeEditForm} />
      )}
    </MusicListWrapper>
  );
};

export default MusicList;


const MusicListWrapper = styled.div`
  padding: 20px;
  max-width: 1152px;
  margin: 0 auto;
  background: linear-gradient(145deg, #1a1a1a, #2b2b2b);
  color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  transition: background 0.3s ease;

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 2rem;
    color: #FFD700;
  }

  @media (max-width: 768px) {
    padding: 10px;
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const MusicSection = styled.div`
  margin-bottom: 20px;
  border-bottom: 2px solid #FFD700;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 10px;
  text-transform: capitalize;
  padding: 5px 0;
  display: inline-block;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const MusicDetails = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Info = styled.div`
  flex-grow: 1;
  margin-right: 20px;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  p {
    margin: 5px 0;
    color: #CCCCCC;
  }

  @media (max-width: 768px) {
    margin-right: 0;
    h3 {
      font-size: 1rem;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: #FFD700;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 10px;
  padding: 10px 15px;
  border-radius: 5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 8px 10px;
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

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TimeDisplay = styled.div`
  color: #FFD700;
  margin-bottom: 10px;
  font-size: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
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

  @media (max-width: 768px) {
    height: 6px;
  }
`;

const NoMusic = styled.p`
  text-align: center;
  color: #CCCCCC;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

