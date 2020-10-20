'use strict';

const Hapi = require('@hapi/hapi');
const Path = require('path');
const URLdb = require('./model');
const crypto = require('crypto')

const init = async() => {

    const server = Hapi.server({
        host: 'localhost',
        port: 4103
    });

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/{params*}',
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/inflate/{params*}',
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/shorten/{params*}',
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/url/inflate',
        handler: async (req, h) =>{
            let res;
            try {
                res = await URLdb.findOne({where: {shortUrl: req.query.url}});
                if(res === null){
                    return 'Link is not found'
                }
                      
            } catch (error) {
                return error;
            }
            return res
        }
    })

    server.route({
        method: 'POST',
        path: '/url/shorten',
        handler: async (req, h) =>{
            let longUrl = req.payload.url;
            let shortUrl = crypto.createHash('md5').update(longUrl).digest('hex').slice(0,8);
            let res;
            let created = false;
            try {
                [res,created] = await URLdb.
                findOrCreate({
                    where:{longUrl: longUrl},  
                    defaults:{
                        shortUrl: shortUrl
                    }
                });
            } catch (error) {
                console.log(error);
                /*if a shortUrl matches one in the db then add random number from 0 to 99999 to the 
                end of the longUrl, hash, and try again */
                if(error.name === 'SequelizeUniqueConstraintError'){
                    let tempLongUrl = longUrl.concat(Math.floor(Math.random() * Math.floor(100000)))
                    shortUrl = crypto.createHash('md5').update(tempLongUrl).digest('hex').slice(0,8);
                    try {
                        [res,created] = await 
                        findOrCreate({
                            where:{longUrl: longUrl},  
                            defaults:{
                                shortUrl: shortUrl
                            }
                        });
                    } catch (error) {
                        return error;
                    }
                }
                return error;
            }
            return res;
        }
    })


    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', err =>{
    console.log(err);
    process.exit(1);
})

init();