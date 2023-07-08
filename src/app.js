import express from 'express'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import routerViews from './router/views.router.js'

const PORT = process.env.PORT || 8080

const app = express()
const httpServer = app.listen(PORT, () => console.log("Listenning on port..."))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/static', express.static(__dirname + '/public'))


app.get('/health', (req, res) => res.send('Ok'))
app.use('/', routerViews)

const messages = []
io.on('connection', socket => {
    socket.on('new', user => console.log(`${user} is connected`))

    socket.on('message', data => {
        messages.push(data)
        io.emit('logs', messages)
    })
})