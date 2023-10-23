import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { fetchProfile, getAccessToken, redirectToAuthCodeFlow } from './util/Spotify';
import { useEffect, useState } from 'react';

const App = () => {
return (
    <section className='flex'>
      <Sidebar />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </section>
  );
}

/*
 *
 * Sidebar navigation
 * Turn into hamburger menu when screen size shrinks
 * 
 */
const Sidebar = () => {
  return (
    <section id="sidebar" className="basis-48 block">
      <h1>Playlist App</h1>
      <Link className="block" to="/">Home</Link>
      <Link className="block" to="/profile">Profile</Link>
      {/* <Link className="block">Drafts</Link> */}
      <Link className="block">Search</Link>
      <Link className="block">Playlists</Link>
      <Link className="block">Top Songs</Link>
      <Link className="block">Top Artists</Link>
      <Link className="block">Genres</Link>
      <Link className="block">Liked Songs</Link>
      {/* <h3>Hover (Radio)</h3>
      <button>Log out</button> */}
    </section>
  );
}

const Home = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      console.log('No token, redirecting to login');
      navigate('/login');
    } else {
      fetchProfile().then((profile) => {
        setProfile(profile);
      });
    }
  }, [navigate]);

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

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile().then((profile) => {
      setProfile(profile);
    }).catch((error) => {
      throw new Error("Error fetching profile: ", error);
    })
  }, []);
  return (
    <>
      <h1>Profile</h1>
      <h3>{profile && profile.display_name}</h3>
    </>
  );
};

const NoMatch = () => {
  return (
    <h1>404: Nothing to see here</h1>
  );
}

export default App;