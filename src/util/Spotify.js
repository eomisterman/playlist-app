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
    params.append("scope", "user-read-private user-read-email");
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

// Call Web API
export async function fetchProfile() {
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
            return data;
        })
        .catch((error) => {
            console.error("Error fetching profile: ", error);
        });
    
        return profile;
    }
}
