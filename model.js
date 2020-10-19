const path = require('path');
const { Sequelize } = require('sequelize');
const Squealize = require('sequelize');

const sequalize = new Squealize(null, null, null, {
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database', 'db.sqlite')
});

const url = sequalize.define('url',{
    longUrl: {type: Squealize.DataTypes.STRING,
              allowNull: false},
    shortUrl: {type: Squealize.DataTypes.STRING,
              unique: true,
              allowNull: false}
})

url.sync();

module.exports = url;
