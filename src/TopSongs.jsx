import { useState, useEffect } from "react";
import { getUserTopTracks, getTrackRecFromTrack } from "./util/Spotify";
import { Container, Box } from "@chakra-ui/react";
import MusicCard from "./MusicCard";

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
    <Container id="TopSongsComponent" maxW={"container.lg"} pl={2} pr={0}>
      <Box p={4} shadow={"md"} borderRadius={"md"} backgroundColor={"gray.50"}>
        {topTracks &&
          topTracks.map((track, index) => {
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
                  handleGenerateRecs(track.id);
                }}
              />
            );
          })}
      </Box>
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

export default TopSongs;
