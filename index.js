const { SetlistService } = require("./services/setlistService");
const { SpotifyService } = require("./services/spotifyService");
const utils = require('./utils/utils')


const execute = async(artistFile, setlistToken, spotifyToken, spotifyID) => {
    // 1- read file
    const fileContent = require(artistFile);
    // 2- create data structure to manage artist
    const setlistService = new SetlistService(setlistToken);
    // 3- retrieve setlist
    const allArtistsShows = await setlistService.retrieveFestivalSetlists(fileContent.artists);
    const onlyCorrectShows = allArtistsShows.filter(shows => shows.length > 0)
    
    // 4- get top songs
    const topSongsByArtist = onlyCorrectShows.map((artistInfo) => setlistService.processArtistSetlist(artistInfo[0], artistInfo[1]))
    
    // 5- format objects
    const allTopSongs = utils.mergeObjectsInsideArray(topSongsByArtist)
    const spotifyService = new SpotifyService(spotifyToken, spotifyID, fileContent.festivalName);
    // 7- search in spotify
    const allSongsInfo = await spotifyService.retrieveSongs(allTopSongs);
    // 10- create pl
    const playlistId = await spotifyService.createPlaylist()
    // 11- add songs to playlist
    spotifyService.addSongsToPlaylist(allSongsInfo, playlistId)
}

module.exports.execute = execute