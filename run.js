const index = require('./index');
require('dotenv').config();

const main = async() => {
    const spotifyToken = process.env.SPOTIFY_TOKEN
    const setlistToken = process.env.SETLIST_FM_API_KEY
    const artistFile = process.env.ARTIST_FILE
    const spotifyID = process.env.SPOTIFY_USERNAME
    await index.execute(artistFile, setlistToken, spotifyToken, spotifyID)
}

main()