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

const requestAlboms = function (singerId) {
    const albomOptions = {
        method: 'GET',
        uri: `https://itunes.apple.com/lookup?entity=album&id=${singerId}`,
        json: true
    };
    return request(albomOptions)
};

const requestSongs = function (albomId) {
    const songOptions = {
        method: 'GET',
        uri: `https://itunes.apple.com/lookup?id=${albomId}&media=music&entity=song&atrattribute=songTerm&limit=200`,
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


const getAlboms = function (obj) {
    // Deliting first element in array, becourse the first element is not an albom (Its a artist)
    return obj.results.slice(1).map(albom => {
        return {
            name: albom.collectionName,
            id: Number(albom.collectionId),
            singer_id: Number(albom.artistId)
        }
    }
)}

const getArrOfAlbomId = function (obj) { return obj.results.slice(1).map( albom => Number(albom.collectionId) )};

// Make array of songs
const getSongs = function (obj){ return obj.results.slice(1).map(song => {
        return {
            name: song.trackName,
            id: Number(song.trackId),
            albom_id: Number(song.collectionId),
            time: Number(song.trackTimeMillis)
        }
    })
}

module.exports = {
    requestSinger,
    requestAlboms,
    requestSongs,
    getSinger,
    getAlboms,
    getArrOfAlbomId,
    getSongs
}