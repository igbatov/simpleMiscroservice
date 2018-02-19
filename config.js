const server = {
    port: 4000,
}
const cors = {
    credentials: true, // нужно чтобы работала подгрузка фалов через CORS
    origin: 'http://localhost:3000'
}
const api = {
    name: 'helpBack',
    trackerLog: '/var/log/syslog',
    feedbackEmail: 'support@megaplan.ru',
    feedbackSubject: 'Фидбек с help.megaplan.ru',
    smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "gugnzjua7ankukhg@ethereal.email", // generated ethereal user
            pass: "vPzTnWmzagpHpNFP3f"  // generated ethereal password
        }
    },
    upload: {
        limits: { fileSize: 50 * 1024 * 1024 },
        safeFileNames: /[^a-zA-Z\d-_\.]/g // обрезать все кроме alphanum, -, _, .
    }
}

module.exports = Object.assign({}, {api, server, cors})