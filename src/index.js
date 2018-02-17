'use strict'

const server = require('./server')
const config = require('../config')

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err)
})
process.on('uncaughtRejection', (err, promise) => {
    console.error('Unhandled Rejection', err)
})

server.start(config).then( app => {
    console.log(`Server started succesfully, running on port: ${config.server.port}.`)
    app.on('close', () => {
        console.log(`Server stopped.`)
    })
})