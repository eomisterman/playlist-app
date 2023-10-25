import { Link, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { 
  getProfile,
  getAccessToken, 
  redirectToAuthCodeFlow, 
  getSearchTracks } from './util/Spotify';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const App = () => {
return (
    <section id="app" className='flex m-8'>
      <Sidebar />
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </section>
  );
}

/**
 * Layout component
 * Wraps all other components
 **/
const Layout = () => {
  return (
    <section id="layout" className="basis-auto p-2">
      <h1 className="mb-8">Layout Wrapper</h1>
      <main>
        <Outlet />
      </main>
    </section>
  );
}

/**
 * Sidebar navigation
 * Turn into hamburger menu when screen size shrinks
 **/
const Sidebar = () => {
  return (
    <section id="sidebar" className="basis-48 block p-2">
      <h1 className="mb-8">Sidebar</h1>
      <Link className="block" to="/">Home</Link>
      <Link className="block" to="/profile">Profile</Link>
      {/* <Link className="block">Drafts</Link> */}
      <Link className="block" to="/search">Search</Link>
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

/**
 * Landing page component
 * Redirects to login if no access token is found
 */
const Home = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      console.log('No token, redirecting to login');
      navigate('/login');
    } else {
      getProfile().then((profile) => {
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
    getProfile().then((profile) => {
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

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  const handleUpdateSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearch = () => {
    getSearchTracks(searchTerm).then((results) => {
      setSearchResults(results);
    }).catch((error) => {
      throw new Error("Error fetching search results: ", error);
    });
  }

  const buttonIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />

  return (
    <>
      <h1 className="block">Search Component</h1>
      <label htmlFor="search" className="block">Search</label>
      <input id="search" 
        className="inline-block" 
        type="text" 
        size="15" 
        placeholder="Search for music..." 
        onChange={handleUpdateSearchTerm} />
      <button 
        className="inline-block" 
        onClick={handleSearch} >
          {buttonIcon}
      </button>
      <section id="search-results" className="inline">
        <h2>Search Results</h2>
        {searchResults && searchResults.map((result) => {
          return (
            <dl key={result.id} className="block">
              <dt className="inline mx-1">{result.name}</dt>
              <span>-</span>
              {result.artists.map((artists) => {
                return (
                  <dd key={artists.id} className="inline mx-1">{artists.name}</dd>
                );
              })}
            </dl>
          );
        })}
      </section>
    </>
  );
}

const NoMatch = () => {
  return (
    <h1>404: Nothing to see here</h1>
  );
}

export default App;