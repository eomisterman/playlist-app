import { Link, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import {
  getProfile,
  getAccessToken,
  getSearchTracks,
  getUserPlaylists,
  getUserTopTracks,
  getUserTopArtists,
  getGenreSeeds,
  getUsersLikedSongs,
  getPlaylistTracks,
  getTrackRecFromTrack,
} from "./util/Spotify";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  Flex,
  Container,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Login } from "./Login";

const App = () => {
  return (
    <section id="app">
      {/* <Sidebar /> */}
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

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  const handleUpdateSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    getSearchTracks(searchTerm)
      .then((results) => {
        setSearchResults(results);
      })
      .catch((error) => {
        throw new Error("Error fetching search results: ", error);
      });
  };

  const buttonIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />;

  return (
    <>
      <h1>Search Component</h1>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        size="15"
        placeholder="Search for music..."
        onChange={handleUpdateSearchTerm}
      />
      <button onClick={handleSearch}>{buttonIcon}</button>
      <section id="search-results">
        <h2>Search Results</h2>
        {searchResults &&
          searchResults.map((result) => {
            return (
              <MusicCard
                key={result.id}
                type="track"
                name={result.name}
                detailList={result.artists}
              />
            );
          })}
      </section>
    </>
  );
};

/**
 * @TODO
 * onClick handler for playlist cards resulted in 429 error
 * Need to investigate why repeat requests are happening for all playlists
 * after clicking one playlist card.
 */
const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null);

  useEffect(() => {
    getUserPlaylists().then((playlists) => {
      setPlaylists(playlists);
    });
  }, []);

  const handleSelectPlaylist = (playlistId) => {
    getPlaylistTracks(playlistId).then((tracks) => {
      setSelectedPlaylistTracks(tracks);
    });
  };

  return (
    <>
      <h1>Playlists</h1>
      {playlists &&
        playlists.items.map((playlist) => {
          return (
            <MusicCard
              key={playlist.id}
              id={playlist.id}
              type="playlist"
              name={playlist.name}
              detailList={[playlist.tracks.total, playlist.description]}
              handleClick={() => {
                handleSelectPlaylist(playlist.id);
              }}
            />
          );
        })}
      {selectedPlaylistTracks &&
        selectedPlaylistTracks.items.map((track) => {
          return (
            <MusicCard
              key={track.id}
              id={track.id}
              type={track.type}
              name={track.name}
              detailList={track.artists}
            />
          );
        })}
    </>
  );
};

const TopSongs = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [generatedRecs, setGeneratedRecs] = useState([]);

  useEffect(() => {
    getUserTopTracks("long_term").then((topTracks) => {
      setTopTracks(topTracks);
    });
  }, []);

  const handleGenerateRecs = (trackId) => {
    getTrackRecFromTrack(trackId).then((recs) => {
      setGeneratedRecs([...generatedRecs, recs]);
    });
  };

  return (
    <Container maxW={"container.lg"} bg={"purple.100"}>
      {topTracks &&
        topTracks.map((track) => {
          return (
            <MusicCard
              key={track.id}
              id={track.id}
              type="track"
              name={track.name}
              detailList={track.artists}
              handleClick={() => {
                handleGenerateRecs(track.id);
              }}
            />
          );
        })}
      {generatedRecs &&
        generatedRecs.map((recs) => {
          recs.map((rec) => {
            return (
              <MusicCard
                key={rec.id}
                type={rec.type}
                name={rec.name}
                detailList={rec.artists}
              />
            );
          });
        })}
    </Container>
  );
};

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [generatedRecs, setGeneratedRecs] = useState([]);

  useEffect(() => {
    getUserTopArtists("long_term").then((topArtists) => {
      setTopArtists(topArtists);
    });
  }, []);

  const handleGenerateRecs = (artistId) => {
    console.log("Handling generate recs for artist: ", artistId);
    getTrackRecFromTrack(artistId).then((recs) => {
      if (recs) {
        setGeneratedRecs([...generatedRecs, recs]);
      }
    });
  };

  return (
    <>
      <h1>Top Artists</h1>
      {topArtists &&
        topArtists.map((artist) => {
          return (
            <MusicCard
              key={artist.id}
              id={artist.id}
              type={artist.type}
              name={artist.name}
              detailList={artist.genres}
              handleClick={() => {
                handleGenerateRecs(artist.id);
              }}
            />
          );
        })}
      {generatedRecs &&
        generatedRecs.map((recs) => {
          recs.map((rec) => {
            return (
              <MusicCard
                key={rec.id}
                type={rec.type}
                name={rec.name}
                detailList={rec.artists}
              />
            );
          });
        })}
    </>
  );
};

const MusicCard = ({ type, name, detailList, handleClick }) => {
  return (
    <Card onClick={handleClick} my={1}>
      <CardBody>
        <Heading size={"sm"}>{name}</Heading>
        {detailList.map((detail, index) => {
          return type == "track" ? (
            <Text key={detail.id} display={"inline"}>{`${index ? ", " : ""}${
              detail.name
            }`}</Text>
          ) : (
            <Text key={detail}>
              `${index ? ", " : ""}${detail}`
            </Text>
          );
        })}
      </CardBody>
    </Card>
  );
};

MusicCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  detailList: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
};
/**
 * 
 *    <Header size={"sm"}>{name}</Header>
        {detailList.map((detail) => {
          return type == "track" ? (
            <Text key={detail.id}>{detail.name}</Text>
          ) : (
            <Text key={detail}>{detail}</Text>
          );
        })}
 */

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

  return (
    <main>
      {likedSongs &&
        likedSongs.items.map((song) => {
          return (
            <MusicCard
              key={song.id}
              type="track"
              name={song.name}
              detailList={song.artists}
            />
          );
        })}
    </main>
  );
};

const NoMatch = () => {
  return <h1>404: Nothing to see here</h1>;
};

export default App;
