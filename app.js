const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs')
app.get('/', (req, res) => {
    res.render("index")
})
http.listen(port, () => {
    console.log(`Ok`);
});

io.on('connection', (socket) => {
    console.log(`Hello Guys How Are You`);

    socket.on('opop', (user_name) => {
        console.log(`${user_name} Welcome To VARtchat`);
        socket.broadcast.emit('get_name1', user_name);
    })

    socket.on('mess_op', (message_data) => {
        socket.broadcast.emit('get_message', message_data);
    })
    socket.on('disconnect', () => {
        console.log("bye")
    })
});
