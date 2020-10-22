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
              allowNull: false},
    emailOfCreator: {type: Squealize.DataTypes.STRING}
})

const user = sequalize.define('user',{
    email: {type: Squealize.DataTypes.STRING,
            allowNull: false,
            unique: true},
    password: {type: Squealize.DataTypes.STRING,
             allowNull:false
            },
    jwt: {type: Squealize.DataTypes.STRING,
          allowNull: false
         },
})

url.sync();
user.sync();
module.exports = {url, user};
