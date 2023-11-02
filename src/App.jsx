import { Link, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import {
  getProfile,
  getAccessToken,
  getGenreSeeds,
  getUsersLikedSongs,
} from "./util/Spotify";
import { useEffect, useState } from "react";
import { Flex, Box, Container } from "@chakra-ui/react";
import MusicCard from "./MusicCard";
import Search from "./Search";
import Login from "./Login";
import TopSongs from "./TopSongs";
import TopArtists from "./TopArtists";
import Playlists from "./Playlists";

const App = () => {
  return (
    <section id="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route element={<Layout />}>
          <Route index path="/" element={<Home />} />
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
};

/**
 * Layout component
 * Wraps all other components
 **/
const Layout = () => {
  return (
    <Flex>
      <Sidebar />
      <Outlet />
    </Flex>
  );
};

/**
 * Sidebar navigation
 * Turn into hamburger menu when screen size shrinks
 **/
const Sidebar = () => {
  return (
    <Flex h={"95vh"} flexDir={"column"} w={[24, 36, 48]} m={[6, 8, 10]} pt={8}>
      <Box mt={12} mb={8}>
        <Link to="/">Home</Link>
      </Box>
      <Box mb={8}>
        <Link to="/profile">Profile</Link>
      </Box>
      {/* <Link>Drafts</Link> */}
      <Box mb={8}>
        <Link to="/search">Search</Link>
      </Box>
      <Box mb={8}>
        <Link to="/playlists">Playlists</Link>
      </Box>
      <Box mb={8}>
        <Link to="/top-songs">Top Songs</Link>
      </Box>
      <Box mb={8}>
        <Link to="/top-artists">Top Artists</Link>
      </Box>
      <Box mb={8}>
        <Link to="/genres">Genres</Link>
      </Box>
      <Box mb={8}>
        <Link to="/liked-songs">Liked Songs</Link>
      </Box>
      {/* <h3>Hover (Radio)</h3>
      <button>Log out</button> */}
    </Flex>
  );
};

/**
 * Landing page component
 * Redirects to login if no access token is found
 * @todo: UI to introduce the app
 */
const Home = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      console.log("No token, redirecting to login");
      navigate("/login");
    } else {
      getProfile().then((profile) => {
        console.log(profile);
        setProfile(profile);
      });
    }
  }, [navigate]);

  return <Flex>{profile && <p>{profile.name}</p>}</Flex>;
};

const Callback = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const responseState = params.get("state");
  const localState = localStorage.getItem("state");

  useEffect(() => {
    if (code && responseState === localState) {
      getAccessToken(code)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
          navigate("/login");
        });
    } else {
      throw new Error("Invalid state or code");
    }
  }, [code, responseState, localState, navigate]);
};

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <h3>{user && user.name}</h3>
    </>
  );
};

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
      {genres &&
        genres.map((genre) => {
          return (
            <dl key={genre}>
              <dt>{genre}</dt>
            </dl>
          );
        })}
    </>
  );
};

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState(null);

  useEffect(() => {
    getUsersLikedSongs().then((likedSongs) => {
      setLikedSongs(likedSongs);
    });
  }, []);

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <Container maxW={"container.lg"}>
      {likedSongs &&
        likedSongs.items.map((track, index) => {
          return (
            <MusicCard
              key={track.id}
              id={track.id}
              index={index + 1}
              type="track"
              name={track.name}
              detailList={track.artists}
              images={track.album.images}
              handleClick={() => {
                handleClick();
              }}
            />
          );
        })}
    </Container>
  );
};

const NoMatch = () => {
  return <h1>404: Nothing to see here</h1>;
};

export default App;
