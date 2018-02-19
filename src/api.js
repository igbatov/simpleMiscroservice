'use strict'
const status = require('http-status')
const syslog = require('modern-syslog')
const fs = require("fs")
const path = require("path")
const fileUpload = require('express-fileupload')
const nodemailer = require('nodemailer')

module.exports = (server, options) => {
    if (!options.name) {
        throw new Error('Set api name in config.js!')
    }

    /**
     * track user actions
     */
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

    /**
     * Feedback form
     */
    server.post('/api/v3/support/feedback', function(req, res) {
        let transporter = nodemailer.createTransport(options.smtp);

        // setup email data with unicode symbols
        let mail = {
            from: req.body.email, // sender address
            to: options.feedbackEmail,
            subject:  options.feedbackSubject,
            html: req.body.text,
            attachments: req.body.attaches.map((attache) => ({
                filename: attache.id,
                path: getFilePath(attache.id)
            }))
        };

        // send mail with defined transport object
        transporter.sendMail(mail, (error, info) => {
            // в любом случае удаляем вложение
            req.body.attaches.forEach((attache) => {
                fs.unlink(getFilePath(attache.id))
            })

            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });

        res.status(status.OK).json({'status':'ok'})
    })

    /**
     * File upload
     */
    server.post('/api/file', fileUpload(options.upload), function(req, res) {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files["files[]"]
        const filepath = getFilePath(file.md5)
        file.mv(filepath)
            .then(
                () => {
                    const data = [{
                        contentType: "File",
                        id: file.md5,
                        name: file.name,
                        extension: file.name.split('.').pop(),
                        size: fs.statSync(filepath).size,
                        possibleActions:["act_share"]
                    }]

                    res.status(status.OK).json({
                        "meta":{
                            "status":200,
                            "errors":[]
                        },
                        "data":data
                    })
                },
                err => {
                    console.error( 'Cannot move file to ', filepath, err );
                }
            )
    });

    function getFilePath(filename) {
        return path.join(__dirname, "..", "uploads", filename);
    }
}
