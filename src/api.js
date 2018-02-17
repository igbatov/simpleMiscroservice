'use strict'
const status = require('http-status')
const syslog = require('modern-syslog')

module.exports = (server, options) => {
    if (!options.name) {
        throw new Error('Set api name in config.js!')
    }

    server.post('/trackBatch', (req, res, next) => {
        try {
            const str = JSON.stringify(req.body)
            syslog.open(options.name, syslog.option.LOG_PERROR + syslog.option.LOG_PID, syslog.facility.LOG_LOCAL1)
            syslog.upto('LOG_INFO')
            syslog.info('%s', str)
            res.status(status.OK).json({'status':'ok'})
        } catch (e) {
            next(e)
        }
    })
}
