const { Singer, Albom, Song } = require('../models/musicModel');

const checkSinger = function (singerName) {
    console.log('singerName PART');
    console.log(singerName);
    return Singer.findOne({ where: {name: singerName} })
    .then(singer => {
        // const singerName = singer.name;
        console.log(`Singer ${singer} was found in db`);
        return singer;
    })
    .catch(err => {
        console.log('checkSinger error');
        console.log(err)
    })
};

const getAlboms = function (singer) {
    return Albom.findAll({
        where: { singer_id: singer.id }
    })
};

const getSongs = function (albom) {
    return Song.findAll({
        where: { albom_id: albom.id}
    })
};

const getMusicList = function (singerId) {
    return Singer.findAll({
        where: {id: singerId},
        include: [
          {
            model: Albom,
            include: [
              {
                model: Song,
              }
            ]
          }
        ]
      })
    //   .then(result => {
    //       console.log('GET MUSIC LIST PART -------------------------------------------------------------------------------------------------------------------------');
    //       console.log(result)
    //       return result;

    //   })
}

const addSinger = function (singer) {
    return Singer.create({id: singer.id, name: singer.name})
    .then(singer => {
        const singerName = singer.name;
        console.log(`Singer ${singer.name} saved in db`);
        return singer.id;
    })
    .catch(err => {
        console.log('addSinger error');
        console.log(err)
    })
    
};

const addAlboms = function (alboms) {
    return Albom.bulkCreate(alboms)
    .then(alboms => {
        alboms.forEach(albom => console.log(`Albom ${albom.name} saved in db`));
        return alboms;
    })
    .catch(err => {
        console.log('addAlboms error');
        console.log(err)
    })
};

const addSongs = function (songs) {
    return Song.bulkCreate(songs)
    .then(songs => {
        songs.forEach(song => console.log(`Song ${song.name} saved in db`))
    })
    .catch(err => {
        console.log('addSongs error');
        console.log(err)
    })
};

module.exports = {
    checkSinger,
    getAlboms,
    getSongs,
    getMusicList,
    addSinger,
    addAlboms,
    addSongs
}