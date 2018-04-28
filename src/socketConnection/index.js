import debug from 'debug'
const loginfo = debug ('socket:info')
const logerror = debug('socket:error')
const logdebug = debug('socket:debug')

let config = null

module.exports.setConfig = function(conf) {
    config = conf
}

module.exports.socketIO = function hobbitIO(http) {
    const io = require('socket.io')(http)
    io.on('connection', (socket) => {
        loginfo('a user connected')
        socket.on('disconnect', () => {
            loginfo('user disconnected')
        })

        socket.on('sync', (data) => {
            logdebug(data)
            io.emit('pushSync', data)
        })
    })
}
