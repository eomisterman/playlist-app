import { Link, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { 
  getProfile,
  getAccessToken, 
  redirectToAuthCodeFlow, 
  getSearchTracks, 
  getUserPlaylists,
  getUserTopTracks,
  getUserTopArtists,
  getGenreSeeds,
  getUsersLikedSongs
} from './util/Spotify';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/top-songs" element={<TopSongs />} />
          <Route path="/top-artists" element={<TopArtists />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/liked-songs" element={<LikedSongs />} />
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
      <Link className="block" to="/playlists">Playlists</Link>
      <Link className="block" to="/top-songs">Top Songs</Link>
      <Link className="block" to="/top-artists">Top Artists</Link>
      <Link className="block" to="/genres">Genres</Link>
      <Link className="block" to="/liked-songs">Liked Songs</Link>
      {/* <h3>Hover (Radio)</h3>
      <button>Log out</button> */}
    </section>
  );
}

/**
 * Landing page component
 * Redirects to login if no access token is found
 * @todo: UI to introduce the app
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
        console.log(profile);
        setProfile(profile);
      });
    }
  }, [navigate]);

  return (
    <>
      <h2 className="m-2">Home</h2>
      {profile && <p>{profile.name}</p>}
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile().then((user) => {
      setUser(user);
    })
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <h3>{user && user.name}</h3>
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
            <Card key={result.id} type="track" name={result.name} detailList={result.artists} />
          );
        })}
      </section>
    </>
  );
}

const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    getUserPlaylists().then((playlists) => {
      setPlaylists(playlists);
    });
  }, []);

  return (
    <>
      <h1>Playlists</h1>
      {playlists && playlists.items.map((playlist) => {
        return (
          <Card key={playlist.id} type="playlist" name={playlist.name} detailList={[playlist.tracks.total, playlist.description]} />
        );
      })}
    </>
  );
}

const TopSongs = () => {
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    getUserTopTracks("long_term").then((topTracks) => {
      setTopTracks(topTracks);
    });
  }, []);

  return (
    <main className="">
      {topTracks && topTracks.map((track) => {
        return (
          <Card key={track.id} type="track" name={track.name} detailList={track.artists} />
        );
      })}
    </main>
  );
}

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);

  useEffect(() => {
    getUserTopArtists("long_term").then((topArtists) => {
      setTopArtists(topArtists);
    });
  }, []);
  return (
    <>
      <h1>Top Artists</h1>
      {topArtists && topArtists.map((artist) => {
        return (
          <Card key={artist.id} type="artist" name={artist.name} detailList={artist.genres} />
        );
      })}
    </>
  );
}

const Card = ({ type, name, detailList }) => {
  return (
    <dl className="my-4">
      <dt className="block hyphens-auto">{name}</dt>
      {detailList.map((detail) => {
        return (
          type == "track" ? 
            <dd key={detail.id} className="inline hyphens-auto mr-2">{detail.name}</dd> :
            <dd key={detail} className="inline hyphens-auto mr-2">{detail}</dd>
        );
      })}
    </dl>
  
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  detailList: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
}

const Genres = () => {
  const [genres, setGenres] = useState(null);

  useEffect(() => {
    getGenreSeeds().then((genres) => {
      setGenres(genres);
    });
  }, []);

  return (
    <>
      <h1>Genres</h1>
      {genres && genres.map((genre) => {
        return (
          <dl key={genre} className="block">
            <dt className="inline mx-1">{genre}</dt>
          </dl>
        );
      })}
    </>
  );
}

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState(null);

  useEffect(() => {
    getUsersLikedSongs().then((likedSongs) => {
      setLikedSongs(likedSongs);
    });
  }, []);

  return (
    <main className="grid grid-cols-2 gap-2">
      {likedSongs && likedSongs.items.map((song) => {
        return (
          <Card key={song.id} type="track" name={song.name} detailList={song.artists} />
        );
      })}
    </main>
  );
}

const NoMatch = () => {
  return (
    <h1>404: Nothing to see here</h1>
  );
}

export default App;