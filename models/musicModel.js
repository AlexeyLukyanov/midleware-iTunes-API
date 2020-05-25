const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

const Singer = sequelize.define('singer', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	}
})

const Album = sequelize.define('album', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	}
})

const Song = sequelize.define('song', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	},
    time: {
        type: DataTypes.INTEGER,
    }
})

Album.belongsTo(Singer, { foreignKey: 'singer_id' });
Song.belongsTo(Album, { foreignKey: 'album_id' });
Album.hasMany(Song, { foreignKey: 'album_id' });
Singer.hasMany(Album, { foreignKey: 'singer_id' });

sequelize.sync()

module.exports = {
    Singer,
    Album,
    Song
};