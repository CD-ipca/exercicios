// chat-server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Servir ficheiros estáticos
app.use(express.static('public'));

// SOLUÇÃO TODO 1: Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Estrutura para guardar utilizadores
const utilizadores = new Map(); // Map<socketId, username>

// SOLUÇÃO TODO 2: Evento de conexão
io.on('connection', (socket) => {
    console.log('🟢 Novo cliente conectado:', socket.id);

    // SOLUÇÃO TODO 3: Utilizador entrar no chat
    socket.on('entrar', (username) => {
        // Verificar se username já existe
        const usernameExiste = Array.from(utilizadores.values()).includes(username);

        if (usernameExiste) {
            socket.emit('erroUsername', 'Nome de utilizador já está em uso!');
            return;
        }

        // Guardar utilizador
        socket.username = username;
        utilizadores.set(socket.id, username);

        console.log(`✅ ${username} entrou no chat`);

        // Notificar todos que novo utilizador entrou
        socket.broadcast.emit('utilizadorEntrou', {
            username: username,
            texto: `${username} entrou no chat`
        });

        // Enviar lista atualizada de utilizadores para todos
        io.emit('listaUtilizadores', Array.from(utilizadores.values()));

        // Enviar confirmação ao utilizador que entrou
        socket.emit('bemVindo', {
            mensagem: 'Bem-vindo ao chat!',
            utilizadores: Array.from(utilizadores.values())
        });
    });

    // SOLUÇÃO TODO 4: Receber e broadcast mensagem
    socket.on('mensagem', (data) => {
        const mensagemCompleta = {
            username: socket.username || 'Anónimo',
            texto: data.texto,
            timestamp: new Date().toISOString(),
            hora: new Date().toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        console.log(`💬 ${mensagemCompleta.username}: ${mensagemCompleta.texto}`);

        // Broadcast para TODOS os clientes (incluindo remetente)
        io.emit('mensagem', mensagemCompleta);
    });

    // SOLUÇÃO TODO 5: Utilizador está a escrever
    socket.on('typing', (username) => {
        // Broadcast para todos EXCETO o remetente
        socket.broadcast.emit('typing', username);
    });

    // SOLUÇÃO TODO 6: Parar de escrever
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    // SOLUÇÃO: Desconexão
    socket.on('disconnect', () => {
        if (socket.username) {
            console.log(`🔴 ${socket.username} desconectou`);

            // Remover utilizador
            utilizadores.delete(socket.id);

            // Notificar todos
            io.emit('utilizadorSaiu', {
                username: socket.username,
                texto: `${socket.username} saiu do chat`
            });

            // Atualizar lista
            io.emit('listaUtilizadores', Array.from(utilizadores.values()));
        } else {
            console.log('🔴 Cliente desconectou:', socket.id);
        }
    });
});

server.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log(`🚀 Chat servidor à escuta em http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════');
    console.log('💡 Abra múltiplas abas para testar!');
    console.log('Pressione Ctrl+C para parar');
});

// Tratamento de erros
server.on('error', (erro) => {
    if (erro.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso!`);
        console.error('Solução: Pare o outro servidor ou use outra porta');
    } else {
        console.error('❌ Erro no servidor:', erro);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso');
        process.exit(0);
    });
});
