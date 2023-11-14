import { useState, useEffect } from "react";
import { getSearchTracks } from "./util/Spotify";
import { Flex, Center, Input, Text, Button, Box } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
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

  return (
    <Flex id="Search-Box" p={4} flexDir="column" width="100%">
      <Flex margin="0 auto" mb={3} h={16}>
        <Center h="100%">
          <Flex
            flex="1 1 20rem"
            h="fit-content"
            p={2}
            borderRadius="full"
            bg="gray.200"
            _hover={{ border: "1px solid", borderColor: "blackAlpha.200" }}
          >
            <Center>
              <Search2Icon boxSize={4} m={2} />
            </Center>
            <Input
              id="search"
              size="sm"
              variant="unstyled"
              ml={2}
              mr={3}
              placeholder="Search for music..."
              onChange={handleUpdateSearchTerm}
              onKeyUpCapture={(event) => {
                event.preventDefault();
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </Flex>
        </Center>
      </Flex>

      <Box id="Search-Results">
        {searchResults &&
          searchResults.map((result, index) => {
            return (
              <MusicCard
                key={result.id}
                id={result.id}
                index={index + 1}
                type="track"
                name={result.name}
                detailList={result.artists}
                images={result.album.images}
              />
            );
          })}
      </Box>
    </Flex>
  );
};

export default Search;
