import MusicForm from "./components/MusicForm";
import MusicList from "./components/MusicList";
import NavBar from "./components/Navbar";
import { Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import "./index.css";

function App() {
  return (
    <AppContainer>
      <NavBar />
      <Routes>
        <Route path="/" element={<MusicList />} /> 
        <Route path="/post-music" element={<MusicForm />} /> 
      </Routes>
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  background-color: black;
  color: goldenrod;
`;
