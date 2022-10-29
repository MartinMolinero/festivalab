const axios = require('axios');
const _ = require('lodash');

class SpotifyService {
    constructor(apiKey, spotifyID, playlistName) {
        this.apiKey = apiKey;
        this.id = spotifyID;
        this.playlistName = playlistName
    }

    retrieveSongs = async(festivalsSongsObject) => {
        const songsAndArtists = Object.entries(festivalsSongsObject);
        return Promise.all(songsAndArtists.map((entry, index) => this.spaceSongRetrieval(entry[0], entry[1], index) ))
    }

    spaceSongRetrieval = async(song, artist, index) => {
        return new Promise((resolve, reject) => {
            setTimeout(async() => {
                try {
                    resolve(await this.searchSongInfo(song, artist));
                } catch (error) {
                    reject(new Error('Some error'))
                }
            }, 2000*index )
        })
    }

    createPlaylist = async() => {
        try {
            const url = `https://api.spotify.com/v1/users/${this.id}/playlists`
            const data = {
                name: this.playlistName,
                description: 'New playlist description',
                public: true
              }
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            }
            const result = await axios.post(url, data, config)
            return result.data.id
        } catch (error) {
            console.log('ERROR, unable to create setlist', error)
            return {};
        }
    }

    searchTracksByType = (allSongsTracks, type) => {
        return allSongsTracks.filter((songTrack) => songTrack.type === type)[0];
    }

    formatSongsURIs = (allSongsSpotifyArray) => {
        return allSongsSpotifyArray.map((song) => {
            return song.uri
        }).join(',')
    }

    searchSongInfo = async(song, artist) => {
        const query = `track: ${song} artist: ${artist}`
        const encodedQuery = encodeURIComponent(query)
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        }
        try {
            console.log('----RETRIEVING SPOTIFY SONG -------', song);
            const result = await axios.get(url, config);
            const data = result.data;
            return this.searchTracksByType(data.tracks.items, 'track');
        } catch (error) {
            console.log('ERROR, unable to find songs', error)
            return {};
        }
    }

    addSongsToPlaylist = async(songs, playlistId) => {
        const uris = this.formatSongsURIs(songs)
        const encodedUris = encodeURIComponent(uris)
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${encodedUris}`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        }
        console
        try {
            console.log('----ADDING SPOTIFY SONG -------');
            const result = await axios.post(url, null, config);
            const data = result.data;
            return data
        } catch (error) {
            console.log('ERROR, unable to add song', error)
            return {};
        }
    }
}

module.exports.SpotifyService = SpotifyService;