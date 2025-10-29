const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});

io.on('connection', (socket) => {
    console.log('Novo utilizador conectado: ' + socket.id);

    socket.on('mensagem', (data) => {
        console.log('Mensagem recebida:', data);
        io.emit('mensagem', data);
    });

    socket.on('disconnect', () => {
        console.log('Utilizador desconectado: ' + socket.id);
    });
});

server.listen(3000, () => {
    console.log('Servidor a correr em http://localhost:3000');
});
