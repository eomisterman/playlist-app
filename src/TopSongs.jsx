import { useState, useEffect } from "react";
import { getUserTopTracks, getTrackRecFromTrack } from "./util/Spotify";
import { Container } from "@chakra-ui/react";
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

export default TopSongs;
