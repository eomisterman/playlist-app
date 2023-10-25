const generateRandomString = (length) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
};

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function redirectToAuthCodeFlow() {
    const state = generateRandomString(16);
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);
    localStorage.setItem("state", state);

    const params = new URLSearchParams();
    params.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
    params.append("state", state);
    params.append("scope", import.meta.env.VITE_SPOTIFY_SCOPES);
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `${import.meta.env.VITE_SPOTIFY_AUTH_LINK}${params.toString()}`;
}

export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json();
    })
    .then(data => {
        const access_token = data.access_token;
        const expiration_time = Date.now() + (data.expires_in * 1000);

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("expiration_time", expiration_time);

        localStorage.removeItem("state");
        localStorage.removeItem("verifier");

        return data.access_token;
    })
    .catch(error => {
        console.error("Error fetching access token: ", error);
    });

    return result;
}

export function isTokenExpired() {
    const token = localStorage.getItem("access_token");
    const expiration_time = localStorage.getItem("expiration_time");
    return !token || Date.now() > expiration_time;
}

/**
 * GET - Current User's Profile
 * @returns {Promise} Profile object
 */
export async function getProfile() {
    const token = localStorage.getItem("access_token");

    if (isTokenExpired()) {
        console.log("token invalid, redirecting to auth");
        redirectToAuthCodeFlow();
    } else {
        const profile = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            return {
                id: data.id,
                name: data.display_name,
                href: data.href,
                uri: data.uri,
                email: data.email,
                images: data.images,
            };
        })
        .catch((error) => {
            console.error("Error fetching profile: ", error);
        });
    
        return profile;
    }
}

/**
 * GET - Search for tracks
 * @param {String} query Search query
 * @returns {Promise} Search results
 */
export async function getSearchTracks(query) {
    const token = localStorage.getItem("access_token");
    const encodedQuery = encodeURIComponent(query);

    if (isTokenExpired()) {
        console.log("token invalid, redirecting to auth");
        redirectToAuthCodeFlow();
    } else {
        const searchResults = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            let tracks = data.tracks.items.map((track) => {
                return {
                    id: track.id,
                    name: track.name,
                    href: track.href,
                    uri: track.uri,
                    artists: track.artists.map((artist) => {
                        return {
                            id: artist.id,
                            name: artist.name,
                            href: artist.href,
                            uri: artist.uri
                        }
                    }),
                    album: {
                        id: track.album.id,
                        name: track.album.name,
                        href: track.album.href,
                        uri: track.album.uri
                    },
                }
            });

            return tracks;
        })
        .catch((error) => {
            console.error("Error fetching search results: ", error);
        });
    
        return searchResults;
    }
}

/**
 * GET - User's Playlists
 * @returns {Promise} Playlists
 */
export async function getUserPlaylists() {
    const token = localStorage.getItem("access_token");

    if (isTokenExpired()) {
        console.log("token invalid, redirecting to auth");
        redirectToAuthCodeFlow();
    } else {
        const playlists = await fetch("https://api.spotify.com/v1/me/playlists", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            let listPlaylists = data.items.map((playlist) => {
                return {
                    id: playlist.id,
                    name: playlist.name,
                    description: playlist.description,
                    href: playlist.href,
                    uri: playlist.uri,
                    images: playlist.images,
                    owner: {
                        id: playlist.owner.id,
                        name: playlist.owner.display_name,
                        href: playlist.owner.href,
                        uri: playlist.owner.uri
                    },
                    tracks: {
                        href: playlist.tracks.href,
                        total: playlist.tracks.total
                    }
                }
            });

            let playlists = {
                href: data.href,
                items: listPlaylists,
                limit: data.limit,
                next: data.next,
                offset: data.offset,
                previous: data.previous,
                total: data.total,
            };

            return playlists;
        })
        .catch((error) => {
            console.error("Error fetching playlists: ", error);
        });
    
        return playlists;
    }
}

/**
 * GET - User's Top Tracks
 * @param {String} time_range Time range of top tracks
 * @returns {Promise} Top tracks
 */
export async function getUserTopTracks(time_range) {
    const token = localStorage.getItem("access_token");

    if (isTokenExpired()) {
        console.log("token invalid, redirecting to auth");
        redirectToAuthCodeFlow();
    } else {
        const topTracks = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=25`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            let tracks = data.items.map((track) => {
                return {
                    id: track.id,
                    name: track.name,
                    href: track.href,
                    uri: track.uri,
                    artists: track.artists.map((artist) => {
                        return {
                            id: artist.id,
                            name: artist.name,
                            href: artist.href,
                            uri: artist.uri
                        }
                    }),
                    album: {
                        id: track.album.id,
                        name: track.album.name,
                        href: track.album.href,
                        uri: track.album.uri
                    },
                }
            });

            return tracks;
        })
        .catch((error) => {
            console.error("Error fetching top tracks: ", error);
        });
    
        return topTracks;
    }
}

/**
 * GET - User's Top Artists
 * @param {String} time_range Time range of top artists
 * @returns {Promise} Top artists
 */
export async function getUserTopArtists(time_range) {
    const token = localStorage.getItem("access_token");

    if (isTokenExpired()) {
        console.log("token invalid, redirecting to auth");
        redirectToAuthCodeFlow();
    } else {
        const topArtists = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=25`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            let artists = data.items.map((artist) => {
                return {
                    id: artist.id,
                    name: artist.name,
                    href: artist.href,
                    uri: artist.uri,
                    genres: artist.genres,
                    images: artist.images,
                }
            });

            return artists;
        })
        .catch((error) => {
            console.error("Error fetching top artists: ", error);
        });
    
        return topArtists;
    }
}