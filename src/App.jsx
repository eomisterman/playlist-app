import { NavLink, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import {
  getProfile,
  getAccessToken,
  getGenreSeeds,
  getUsersLikedSongs,
} from "./util/Spotify";
import { useEffect, useState } from "react";
import { Flex, Box, Container, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faMagnifyingGlass,
  faFolder,
  faRecordVinyl,
  faMicrophoneLines,
  faFolderTree,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
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
    <Flex p={2} h={"100vh"} backgroundColor={"gray.100"}>
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
    <Container
      maxW={"48"}
      shadow={"lg"}
      backgroundColor={"gray.50"}
      borderRadius={"md"}
    >
      <Flex flexDir={"column"} minW={"24"} mx={{ base: "4" }}>
        <Box mt={12} mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "" }}
            to="/"
          >
            <FontAwesomeIcon icon={faHouse} style={{ paddingRight: 4 }} />
            Home
          </Link>
        </Box>
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "bold" }}
            to="/profile"
          >
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: 4 }} />
            Profile
          </Link>
        </Box>
        {/* <Link>Drafts</Link> */}
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "bold" }}
            to="/search"
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ paddingRight: 4 }}
            />
            Search
          </Link>
        </Box>
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "bold" }}
            to="/playlists"
          >
            <FontAwesomeIcon icon={faFolder} style={{ paddingRight: 4 }} />
            Playlists
          </Link>
        </Box>
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "bold" }}
            to="/top-songs"
          >
            <FontAwesomeIcon icon={faRecordVinyl} style={{ paddingRight: 4 }} />
            Top Songs
          </Link>
        </Box>
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: 900 }}
            to="/top-artists"
          >
            <FontAwesomeIcon
              icon={faMicrophoneLines}
              style={{ paddingRight: 4 }}
            />
            Top Artists
          </Link>
        </Box>
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "bold" }}
            to="/genres"
          >
            <FontAwesomeIcon icon={faFolderTree} style={{ paddingRight: 4 }} />
            Genres
          </Link>
        </Box>
        <Box mb={8}>
          <Link
            as={NavLink}
            style={{ textDecoration: "none" }}
            _hover={{ color: "gray.500" }}
            _activeLink={{ fontWeight: "bold" }}
            to="/liked-songs"
          >
            <FontAwesomeIcon icon={faMusic} style={{ paddingRight: 4 }} />
            Liked Songs
          </Link>
        </Box>
        {/* <h3>Hover (Radio)</h3>
        <button>Log out</button> */}
      </Flex>
    </Container>
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
    <Container maxW={"container.lg"}>
      <Box p={4} shadow={"md"} borderRadius={"md"} backgroundColor={"gray.50"}>
        {genres &&
          genres.map((genre) => {
            return (
              <dl key={genre}>
                <dt>{genre}</dt>
              </dl>
            );
          })}
      </Box>
    </Container>
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
    <Container maxW={"container.lg"} pl={2} pr={0}>
      <Box p={4} shadow={"md"} borderRadius={"md"} backgroundColor={"gray.50"}>
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
      </Box>
    </Container>
  );
};

const NoMatch = () => {
  return <h1>404: Nothing to see here</h1>;
};

export default App;
