import styled from '@emotion/styled';
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom'; 

const NavBar = () => {
  return (
    <NavigationContainer>
      <LogoContainer>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </LogoContainer>
      <ButtonContainer>
        <Link to="/post-music"> 
          <PostMusicButton>
            Post Music
          </PostMusicButton>
        </Link>
      </ButtonContainer>
    </NavigationContainer>
  );
};

export default NavBar;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 1152px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  img {
    height: 60px;
    width: auto;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PostMusicButton = styled.button`
  background-color: goldenrod;
  color: black;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #FFD700;
    transform: scale(1.05);
  }
`;