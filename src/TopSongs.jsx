import { useState, useEffect } from "react";
import { getUserTopTracks, getTrackRecFromTrack } from "./util/Spotify";
import { Box, Grid } from "@chakra-ui/react";
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
    <Grid id="Top-Songs-Box" p={4}
      gridTemplateColumns="repeat(2, 1fr)"
      gridAutoRows="48px"
      gridGap={2}
      px={4}
      py={8}
      w="full"
    >
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
    </Grid>
  );
};

export default TopSongs;
