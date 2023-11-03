import { useState, useEffect } from "react";
import { getUserTopArtists, getTrackRecFromTrack } from "./util/Spotify";
import { Container, Box } from "@chakra-ui/react";
import MusicCard from "./MusicCard";

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
    <Container maxW={"container.lg"} pl={2} pr={0}>
      <Box p={4} shadow={"md"} borderRadius={"md"} backgroundColor={"gray.50"}>
        {topArtists &&
          topArtists.map((artist, index) => {
            return (
              <MusicCard
                key={artist.id}
                id={artist.id}
                index={index + 1}
                type={artist.type}
                name={artist.name}
                detailList={artist.genres}
                images={artist.images}
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
      </Box>
    </Container>
  );
};

export default TopArtists;
