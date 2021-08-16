const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const AutoLoad = require('fastify-autoload')
require('dotenv').config();
let moment = require('moment-timezone'); // require

const port = 4000;
const app = express()

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Access-Control-Allow-Credentials', true); 
    next()
})
app.get('/', (req, res) => {
    console.log('call ')
    res.send('API')
})

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


app.listen(port, () => {
    console.log(`Start server at port ${port}.`)
})