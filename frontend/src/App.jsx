import MusicForm from "./components/MusicForm"
import MusicList from "./components/MusicList"
import NavBar from "./components/Navbar"
import styled from '@emotion/styled';
import "./index.css"

function App() {
  return (
    <AppContainer>
      <NavBar />
      <MusicForm />
      <MusicList />
    </AppContainer>
  )
}

export default App

const AppContainer = styled.div`
  background-color: black;
  color: goldenrod;
`
