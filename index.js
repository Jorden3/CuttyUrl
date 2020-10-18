'use strict'

const Hapi = require('@hapi/hapi');
const Path = require('path');

const init = async() => {

    const server = Hapi.server({
        host: 'localhost',
        port: 4100
    });

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
             path: 'cutty-url/dist/cutty-url'
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', err =>{
    console.log(err);
    process.exit(1);
})

init();