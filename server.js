const path = require('path')
const AutoLoad = require('fastify-autoload')
require('dotenv').config();
let moment = require('moment-timezone'); // require

// const fastify = require('fastify')({
//     ignoreTrailingSlash: true,
//     logger: {
//         timestamp: () => `,"@timestamp":"${moment().format()}"`,
//         messageKey: 'message'
//     }
// })

module.exports = async function (fastify, opts) {
    // Place here your custom code!

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, './fastify-plugins'),
        options: Object.assign({}, opts)
    })
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, './routes/v1'),
        options: {prefix: '/api/v1'}
    })

}

module.exports.options = {
    ignoreTrailingSlash: true
}