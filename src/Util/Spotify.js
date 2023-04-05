
const clientId = '';
const redirectUri = 'http://slippery-light.surge.sh';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then((response) => {
      return response.json();
    }).then((jsonResponse) => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    })
  },

  savePlaylist(playlistName, tracksUri) {
    if (!playlistName || !tracksUri.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const header = {Authorization: `Bearer ${accessToken}`};
    let usersId;

    return fetch(`https://api.spotify.com/v1/me`, {headers: header})
    .then((response) => (response.json()))
    .then((jsonResponse) => {
      usersId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${usersId}/playlists`, {
        headers: header,
        method: 'POST',
        body: JSON.stringify({ name: playlistName })
      }).then((response) => {
        return response.json();
      }).then((jsonResponse) => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${usersId}/playlists/${playlistId}/tracks`, {
          headers: header,
          method: 'POST',
          body: JSON.stringify({ uris: tracksUri })
        })
      })
    })
  }
}

export default Spotify;
