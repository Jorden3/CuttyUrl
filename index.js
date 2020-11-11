'use strict';

const Hapi = require('@hapi/hapi');
const Path = require('path');
const URLdb = require('./model');
const crypto = require('crypto')
const boom = require('boom');
const secret = require('./config');
const Jwt = require('@hapi/jwt');
const { user } = require('./model');
const key = require('./config');



const init = async() => {
    const tokens = [];

    const server = Hapi.server({
        host: 'localhost',
        port: 4103
    });

    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/jwt'));
    server.auth.strategy('jwt', 'jwt', {
        keys: secret,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: false,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15,
        },
        // 
        validate: async (artifacts, request, h) => {
            // console.log(artifacts)
            try {
                Jwt.token.verify(artifacts, key);               
            } catch (error) {
                console.log(error);
            }
            let dbRes = await URLdb.user.findOne({where:{jwt: artifacts.token}});
            if(dbRes === null){
                let res = h.response().code(401)
                return res;
            }
            return {isValid: true, user: dbRes}
        }
    })
   
    server.auth.default('jwt')

    server.route({
        method:'GET',
        path:'/test',
        handler: (req, reply) =>{
            return 'Hello you\'re verified'
        }
    })

    server.route({
        method:'GET',
        path: '/cutty/{params*}',
        handler: async (req, reply) => {
            let res; 
            try {
                res = await URLdb.url.findOne({where: {shortUrl: req.params.params}});
                if (res === null)
                    return reply.response('Link not found').code(404);
            } catch (error) {
                throw boom.notFound('Can\'t find Link')
            }
            return reply.redirect(res.longUrl);
        }
    })

    server.route({
        method: 'GET',
        path: '/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/account/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/inflate/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/inflate/Inflate/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/shorten/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/shorten/Shrink/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/auth/{params*}',
        config: {auth: false},
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/url/inflate',
        config: {auth: false},
        handler: async (req, h) =>{
            let res;
            try {
                res = await URLdb.url.findOne({where: {shortUrl: req.query.url}});
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
        config: {auth: false},
        handler: async (req, h) =>{
            let longUrl = req.payload.url;
            let token = req.payload.token;
            let shortUrl = crypto.createHash('md5').update(longUrl).digest('hex').slice(0,8);
            let res;
            let userDBRes;
            let created = false;
            let email = '';
            try {
                if(token !== ''){
                    userDBRes = await URLdb.user.findOne({where: {jwt: token}});
                    email = userDBRes.email;
                }
                [res,created] = await URLdb.url.
                findOrCreate({
                    where:{longUrl: longUrl},  
                    defaults:{
                        shortUrl: shortUrl,
                        emailOfCreator: email
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
    });

    server.route({
        method: 'POST',
        path: '/auth/login',
        config: {auth: false},      
        handler: async (req, h) =>{

            try {
                let dbRes = await URLdb.user.findOne({
                    where:{
                        email: req.payload.email,
                        password: req.payload.password
                    }
                });
                if(dbRes === null){
                    return boom.unauthorized("Couldn't find account! Try signing up!");
                }
                let token = Jwt.token.generate(req.payload, secret,{
                    ttlSec: 86400000
                });
                dbRes.update({jwt: token});
                let urls = await URLdb.url.findAll({where: {emailOfCreator: req.payload.email}})
                const res = h.response({email: req.payload.email, token: dbRes.jwt, createdUrls:urls});
                return res;
            } catch (error) {
                console.log(error);
                return error
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/auth/autologin',
        handler: async (req, h) =>{
            let urls = await URLdb.url.findAll({where: {emailOfCreator: req.auth.credentials.email}});
            const res = h.response({email: req.auth.credentials.email, token: req.auth.artifacts.token, createdUrls:urls}).code(200);
            console.log(res);
            return res;
        }
    })

    server.route({
        method: 'POST',
        path: '/auth/signup',
        config: {auth:false},
        handler: async (req,h) =>{
            console.log(req.payload);
            let token = Jwt.token.generate(req.payload, secret,{
                ttlSec: 86400000
            });
            try {
                let dbRes = await URLdb.user.create({
                    email: req.payload.email,
                    password: req.payload.password,
                    jwt: token
                });
                let res = h.response({email: dbRes.email, token:token, isValid: true}).code(200);               
                return res;
                
            } catch (error) {
                if(error.errors[0].message === 'email must be unique'){
                    //let res = h.response({message:'Email must be unique', isValid:false}).code(409);     
                    return boom.notAcceptable('Email must be unique');
                }
                else
                    return error;
            }
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