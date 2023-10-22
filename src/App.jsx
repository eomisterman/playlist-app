import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { fetchProfile, getAccessToken, redirectToAuthCodeFlow } from './util/Spotify';
import { useEffect, useState } from 'react';

const App = () => {

  return (
    <>
      <h1 className="m-2">Playlist App</h1>
      <Navigation />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

const Sidebar = () => {
  /*
   * This component should be sidebar navigation
   * It should turn into hamburger menu when screen size shrinks
   */

  return (
    <section>
      <h1>Playlist App</h1>
      <Link>Drafts</Link>
      <Link>Search</Link>
      <Link>Playlists</Link>
      <Link>Top Songs</Link>
      <Link>Top Artists</Link>
      <Link>Genres</Link>
      <Link>Liked Songs</Link>
      {/* <h3>Hover (Radio)</h3>
      <button>Log out</button> */}
    </section>
  );
}

const Home = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
    }

    fetchProfile(token).then((profile) => {
      setProfile(profile);
    });
    
  }, [token, navigate]);

  return (
    <>
      <h2 className="m-2">Home</h2>
      {profile && <p>{profile.display_name}</p>}
    </>    
  );
}

const Login = () => {
  const handleSpotifyLogin = () => {
    redirectToAuthCodeFlow();
  }
  return (
    <>
      <h2 className="m-2">Login Component</h2>
      <button className="m-2" onClick={handleSpotifyLogin}>
        Login With Spotify
      </button>
    </>
  );
}

const Callback = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const responseState = params.get('state');
  const localState = localStorage.getItem('state');

  useEffect(() => {
    if (code && responseState === localState) {
      getAccessToken(code).then(() => {
        navigate("/");
      }).catch((error) => {
        console.error(error);
        navigate('/login');
      });
    } else {
      throw new Error('Invalid state or code');
    }
  }, [code, responseState, localState, navigate]);

}

const Navigation = () => {
  return (
    <nav className="">
      <Link to="/" className="m-2">Home</Link>
      <Link to="/login" className="m-2">Login</Link>
    </nav>
  );
}

const NoMatch = () => {
  return (
    <h1>404: Nothing to see here</h1>
  );
}

export default App;