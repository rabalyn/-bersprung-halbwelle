import debug from 'debug'
const loginfo = debug('app:info')
const logerror = debug('app:error')
const logdebug = debug('app:debug')

import fs from 'fs'
import path from 'path'

import config from './config'

import express from 'express'
import hbs from 'express-hbs'
import handlebars from 'handlebars'

const port = config.app.port || process.env.PORT || 9000
const app = express()

const http = require('http').Server(app)
const socket = require('./src/socketConnection')
socket.socketIO(http)
socket.setConfig(config)

app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'main'),
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this)
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this)
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this)
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this)
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this)
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this)
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this)
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this)
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this)
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this)
        default:
            return options.inverse(this)
    }
})

app.get('/', (req, res) => {
  res.render('home', {site: 'home'})
})

http.listen(port, () => {
  loginfo('Listening on port %d', port)
})

