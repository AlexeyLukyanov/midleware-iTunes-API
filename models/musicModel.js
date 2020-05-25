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

const Albom = sequelize.define('albom', {
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

Albom.belongsTo(Singer, { foreignKey: 'singer_id' });
Song.belongsTo(Albom, { foreignKey: 'albom_id' });
Albom.hasMany(Song, { foreignKey: 'albom_id' });
Singer.hasMany(Albom, { foreignKey: 'singer_id' });

sequelize.sync()

module.exports = {
    Singer,
    Albom,
    Song
};