const request = require('request-promise');

const musicRepository = require('../repositories/musicRepository.js');
const helper = require('../helper');

const artist_music_list = function (req, res, next) {
    // In the first check the singer name in local DB
    musicRepository.checkSinger(req.query.singer.toLowerCase())
    .then(singerName => {
        console.log('Check part -------------------------------------------------------------------');
        console.log(singerName);
        // If the singer is not found
        if(!singerName) {
            // Call the function request(singer) to iTunes API 
            helper.requestSinger(req.query.singer.toLowerCase())
            .then(response => {
                console.log('Part 1 -------------------------------------------------------------------');
                console.log(response);
                if (response.resultCount !== 0) {
                    const singer = helper.getSinger(response); 
                    // console.log(singer);
                    musicRepository.addSinger(singer)
                    .then(singerId => {
                        console.log('Part 2 -------------------------------------------------------------------');
                        console.log(singerId);
                        // Call the function request(albums) to iTines API 
                        helper.requestAlbums(singerId)
                        .then(response => {
                            if (response.resultCount !== 0) {
                                console.log('Part 3 -------------------------------------------------------------------');
                                console.log(response);
                                const albums = helper.getAlbums(response);
                                console.log('PART 3.1 -------------------------------------------------------------------');
                                console.log(albums);
                                // And save albums to local DB
                                musicRepository.addAlbums(albums)
                                .then(albums => {
                                    const arrOfAlbumsId = helper.getArrOfAlbumId(albums);
                                    // For each album ID call the function request(songs) to iTines API. It'll be array of promises
                                    Promise.all( arrOfAlbumsId.map(albumId => {
                                        return helper.requestSongs(albumId).then(response => {
                                        if (response.resultCount !== 0) {
                                                console.log('Part 4 -------------------------------------------------------------------');
                                                // console.log(response);
                                                const songs = helper.getSongs(response);
                                                console.log('Part 5 -------------------------------------------------------------------------------------------------------------------------');
                                                console.log(songs);
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
                                    .then(() => {
                                        helper.getSinger(req.query.singer.toLowerCase())
                                        .then(singer => {
                                            musicRepository.getMusicList(singer.artistId)
                                            .then(result => {
                                                // const resultWithCount = {albumsCount: result[0].alboms.length, results: result};
                                                res.send(JSON.stringify(result))
                                            }).catch(err => {
                                                console.log('SendingResult error');
                                                console.log(err)
                                            })
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
                } else {
                    res.send ('Singer not found')
                }
            })
            
        // If the singer was found in local DB
        } else {
            // get the music list and send to client
            helper.getSinger(req.query.singer.toLowerCase())
            .then(singer => {
                musicRepository.getMusicList(singer.artistId)
                .then(result => {
                    // const resultWithCount = {albumsCount: result[0].alboms.length, results: result};
                    res.send(JSON.stringify(result))
                }).catch(err => {
                    console.log('SendingResult error');
                    console.log(err)
                })
            })
        }
    })
};

module.exports = { artist_music_list }