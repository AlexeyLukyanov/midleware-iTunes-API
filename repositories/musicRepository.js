const { Singer, Album, Song } = require('../models/musicModel');

const checkSinger = function (singerId) {
    return Singer.findOne({ where: {id: singerId} })
    .then(singer => singer ? singer.id : null) // return singerId || null 
};

const getMusicList = function (singerId) {
    return Singer.findAll({
        where: {id: singerId},
        attributes: ['id', 'name'],
        include: [
          {
            model: Album,
            attributes: ['id', 'name', 'singer_id'],
            include: [
              {
                model: Song,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              }
            ]
          }
        ]
    })
}

const addSinger = function (singer) {
    return Singer.create({id: singer.id, name: singer.name})
    .then(singer => {
        const singerName = singer.name;
        console.log(`Singer ${singer.name} saved in db`);
        return singer.id;
    })
};

const addAlbums = function (albums) {
    return Album.bulkCreate(albums)
    .then(albums => {
        albums.forEach(album => console.log(`Album ${album.name} saved in db`));
        return albums;
    })
};

const addSongs = function (songs) {
    return Song.bulkCreate(songs)
    .then(songs => {
        songs.forEach(song => console.log(`Song ${song.name} saved in db`))
    })
};

module.exports = {
    checkSinger,
    getMusicList,
    addSinger,
    addAlbums,
    addSongs
}