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
                        // Call the function request(alboms) to iTines API 
                        helper.requestAlboms(singerId)
                        .then(response => {
                            if (response.resultCount !== 0) {
                                console.log('Part 3 -------------------------------------------------------------------');
                                console.log(response);
                                const alboms = helper.getAlboms(response);
                                console.log('PART 3.1 -------------------------------------------------------------------');
                                console.log(alboms);
                                // And save alboms to local DB
                                musicRepository.addAlboms(alboms)
                                .then(alboms => {
                                    return helper.getArrOfAlbomId(response);
                                })
                                .then(arrOfAlbomsId => {
                                    // нужно исправить -----------------------------------------------------------------------------------


                                    // For each albom ID call the function request(songs) to iTines API. It'll be array of promises
                                    Promise.all( arrOfAlbomsId.map(albomId => {
                                        return helper.requestSongs(albomId).then(response => {
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

                                    // нужно исправить -----------------------------------------------------------------------------------

                                    
                                    // Correct the Promise function. (Its does't work correctly) 
                                    .then(() => {
                                        musicRepository.checkSinger(req.query.singer.toLowerCase())
                                        .then(singer => {
                                            musicRepository.getMusicList(singer.id)
                                            .then(result => {
                                                res.send(JSON.stringify(result))
                                            }).catch(err => {
                                                console.log('SendingResult error');
                                                console.log(err)
                                            })
                                        })
                                    })

                                }).catch(err => {
                                    console.log('requestAlboms error');
                                    console.log(err)
                                })
                            } else {
                                res.send ('Alboms not found')
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
            musicRepository.checkSinger(req.query.singer.toLowerCase())
                                        .then(singer => {
                                            musicRepository.getMusicList(singer.id)
                                            .then(result => {
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