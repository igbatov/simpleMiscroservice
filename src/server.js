'use strict'
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const api = require('./api')
const cors = require('cors')

const start = (options) => {
    return new Promise((resolve, reject) => {
        if (!options.server.port) {
            reject(new Error('The server must be started with an available port'))
        }

        const exp = express()
        exp.use(morgan('dev')) // logging
        exp.use(helmet()) // security
        exp.use(cors(options.cors)) // CORS-enabled
        exp.use(express.json());       // to support JSON-encoded bodies
        exp.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
        exp.use((err, req, res, next) => {
            reject(new Error('Something went wrong!, err:' + err))
            res.status(500).send('Something went wrong!')
        })

        // add our API's to the express
        api(exp, options.api)

        // finally we start the server, and return the newly created server
        const server = exp.listen(options.server.port, () => resolve(server))
    })
}

module.exports = Object.assign({}, {start})