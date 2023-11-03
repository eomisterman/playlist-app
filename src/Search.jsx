import { useState, useEffect } from "react";
import { getSearchTracks } from "./util/Spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Container, Box } from "@chakra-ui/react";
import MusicCard from "./MusicCard";

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
    <Container maxW={"container.lg"} pl={2} pr={0}>
      <Box p={4} shadow={"md"} borderRadius={"md"} backgroundColor={"gray.50"}>
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
      </Box>
    </Container>
  );
};

export default Search;
