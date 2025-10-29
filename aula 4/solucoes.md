# Aula 3 - Node.js e Comunicação em Tempo Real
## Exercícios Práticos - (POSSIVEL SOLUÇÕES COMPLETAS)

**Disciplina:** Computação Distribuída  
**Professor:** Filipe Gomes Manso  
**IPCA** - Instituto Politécnico do Cávado e do Ave

---

## 🎯 Notas Pedagógicas

### Objetivos de Aprendizagem
- Compreender fundamentos do Node.js e modelo event-driven
- Dominar criação de servidores HTTP nativos
- Implementar comunicação em tempo real com Socket.IO
- Desenvolver aplicação de chat distribuído funcional

### Pontos de Atenção
- ⚠️ Garantir que todos têm Node.js instalado antes de começar
- ⚠️ Alguns alunos podem ter dificuldade com callbacks e eventos
- ⚠️ Enfatizar diferença entre HTTP e WebSockets
- ⚠️ Preparar exemplos de erros comuns (porta em uso, CORS)
- ⚠️ Certificar que abrem http://localhost:3000 e não file://

---

## 💻 Exercício 1: Servidor HTTP Básico - PROPOSTA DE SOLUÇÃO COMPLETA

```javascript
// server-basico.js
const http = require('http');

const PORT = 3000;

// SOLUÇÃO TODO 1: Criar o servidor HTTP
const server = http.createServer((req, res) => {
    
    // SOLUÇÃO TODO 2: Definir status code e headers
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    // SOLUÇÃO TODO 3: Enviar resposta HTML
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Servidor Node.js</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 50px auto;
                    text-align: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                }
                h1 { margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>🚀 Olá do Node.js!</h1>
            <p>Servidor HTTP básico funcionando!</p>
            <p><small>Porta: ${PORT}</small></p>
        </body>
        </html>
    `);
});

// SOLUÇÃO TODO 4: Colocar servidor à escuta
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('Pressione Ctrl+C para parar');
});

// Tratamento de erros
server.on('error', (erro) => {
    if (erro.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso!`);
        console.error('Dica: Feche o outro servidor ou use outra porta');
    } else {
        console.error('❌ Erro no servidor:', erro);
    }
    process.exit(1);
});
```

### Conceitos-Chave a Enfatizar

1. **http.createServer()**: Cria instância do servidor com callback (req, res)
2. **Request (req)**: Contém dados do pedido (url, method, headers, body)
3. **Response (res)**: Objeto usado para enviar resposta ao cliente
4. **res.writeHead()**: Define status code e headers HTTP
5. **res.end()**: Finaliza e envia a resposta
6. **Modelo assíncrono**: Servidor não bloqueia enquanto aguarda pedidos

### Erros Comuns

```javascript
// ❌ ERRO: Esquecer res.end()
res.writeHead(200);
// Browser fica à espera infinitamente

// ✅ CORRETO
res.writeHead(200);
res.end('Resposta');

// ❌ ERRO: Usar porta já em uso
// Solução: Verificar processos ou usar outra porta

// ❌ ERRO: Headers depois de end()
res.end('Corpo');
res.writeHead(200); // Erro!

// ✅ CORRETO: Headers antes do corpo
res.writeHead(200);
res.end('Corpo');
```

---

## 💻 Exercício 2: Servidor com Rotas - PROPOSTA DE SOLUÇÃO COMPLETA

```javascript
// server-rotas.js
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
    
    console.log(`${req.method} ${req.url}`);
    
    // SOLUÇÃO TODO 1: Rota principal "/"
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Servidor Node.js</title>
                <style>
                    body {
                        font-family: Arial;
                        max-width: 600px;
                        margin: 50px auto;
                        text-align: center;
                    }
                    a {
                        display: inline-block;
                        margin: 10px;
                        padding: 10px 20px;
                        background: #667eea;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    a:hover { background: #5568d3; }
                </style>
            </head>
            <body>
                <h1>Página Inicial</h1>
                <p>Bem-vindo ao servidor Node.js!</p>
                <nav>
                    <a href="/sobre">Sobre</a>
                    <a href="/api/info">API Info</a>
                </nav>
            </body>
            </html>
        `);
    }
    
    // SOLUÇÃO TODO 2: Rota "/sobre"
    else if (req.url === '/sobre') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sobre</title>
                <style>
                    body {
                        font-family: Arial;
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                    }
                    .info { background: #f0f0f0; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Sobre Este Projeto</h1>
                <div class="info">
                    <h3>Computação Distribuída</h3>
                    <p>Aula 3 - Node.js e Socket.IO</p>
                    <p><strong>Instituição:</strong> IPCA</p>
                    <p><strong>Professor:</strong> Filipe Gomes Manso</p>
                </div>
                <p><a href="/">← Voltar</a></p>
            </body>
            </html>
        `);
    }
    
    // SOLUÇÃO TODO 3: Rota "/api/info" (JSON)
    else if (req.url === '/api/info') {
        const dadosServidor = {
            servidor: 'Node.js',
            versao: process.version,
            plataforma: process.platform,
            arquitetura: process.arch,
            memoriaUsada: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
            uptime: `${Math.round(process.uptime())} segundos`,
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(dadosServidor, null, 2));
    }
    
    // SOLUÇÃO TODO 4: Resposta 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404</title>
                <style>
                    body {
                        font-family: Arial;
                        max-width: 600px;
                        margin: 50px auto;
                        text-align: center;
                    }
                    .error { color: #dc3545; font-size: 72px; }
                </style>
            </head>
            <body>
                <div class="error">404</div>
                <h1>Página Não Encontrada</h1>
                <p>A rota <code>${req.url}</code> não existe.</p>
                <p><a href="/">← Voltar à página inicial</a></p>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor à escuta em http://localhost:${PORT}`);
    console.log('Rotas disponíveis:');
    console.log('  GET /');
    console.log('  GET /sobre');
    console.log('  GET /api/info');
});

server.on('error', (erro) => {
    if (erro.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso!`);
    } else {
        console.error('❌ Erro:', erro.message);
    }
    process.exit(1);
});
```

### Conceitos-Chave a Enfatizar

1. **Roteamento manual**: Uso de if/else para diferentes rotas
2. **Content-Type**: Importância de definir tipo de conteúdo correto
3. **Status Codes**: 200 (OK), 404 (Not Found), 500 (Error)
4. **JSON.stringify()**: Conversão de objeto para string JSON
5. **req.url**: Propriedade que contém o caminho do pedido

### Discussão: Limitações

- ❌ Roteamento manual complexo para muitas rotas
- ❌ Sem suporte automático para query parameters
- ❌ Sem parsing de body em POST
- ❌ Sem middleware system
- ✅ **Solução**: Usar framework como Express.js

---

## 💻 Exercício 3: Chat Socket.IO - PROPOSTA DE SOLUÇÃO COMPLETA

### 3.1 Servidor Completo

```javascript
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
    console.log(`🚀 Chat servidor rodando em http://localhost:${PORT}`);
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
```

### 3.2 Cliente HTML Completo

```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💬 Chat em Tempo Real</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 900px;
            height: 650px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h2 {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #statusConexao {
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .main-content {
            display: flex;
            flex: 1;
            overflow: hidden;
        }
        .sidebar {
            width: 220px;
            background: #f8f9fa;
            padding: 15px;
            border-right: 2px solid #e0e0e0;
            overflow-y: auto;
        }
        .sidebar h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .usuario-online {
            padding: 10px;
            margin-bottom: 8px;
            background: white;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .usuario-online::before {
            content: '🟢';
            font-size: 10px;
        }
        .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        #mensagens {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #fafafa;
        }
        #mensagens::-webkit-scrollbar {
            width: 8px;
        }
        #mensagens::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
        }
        .mensagem {
            margin-bottom: 15px;
            padding: 12px 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.08);
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .mensagem-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
        }
        .mensagem-username {
            font-weight: bold;
            color: #667eea;
        }
        .mensagem-hora {
            color: #999;
        }
        .mensagem-texto {
            color: #333;
            line-height: 1.4;
        }
        .mensagem-sistema {
            background: #e3f2fd;
            color: #1976d2;
            text-align: center;
            font-style: italic;
            padding: 8px;
            font-size: 13px;
        }
        #typing {
            padding: 10px 20px;
            font-style: italic;
            color: #999;
            min-height: 35px;
            font-size: 13px;
        }
        .input-area {
            padding: 15px 20px;
            background: white;
            border-top: 2px solid #e0e0e0;
            display: flex;
            gap: 10px;
        }
        #inputMsg {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #667eea;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
        }
        #inputMsg:focus {
            border-color: #764ba2;
        }
        button {
            padding: 12px 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        button:active {
            transform: translateY(0);
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        /* Login Screen */
        .login-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            gap: 20px;
        }
        .login-screen h2 {
            color: #667eea;
            font-size: 28px;
        }
        .login-screen input {
            padding: 12px 20px;
            width: 280px;
            border: 2px solid #667eea;
            border-radius: 25px;
            font-size: 16px;
            text-align: center;
            outline: none;
        }
        .login-screen input:focus {
            border-color: #764ba2;
        }
        
        /* Indicador de conexão */
        .status-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #4caf50;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .status-dot.offline {
            background: #f44336;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Ecrã de Login -->
        <div id="loginScreen" class="login-screen">
            <h2>💬 Bem-vindo ao Chat!</h2>
            <p style="color: #666;">Entre para começar a conversar</p>
            <input type="text" id="usernameInput" placeholder="Digite seu nome..." maxlength="20" autofocus>
            <button onclick="entrarChat()">Entrar no Chat</button>
        </div>

        <!-- Ecrã do Chat -->
        <div id="chatScreen" style="display: none; flex-direction: column; height: 100%;">
            <div class="header">
                <h2>
                    <span>💬</span>
                    <span>Chat em Tempo Real</span>
                </h2>
                <div id="statusConexao">
                    <span class="status-dot"></span>
                    <span>Online</span>
                </div>
            </div>
            <div class="main-content">
                <div class="sidebar">
                    <h3>👥 Online (<span id="onlineCount">0</span>)</h3>
                    <div id="listaUtilizadores"></div>
                </div>
                <div class="chat-area">
                    <div id="mensagens"></div>
                    <div id="typing"></div>
                    <div class="input-area">
                        <input type="text" id="inputMsg" placeholder="Digite sua mensagem..." disabled>
                        <button onclick="enviarMensagem()" id="btnEnviar" disabled>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let socket;
        let username = '';
        let typingTimer;
        const TYPING_TIMER_LENGTH = 1000; // 1 segundo

        // SOLUÇÃO TODO 1: Função para entrar no chat
        function entrarChat() {
            const input = document.getElementById('usernameInput');
            username = input.value.trim();
            
            if (username === '') {
                alert('Por favor, digite um nome!');
                input.focus();
                return;
            }
            
            if (username.length < 2) {
                alert('Nome deve ter pelo menos 2 caracteres!');
                input.focus();
                return;
            }
            
            // Conectar ao Socket.IO
            socket = io();
            
            // Configurar eventos
            configurarEventos();
            
            // Emitir evento de entrada
            socket.emit('entrar', username);
            
            // Esconder login e mostrar chat
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('chatScreen').style.display = 'flex';
            
            // Habilitar input e botão
            document.getElementById('inputMsg').disabled = false;
            document.getElementById('btnEnviar').disabled = false;
            document.getElementById('inputMsg').focus();
        }

        // SOLUÇÃO TODO 2: Configurar listeners de eventos
        function configurarEventos() {
            
            // Conexão estabelecida
            socket.on('connect', () => {
                console.log('✅ Conectado ao servidor');
                atualizarStatusConexao(true);
            });
            
            // Desconexão
            socket.on('disconnect', () => {
                console.log('❌ Desconectado do servidor');
                atualizarStatusConexao(false);
                adicionarMensagem({
                    texto: 'Conexão perdida. Tentando reconectar...'
                }, true);
            });
            
            // Erro de username
            socket.on('erroUsername', (mensagem) => {
                alert(mensagem);
                location.reload();
            });
            
            // Bem-vindo
            socket.on('bemVindo', (data) => {
                adicionarMensagem({
                    texto: data.mensagem
                }, true);
            });
            
            // Receber mensagem
            socket.on('mensagem', (data) => {
                adicionarMensagem(data);
                
                // Notificação sonora (opcional)
                if (data.username !== username) {
                    playNotificationSound();
                }
            });
            
            // Utilizador entrou
            socket.on('utilizadorEntrou', (data) => {
                adicionarMensagem(data, true);
            });
            
            // Utilizador saiu
            socket.on('utilizadorSaiu', (data) => {
                adicionarMensagem(data, true);
            });
            
            // Atualizar lista de utilizadores
            socket.on('listaUtilizadores', (utilizadores) => {
                atualizarListaUtilizadores(utilizadores);
            });
            
            // Alguém está a escrever
            socket.on('typing', (username) => {
                mostrarTyping(username);
            });
            
            // Parou de escrever
            socket.on('stopTyping', () => {
                esconderTyping();
            });
        }

        // SOLUÇÃO TODO 3: Função para enviar mensagem
        function enviarMensagem() {
            const input = document.getElementById('inputMsg');
            const texto = input.value.trim();
            
            if (texto === '') return;
            
            // Comandos especiais
            if (texto === '/clear') {
                document.getElementById('mensagens').innerHTML = '';
                input.value = '';
                return;
            }
            
            // Emitir mensagem
            socket.emit('mensagem', {
                texto: texto
            });
            
            // Limpar input
            input.value = '';
            input.focus();
            
            // Parar indicador de typing
            socket.emit('stopTyping');
        }

        // SOLUÇÃO TODO 4: Adicionar mensagem ao chat
        function adicionarMensagem(data, isSistema = false) {
            const div = document.getElementById('mensagens');
            const mensagemDiv = document.createElement('div');
            
            if (isSistema) {
                mensagemDiv.className = 'mensagem mensagem-sistema';
                mensagemDiv.textContent = data.texto;
            } else {
                mensagemDiv.className = 'mensagem';
                
                // Destacar próprias mensagens
                if (data.username === username) {
                    mensagemDiv.style.background = '#e8eaf6';
                }
                
                mensagemDiv.innerHTML = `
                    <div class="mensagem-header">
                        <span class="mensagem-username">${escapeHtml(data.username)}</span>
                        <span class="mensagem-hora">${data.hora}</span>
                    </div>
                    <div class="mensagem-texto">${escapeHtml(data.texto)}</div>
                `;
            }
            
            div.appendChild(mensagemDiv);
            div.scrollTop = div.scrollHeight; // Scroll automático para o fim
        }

        // SOLUÇÃO TODO 5: Detectar quando está a escrever
        document.getElementById('inputMsg')?.addEventListener('input', (e) => {
            if (e.target.value.trim() !== '') {
                socket.emit('typing', username);
                
                // Limpar timer anterior
                clearTimeout(typingTimer);
                
                // Criar novo timer para parar o typing
                typingTimer = setTimeout(() => {
                    socket.emit('stopTyping');
                }, TYPING_TIMER_LENGTH);
            } else {
                socket.emit('stopTyping');
            }
        });

        // Enviar com Enter
        document.getElementById('inputMsg')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });

        // Enter no login
        document.getElementById('usernameInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                entrarChat();
            }
        });

        // Funções auxiliares
        function atualizarListaUtilizadores(utilizadores) {
            const lista = document.getElementById('listaUtilizadores');
            const count = document.getElementById('onlineCount');
            
            lista.innerHTML = '';
            count.textContent = utilizadores.length;
            
            utilizadores.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'usuario-online';
                userDiv.textContent = user;
                
                // Destacar próprio utilizador
                if (user === username) {
                    userDiv.style.background = '#e8eaf6';
                    userDiv.style.fontWeight = 'bold';
                }
                
                lista.appendChild(userDiv);
            });
        }

        function mostrarTyping(user) {
            const typingDiv = document.getElementById('typing');
            typingDiv.textContent = `${user} está a escrever...`;
        }

        function esconderTyping() {
            const typingDiv = document.getElementById('typing');
            typingDiv.textContent = '';
        }

        function atualizarStatusConexao(online) {
            const status = document.getElementById('statusConexao');
            const dot = status.querySelector('.status-dot');
            
            if (online) {
                status.innerHTML = '<span class="status-dot"></span><span>Online</span>';
            } else {
                status.innerHTML = '<span class="status-dot offline"></span><span>Offline</span>';
            }
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function playNotificationSound() {
            // Criar beep simples (opcional)
            try {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(context.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
                
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.1);
            } catch (e) {
                // Som não disponível
            }
        }
    </script>
</body>
</html>
```

---

## 🎓 Conceitos-Chave para Discussão

### 1. Event-Driven Architecture
```javascript
// Eventos são fundamentais no Node.js
socket.on('evento', (dados) => {
    // Callback executado quando evento ocorre
});

socket.emit('evento', dados);
```

### 2. WebSockets vs HTTP
| Aspeto | HTTP | WebSockets |
|--------|------|------------|
| Direção | Unidirecional | Bidirecional |
| Conexão | Fecha após resposta | Mantém aberta |
| Overhead | Alto (headers) | Baixo |
| Latência | Maior | Menor |
| Use cases | RESTful APIs | Chat, Jogos, Real-time |

### 3. Socket.IO Features
- Reconexão automática
- Fallback para long polling
- Rooms e namespaces
- Broadcast seletivo
- Binary support

---

## 🔧 Debugging e Erros Comuns

### Erro 1: "io is not defined"
```
❌ Problema: Cliente abrindo file:// em vez de http://
✅ Solução: Sempre usar http://localhost:3000
```

### Erro 2: Porta em uso
```bash
# Encontrar processo na porta
lsof -i :3000          # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Matar processo
kill -9 <PID>          # Mac/Linux
taskkill /PID <PID> /F # Windows
```

### Erro 3: CORS
```javascript
// Se necessário, configurar CORS
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
```

---

## 🌟 Extensões e Melhorias Sugeridas

### 1. Persistência com Base de Dados
```javascript
// Guardar mensagens em MongoDB
const mongoose = require('mongoose');

const MensagemSchema = new mongoose.Schema({
    username: String,
    texto: String,
    timestamp: Date
});

socket.on('mensagem', async (data) => {
    const msg = new Mensagem(data);
    await msg.save();
    io.emit('mensagem', data);
});
```

### 2. Autenticação
```javascript
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (verificarToken(token)) {
        next();
    } else {
        next(new Error('Autenticação falhou'));
    }
});
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10 // máximo 10 mensagens por minuto
});

app.use('/api/', limiter);
```

---

## 📊 Critérios de Avaliação (se aplicável)

| Critério | Pontos | Descrição |
|----------|--------|-----------|
| Servidor HTTP básico | 20% | Funciona corretamente |
| Rotas dinâmicas | 20% | Implementa múltiplas rotas |
| Chat Socket.IO | 40% | Funcional e completo |
| Código limpo | 10% | Bem organizado e comentado |
| Funcionalidades extra | 10% | Desafios implementados |

---

## 📚 Recursos Adicionais para o Professor

### Exemplos de Demonstração ao Vivo

1. **Demonstrar Event Loop**:
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// Output: 1, 3, 2 (explicar porquê)
```

2. **Comparar Síncrono vs Assíncrono**:
```javascript
// Síncrono (bloqueia)
const fs = require('fs');
const data = fs.readFileSync('file.txt');

// Assíncrono (não bloqueia)
fs.readFile('file.txt', (err, data) => {
    // Callback
});
```

### Perguntas para Discussão

1. Por que Node.js é single-threaded mas consegue lidar com milhares de conexões?
2. Qual a diferença entre `socket.emit()` e `socket.broadcast.emit()`?
3. Como implementariam mensagens privadas entre dois utilizadores?
4. Como escalariam este chat para milhões de utilizadores?

---

**Última atualização:** Outubro 2025  
**Versão:** Professor v1.0  
**Repositório:** https://github.com/CD-ipca/exercicios  
**Dúvidas:** fmanso@ipca.pt
