let moment = require('moment-timezone'); // require
module.exports = async function (fastify, opts) {
    fastify.setErrorHandler(function (error, request, reply) {
        // Send error response
        // const currentTime = fastify.utils.currentTime()
        // fastify.mongo.db.collection('temp_rd').insertOne({request: request.body, reply: error.message, time: currentTime, url: request.raw.url, headers: request.raw.headers})
        reply.send(error.message)
    })
    fastify.addHook('onSend', (request, reply, payload, done) => {
        // const currentTime = fastify.utils.currentTime()
        // console.log(currentTime)
        // fastify.mongo.db.collection('temp_rd').insertOne({request: request.body, reply: payload, time: currentTime, url: request.raw.url, headers: request.raw.headers})
        // const err = null;
        // const newPayload = payload.replace('some-text', 'some-new-text')
        done()
    })
    let schema = {
        "schema": {
            "querystring": {
                "type": 'object',
                "properties": {
                    "account_id" : {
                        "type" : "string"
                    },
                    "page": {
                        "type" : "string"
                    },
                    "type" : {
                        "type" : "string"
                    },
                    "time" : {
                        "type" : "string"
                    },
                }
            }
        }
    }
    fastify.get('/save_tree' , schema , async (request, reply) => {
        fastify.mongo.db.collection('tree').insertOne(request.query)
        reply.send(request.query)
        // const users = fastify.mongo.db.collection('users').findOne()
    })
    fastify.get('/get_tree' , schema , async (request, reply) => {
        let get_tree = await fastify.mongo.db.collection('tree').find({ account_id: request.query.account_id }).toArray()
        reply.send(get_tree)
    })
}
