const axios = require('axios');
const _ = require('lodash');

class SetlistService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.top = 9
    }

    spaceSetlistRetrieval = async(artist, index) => {
        return new Promise((resolve, reject) => {
            setTimeout(async() => {
                try {
                    resolve([await this.retrieveArtistSetlist(artist), artist]);
                } catch (error) {
                    reject(new Error('Some error'))
                }
            }, 2000*index )
        })
    }
    
    retrieveFestivalSetlists = async(artists) => {
        return Promise.all(artists.map((artist,index) => this.spaceSetlistRetrieval(artist, index)))
    };

    extractSongsNames = (songs) => {
        if (!songs) return [];
        return songs.map(song => song.name)
    }

    getAllSongsFromSetlists = (setlists) => {
        if (!setlists || ! _.isArray(setlists)) return []
        const songs = setlists.map(setlist => {
           return this.extractSongsNames(setlist?.sets?.set[0]?.song)
        });

        const flattenSongs = _.flattenDeep(songs)
        return flattenSongs;
    }

    countSongsBySetlist = (songsOfSetlists) => {
        return _.countBy(songsOfSetlists)
    }

    processArtistSetlist = (setlist, artist) => {
        const songsOfSetlists = this.getAllSongsFromSetlists(setlist);
        const songsOcurrences = this.countSongsBySetlist(songsOfSetlists);
        const ocurrencesPairs = this.sortObjectToPairs(songsOcurrences);
        return this.formatTopSongs(ocurrencesPairs, artist)
    }

    sortObjectToPairs = (countObject) => {
        const sorted = _(countObject)
        .toPairs()
        .orderBy([1], ['desc'])
        .value()
        return sorted;
    }


    formatSongs = (topSongs, artist) => {
        let result = {}
        topSongs.forEach(song => {
            result[song[0]] = artist
        });
        return result;
    }

    formatTopSongs = (topSongs, artist) => {
        return this.formatSongs(topSongs.slice(0, this.top), artist)
    }
    
    retrieveArtistSetlist = async(artist) => {
        const encodedArtist = encodeURIComponent(artist)
        const url = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodedArtist}`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'x-api-key': this.apiKey
            }
        }
        try {
            console.log('----RETRIEVING SETLIST FOR -------', artist);
            const result = await axios.get(url, config);
            const data = result.data;
            return data.setlist;
        } catch (error) {
            console.log('ERROR, unable to find setlist for', error, artist)
            return {};
        }
    }
}

module.exports.SetlistService = SetlistService;