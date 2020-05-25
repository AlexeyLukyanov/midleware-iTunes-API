const request = require('request-promise');

const plusInstedOfSpaceInSingerName = function (singerName){
    const arrOfSubstrings = singerName.split(' ');
    return arrOfSubstrings.join('+');
};

const requestSinger = function (singerName) {
    const singerOptions = {
        method: 'GET',
        uri: `https://itunes.apple.com/search?term=${plusInstedOfSpaceInSingerName(singerName)}&media = music&entity=musicArtist&attribute=artistTerm&limit=10`,
        json: true
    };
    return request(singerOptions);
};

const requestAlbums = function (singerId) {
    const albomOptions = {
        method: 'GET',
        uri: `https://itunes.apple.com/lookup?entity=album&id=${singerId}`,
        json: true
    };
    return request(albomOptions)
};

const requestSongs = function (albumId) {
    const songOptions = {
        method: 'GET',
        uri: `https://itunes.apple.com/lookup?id=${albumId}&media=music&entity=song&atrattribute=songTerm&limit=200`,
        json: true
    };
    return request(songOptions);
};

const getSinger = function (obj){
    return {
        id: Number(obj.results[0].artistId),
        name: obj.results[0].artistName.toLowerCase()
    };
};

// So we have a little problem, the iTunes take the all albums with our singer (including join albums with another singer, ID each we have not in local DB yet).
// If we try save the album singer_id each is not saved, we'll have error from db and can't save another albums and album's songs.
// We use filter function and save only albums with artist ID (not with ID another singer)

const getAlbums = function (obj) {
    return obj.results.slice(1)   // Delete first element in array, becourse the first element is not an album (Its a artist)
    .filter(album => obj.results[0].artistId === album.artistId) // we need only albums with artistId our artist (artist obj is first element of array results in obj - object each we get from iTunes API)
    .map(album => { 
        return {
            name: album.collectionName,
            id: Number(album.collectionId),
            singer_id: Number(album.artistId),
        }
    }
)}

const getArrOfAlbumId = function (arr) { return arr.map( album => album.id )};

// Make array of songs
const getSongs = function (obj){ return obj.results.slice(1).map(song => {
        return {
            name: song.trackName,
            id: Number(song.trackId),
            album_id: Number(song.collectionId),
            time: Number(song.trackTimeMillis)
        }
    })
}

module.exports = {
    requestSinger,
    requestAlbums,
    requestSongs,
    getSinger,
    getAlbums,
    getArrOfAlbumId,
    getSongs
}