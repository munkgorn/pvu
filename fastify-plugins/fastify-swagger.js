'use strict'
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    // Register the plugins before your routes
    fastify.register(require('fastify-swagger'), {
        exposeRoute: true,
        routePrefix: '/docs',
        swagger: {
            info: { title: 'movie-api' },
            consumes: ['application/json','application/xml'],
            // Add more options to get a nicer page ✨
        },
    })

})

