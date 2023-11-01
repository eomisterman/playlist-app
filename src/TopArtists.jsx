import { useState, useEffect } from "react";
import { getUserTopArtists, getTrackRecFromTrack } from "./util/Spotify";
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

export default TopArtists;
