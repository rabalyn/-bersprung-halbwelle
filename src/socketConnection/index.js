import debug from 'debug'
const loginfo = debug ('socket:info')
const logerror = debug('socket:error')
const logdebug = debug('socket:debug')

let config = null

let data = {plus: 8, minus: 8, playStimmungkippt: false, playCheer: false}

module.exports.setConfig = (conf) => {
    config = conf
}

module.exports.socketIO = (http) => {
    const io = require('socket.io')(http)
    io.on('connection', (socket) => {
        loginfo('a user connected')
        socket.emit('init', data)
        socket.on('disconnect', () => {
            loginfo('user disconnected')
        })

        socket.on('sync', (clientdata) => {
            data = clientdata
            logdebug(data)
            io.emit('pushSync', data)
        })
    })
}
