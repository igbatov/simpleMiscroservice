const server = {
    port: 4000,
}
const cors = {
    origin: 'http://localhost:3000'
}
const api = {
    name: 'helpBack',
    trackerLog: '/var/log/syslog',
    supportEmail: 'support@megaplan.ru'
}

module.exports = Object.assign({}, {api: api, server: server, cors: cors})