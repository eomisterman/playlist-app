import { useState, useEffect } from 'react';
import { getUserPlaylists, getPlaylistTracks } from './util/Spotify';
import MusicCard from './MusicCard';

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

export default Playlists;