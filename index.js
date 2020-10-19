'use strict';

const Hapi = require('@hapi/hapi');
const Path = require('path');
const init = async() => {

    const server = Hapi.server({
        host: 'localhost',
        port: 4102
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
        handler: (req, h) =>{
            console.log(req.query.url);
            return 'Hello';
        }
    })

    server.route({
        method: 'POST',
        path: '/url/shorten',
        handler: (req, h) =>{
            console.log(req.payload.url);
            return 'Hello';
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