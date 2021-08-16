'use strict'
const fp = require('fastify-plugin')

require('dotenv').config();


module.exports = fp(async function (fastify, opts) {
    fastify.register(require('fastify-mongodb'), {
        forceClose: true,
        // dbName: 'local',

        url: 'mongodb+srv://admin_tik:tik_admin@cluster0.cfa0g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    })
})

