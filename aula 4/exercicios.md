# Aula 3 - Node.js e Comunicação em Tempo Real
## Exercícios Práticos

**Disciplina:** Computação Distribuída  
**Professor:** Filipe Gomes Manso  
**IPCA** - Instituto Politécnico do Cávado e do Ave

---

## 🎯 Objetivos da Aula

- Compreender fundamentos do Node.js e modelo event-driven
- Criar servidores HTTP com Node.js puro
- Implementar comunicação em tempo real com Socket.IO
- Desenvolver uma aplicação de chat distribuído

---

## 📚 Recursos de Documentação

### Node.js Core
- [Node.js Documentation](https://nodejs.org/docs)
- [HTTP Module](https://nodejs.org/api/http.html)
- [File System (fs)](https://nodejs.org/api/fs.html)

### Socket.IO
- [Socket.IO Documentation](https://socket.io/docs/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Server API](https://socket.io/docs/v4/server-api/)

### NPM
- [NPM Documentation](https://docs.npmjs.com/)
- [package.json Guide](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)

---

## 🛠️ Parte 1: Configuração Inicial

### 1.1 Verificar Instalações

```bash
# Verificar versões instaladas
node --version
npm --version
```

**Versões mínimas requeridas:**
- Node.js: v18.x ou superior
- npm: v9.x ou superior

### 1.2 Criar Estrutura do Projeto

```bash
mkdir aula04-nodejs-socketio
cd aula04-nodejs-socketio
npm init -y
```

### 1.3 Instalar Dependências

```bash
npm install express socket.io
npm install nodemon --save-dev
```

**NOTA:** Nodemon é um pacote que ajuda o servidor a manter-se online e atualizar mediante alterações de código 
sem necessidade de recompilar e reiniciar o servidor

**✅ Checkpoint:** Todos devem ter o ambiente configurado antes de prosseguir.

---

## 💻 Exercício 1: Servidor HTTP Básico com Node.js Puro

### Objetivo
Criar um servidor HTTP simples usando apenas o módulo `http` nativo do Node.js.

### Instruções

Criar o ficheiro `server-basico.js`:

```javascript
// server-basico.js
const http = require('http');

const PORT = 3000;

// TODO 1: Criar o servidor HTTP
// Dica: Use http.createServer() com função callback (req, res)
const server = http.createServer((req, res) => {
    
    // TODO 2: Definir status code e headers
    
    // TODO 3: Enviar resposta HTML
    
    
});

// TODO 4: Colocar servidor à escuta na porta


```

### Testar

```bash
node server-basico.js
```

Aceder no navegador: `http://localhost:3000`

### 🤔 Questões para Reflexão

1. O que acontece se tentar iniciar o servidor duas vezes na mesma porta?
2. Como o Node.js consegue lidar com múltiplos pedidos simultaneamente?
3. Qual a diferença entre `res.write()` e `res.end()`?

---

## 💻 Exercício 2: Servidor com Rotas Dinâmicas

### Objetivo
Implementar um servidor que responde de forma diferente dependendo da rota acedida.

### Instruções

Criar o ficheiro `server-rotas.js`:

```javascript
// server-rotas.js
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
    
    console.log(`Pedido recebido: ${req.method} ${req.url}`);
    
    // TODO 1: Implementar rota para "/"
    // Deve retornar página HTML de boas-vindas
    if (req.url === '/') {
        // COMPLETAR
        
        
    } 
    // TODO 2: Implementar rota para "/sobre"
    // Deve retornar informações sobre o projeto
    else if (req.url === '/sobre') {
        // COMPLETAR
        
        
    } 
    // TODO 3: Implementar rota para "/api/info"
    // Deve retornar JSON com informações do servidor
    else if (req.url === '/api/info') {
        // COMPLETAR
        // Dica: Usa JSON.stringify() e Content-Type: 'application/json'
        
        
    } 
    // TODO 4: Implementar resposta 404 para rotas não encontradas
    else {
        // COMPLETAR
        
        
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('Rotas disponíveis:');
    console.log('  GET /');
    console.log('  GET /sobre');
    console.log('  GET /api/info');
});
```

### Testar

URLs para testar:
- `http://localhost:3000/`
- `http://localhost:3000/sobre`
- `http://localhost:3000/api/info`
- `http://localhost:3000/naoexiste`

### 🤔 Questões para Reflexão

1. Como implementar rotas dinâmicas (ex: `/user/:id`)?
2. Como lidar com diferentes métodos HTTP (GET, POST, PUT, DELETE)?
3. Qual a limitação de usar apenas o módulo `http`?

---

## 💻 Exercício 3: Chat em Tempo Real com Socket.IO

### Objetivo
Criar uma aplicação de chat funcional com comunicação bidirecional em tempo real.

### 3.1 Criar o Servidor

Criar o ficheiro `chat-server.js`:

```javascript
// chat-server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Servir ficheiros estáticos
app.use(express.static('public'));

// TODO 1: Rota principal para servir o HTML do chat
app.get('/', (req, res) => {
    // COMPLETAR: Use res.sendFile() para enviar public/index.html
    
});

// Array para guardar utilizadores conectados
let utilizadoresOnline = [];

// TODO 2: Evento de conexão de cliente
io.on('connection', (socket) => {
    console.log('🟢 Novo utilizador conectado:', socket.id);
    
    // TODO 3: Evento para utilizador entrar no chat
    socket.on('entrar', (username) => {
        // COMPLETAR:
        // 1. Adicionar username ao socket
        // 2. Adicionar à lista de utilizadores online
        // 3. Emitir evento 'utilizadorEntrou' para todos
        // 4. Emitir lista atualizada de utilizadores
        
        
    });
    
    // TODO 4: Evento para receber mensagem
    socket.on('mensagem', (data) => {
        // COMPLETAR:
        // 1. Criar objeto mensagem completo
        // 2. Fazer broadcast da mensagem para todos os clientes
        
        
    });
    
    // TODO 5: Evento para "utilizador está a escrever"
    socket.on('typing', (username) => {
        // COMPLETAR: Fazer broadcast para todos exceto o remetente
        
    });
    
    // TODO 6: Evento de desconexão
    socket.on('disconnect', () => {
        // COMPLETAR:
        // 1. Remover utilizador da lista
        // 2. Emitir evento 'utilizadorSaiu' para todos
        // 3. Emitir lista atualizada de utilizadores
        
        
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Chat servidor rodando em http://localhost:${PORT}`);
});
```

### 3.2 Criar o Cliente HTML

Criar a pasta `public` e o ficheiro `public/index.html`:

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
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 800px;
            height: 600px;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: #667eea;
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .main-content {
            display: flex;
            flex: 1;
            overflow: hidden;
        }
        .sidebar {
            width: 200px;
            background: #f5f5f5;
            padding: 15px;
            border-right: 1px solid #ddd;
            overflow-y: auto;
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
        .mensagem {
            margin-bottom: 15px;
            padding: 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .mensagem-sistema {
            background: #e3f2fd;
            color: #1976d2;
            text-align: center;
            font-style: italic;
        }
        .input-area {
            padding: 15px;
            background: white;
            border-top: 1px solid #ddd;
            display: flex;
            gap: 10px;
        }
        #inputMsg {
            flex: 1;
            padding: 10px;
            border: 2px solid #667eea;
            border-radius: 5px;
            font-size: 14px;
        }
        button {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover {
            background: #5568d3;
        }
        .usuario-online {
            padding: 8px;
            margin-bottom: 5px;
            background: white;
            border-radius: 3px;
            font-size: 14px;
        }
        #typing {
            padding: 10px;
            font-style: italic;
            color: #999;
            min-height: 30px;
        }
        .login-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .login-screen input {
            margin: 10px 0;
            padding: 10px;
            width: 250px;
            border: 2px solid #667eea;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Ecrã de Login -->
        <div id="loginScreen" class="login-screen">
            <h2>Bem-vindo ao Chat!</h2>
            <input type="text" id="usernameInput" placeholder="Digite seu nome..." maxlength="20">
            <button onclick="entrarChat()">Entrar</button>
        </div>

        <!-- Ecrã do Chat (inicialmente escondido) -->
        <div id="chatScreen" style="display: none; flex-direction: column; height: 100%;">
            <div class="header">
                <h2>💬 Chat em Tempo Real</h2>
                <span id="statusConexao">🟢 Online</span>
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

        // TODO 1: Função para entrar no chat
        function entrarChat() {
            const input = document.getElementById('usernameInput');
            username = input.value.trim();
            
            if (username === '') {
                alert('Por favor, digite um nome!');
                return;
            }
            
            // COMPLETAR:
            // 1. Conectar ao Socket.IO: socket = io();
            // 2. Emitir evento 'entrar' com o username
            // 3. Esconder loginScreen e mostrar chatScreen
            // 4. Habilitar input e botão
            // 5. Configurar listeners dos eventos
            
            
        }

        // TODO 2: Configurar listeners dos eventos Socket.IO
        function configurarEventos() {
            // Evento: Conexão estabelecida
            socket.on('connect', () => {
                // COMPLETAR
                
            });
            
            // Evento: Receber mensagem
            socket.on('mensagem', (data) => {
                // COMPLETAR: Chamar adicionarMensagem()
                
            });
            
            // Evento: Utilizador entrou
            socket.on('utilizadorEntrou', (data) => {
                // COMPLETAR: Mostrar mensagem de sistema
                
            });
            
            // Evento: Utilizador saiu
            socket.on('utilizadorSaiu', (data) => {
                // COMPLETAR: Mostrar mensagem de sistema
                
            });
            
            // Evento: Atualizar lista de utilizadores
            socket.on('listaUtilizadores', (utilizadores) => {
                // COMPLETAR: Atualizar sidebar
                
            });
            
            // Evento: Alguém está a escrever
            socket.on('typing', (username) => {
                // COMPLETAR: Mostrar indicador
                
            });
        }

        // TODO 3: Função para enviar mensagem
        function enviarMensagem() {
            const input = document.getElementById('inputMsg');
            const texto = input.value.trim();
            
            if (texto === '') return;
            
            // COMPLETAR:
            // 1. Emitir evento 'mensagem' com dados
            // 2. Limpar input
            
            
        }

        // TODO 4: Função para adicionar mensagem ao chat
        function adicionarMensagem(data, isSistema = false) {
            const div = document.getElementById('mensagens');
            const mensagemDiv = document.createElement('div');
            mensagemDiv.className = isSistema ? 'mensagem mensagem-sistema' : 'mensagem';
            
            if (isSistema) {
                mensagemDiv.textContent = data.texto;
            } else {
                // COMPLETAR: Formatar mensagem com username, texto e hora
                
            }
            
            div.appendChild(mensagemDiv);
            div.scrollTop = div.scrollHeight; // Scroll automático
        }

        // TODO 5: Detectar quando utilizador está a escrever
        document.getElementById('inputMsg')?.addEventListener('input', () => {
            // COMPLETAR:
            // 1. Limpar timer anterior
            // 2. Emitir evento 'typing'
            // 3. Criar novo timer para parar o "typing"
            
        });

        // Enviar mensagem com tecla Enter
        document.getElementById('inputMsg')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });
    </script>
</body>
</html>
```

### 3.3 Executar o Chat

```bash
node chat-server.js
```

Abrir no navegador: `http://localhost:3000`

**Teste com múltiplas abas/janelas/browsers para simular vários utilizadores!**

### 🤔 Questões para Reflexão

1. Como garantir que as mensagens são entregues na ordem correta?
2. O que acontece se um utilizador perder a conexão temporariamente?
3. Como implementar mensagens privadas entre dois utilizadores?
4. Como persistir o histórico de mensagens numa base de dados?

---

## 🌟 Desafios Extra

### Desafio 1: Funcionalidades Adicionais
Adicione as seguintes funcionalidades ao chat:

- ✅ Timestamp nas mensagens
- ✅ Notificação sonora para novas mensagens
- ✅ Diferentes cores para diferentes utilizadores
- ✅ Comando `/clear` para limpar o chat
- ✅ Validação de nomes de utilizador duplicados

### Desafio 2: Rooms (Salas de Chat)
Implemente suporte para múltiplas salas:

```javascript
// Exemplo de estrutura
socket.on('entrarSala', (nomeSala) => {
    socket.join(nomeSala);
    io.to(nomeSala).emit('mensagem', {...});
});
```

### Desafio 3: Partilha de Ficheiros
Adicione capacidade de enviar imagens/ficheiros pequenos via Socket.IO.

### Desafio 4: Mensagens Privadas
Implemente sistema de mensagens diretas entre utilizadores:

```javascript
socket.on('mensagemPrivada', ({ paraSocketId, mensagem }) => {
    io.to(paraSocketId).emit('mensagemPrivada', {...});
});
```

---

## 📚 Trabalho para Casa

### 1. Melhorar o Chat

Escolha pelo menos 2 desafios extra e implementa-os.

### 2. Explorar Conceitos

Pesquise sobre:
- Event Loop do Node.js em profundidade
- WebSockets vs Long Polling
- Socket.IO Namespaces e Rooms
- Escalabilidade de aplicações Socket.IO


---

## 🔗 Recursos Adicionais

### Documentação Oficial
- [Node.js API Docs](https://nodejs.org/api/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Tutoriais Recomendados
- [Node.js Tutorial - W3Schools](https://www.w3schools.com/nodejs/)
- [Socket.IO Chat Tutorial](https://socket.io/get-started/chat)
- [Understanding Event Loop](https://nodejs.dev/learn/the-nodejs-event-loop)

### Ferramentas Úteis
- [Postman](https://www.postman.com/) - Testar APIs
- [Nodemon](https://nodemon.io/) - Auto-restart durante desenvolvimento
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debug de WebSockets

---

## 📝 Entrega

**Não há entrega formal destes exercícios**, mas recomenda-se:
- Guardar o código no vosso repositório Git
- Experimentar e modificar os exemplos
- Preparar dúvidas para discussão na próxima aula

---

**Última atualização:** Outubro 2025  
**Versão:** Alunos v1.0  
**Dúvidas:** fmanso@ipca.pt
