const request = require('request-promise');

const musicRepository = require('../repositories/musicRepository.js');
const helper = require('../helper');

const artist_music_list = function (req, res, next) {
    // In the first check the singer name in local DB
    helper.requestSinger(req.query.singer.toLowerCase())
    .then(response => {
        if (response.resultCount === 0) throw new Error('Singer not found');
        return helper.getSinger(response);
    })
    .then(singer => {
        return musicRepository.checkSinger(singer.id).then(singerId => {
            const result = {
                singer,
                singerInLocalDB: singerId
            }
            return result;
        })
    })
    .then(result => {
        if(result.singerInLocalDB) return result.singerInLocalDB;
        return musicRepository.addSinger(result.singer) // Save the singer to local db
        .then(singerId => {
            return helper.requestAlbums(singerId) // Call the function request(albums) to iTines API 
        })
        .then(response => {
            if (response.resultCount === 0) return null;
            const albums = helper.getAlbums(response);
            return musicRepository.addAlbums(albums); // And save albums to local DB
        })
        .then(albums => {
            if(!albums) return;
            const arrOfAlbumsId = helper.getArrOfAlbumId(albums);
            return Promise.all( arrOfAlbumsId.map(albumId => {
                return helper.requestSongs(albumId).then(response => {
                    if (response.resultCount === 0) return;
                    const songs = helper.getSongs(response);        
                    musicRepository.addSongs(songs) // And save the result to local DB
                })
            }) )
        })
        .then( () => result.singer.id ) // return singerId
    })
    .then(singerId => {
        return musicRepository.getMusicList(singerId);
    })
    .then(result => {
        // const resultWithCount = {albumsCount: result[0].alboms.length, results: result};
        res.send(JSON.stringify(result))
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    })
};

module.exports = { artist_music_list }