const request = require('request-promise');

const musicRepository = require('../repositories/musicRepository.js');
const helper = require('../helper');

const artist_music_list = function (req, res, next) {
    // In the first check the singer name in local DB
    helper.requestSinger(req.query.singer.toLowerCase()).then(response => {
        if (response.resultCount !== 0) {
            const singer = helper.getSinger(response);
            musicRepository.checkSinger(singer.id)
            .then(singerId => {
                if(!singerId) { // If the singer is not found in local db
                    // Save the singer to local db
                    musicRepository.addSinger(singer)
                    .then(singerId => {
                        // Call the function request(albums) to iTines API 
                        helper.requestAlbums(singerId)
                        .then(response => {
                            if (response.resultCount !== 0) {
                                const albums = helper.getAlbums(response);
                                // And save albums to local DB
                                musicRepository.addAlbums(albums)
                                .then(albums => {
                                    const arrOfAlbumsId = helper.getArrOfAlbumId(albums);
                                    // For each album ID call the function request(songs) to iTines API. It'll be array of promises
                                    Promise.all( arrOfAlbumsId.map(albumId => {
                                        return helper.requestSongs(albumId).then(response => {
                                        if (response.resultCount !== 0) {
                                                const songs = helper.getSongs(response);
                                                // And save the result to local DB
                                                musicRepository.addSongs(songs)
                                                
                                                } else {
                                                    res.send('Songs not found')
                                                }
                                            }).catch(err => {
                                                console.log('requestSongs error');
                                                console.log(err)
                                            })
                                        })
                                    )
                                    // when all alboms and songs will be saved in db we can give their from local db and send responce to client
                                    .then(() => {
                                        musicRepository.getMusicList(singer.id)
                                        .then(result => {
                                            // const resultWithCount = {albumsCount: result[0].alboms.length, results: result};
                                            res.send(JSON.stringify(result))
                                        }).catch(err => {
                                            console.log('SendingResult error');
                                            console.log(err)
                                        })
                                    })
                                }).catch(err => {
                                    console.log('requestAlbums error');
                                    console.log(err)
                                })
                            } else {
                                res.send ('Albums not found')
                            }
                        })
                    }).catch(err => {
                        console.log('requestSinger error');
                        console.log(err)
                    });
                // If the singer was found in local DB
                } else {
                    // get the music list and send to client
                    musicRepository.getMusicList(singer.id)
                    .then(result => {
                        // const resultWithCount = {albumsCount: result[0].alboms.length, results: result};
                        res.send(JSON.stringify(result))
                    }).catch(err => {
                        console.log('SendingResult error');
                        console.log(err)
                    })
                }
            })
        } else {
            res.send('Singer not found');
        }
    })
};

module.exports = { artist_music_list }