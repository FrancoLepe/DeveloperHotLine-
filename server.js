console.log('yo its running')


const express = require('express')
const app = express()
const server = require("http").Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4 } = require('uuid')
// import { EventEmitter } from 'node:events';
// const myEmitter = new EventEmitter();


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res)=> {
 res.redirect(`/${uuidV4()}`)
})

app.get('/:room',(req, res)=>{
res.render('room', {roomId: req.params.room })
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);

        // Broadcasting 'user-connected' event to all clients in the room except the sender
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            // Broadcasting 'user-disconnected' event to all clients in the room
            io.to(roomId).emit('user-disconnected', userId);
        });
    });
});

server.listen(3000)