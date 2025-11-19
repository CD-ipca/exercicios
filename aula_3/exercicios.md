# Aula 3 - Introdução ao Node.js e Express
## Exercícios Práticos

**Disciplina:** Computação Distribuída 
**Professor:** Filipe Gomes Manso
**IPCA - Instituto Politécnico do Cávado e do Ave**

---

## 🎯 Objetivos da Aula

- Compreender os fundamentos do Node.js
- Entender o Event Loop e modelo assíncrono
- Criar o primeiro servidor web com Node.js
- Implementar um servidor RESTful básico com Express.js
- Comparar implementação Node.js vs Java Spring Boot

---

## 📚 Recursos de Documentação

**Antes de começar, familiarize-se com estas referências:**

### Node.js Core
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [HTTP Module](https://nodejs.org/docs/latest/api/http.html)
- [File System (fs)](https://nodejs.org/docs/latest/api/fs.html)

### Express.js
- [Express.js Getting Started](https://expressjs.com/en/starter/installing.html)
- [Express Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Express Request Object](https://expressjs.com/en/4x/api.html#req)
- [Express Response Object](https://expressjs.com/en/4x/api.html#res)

### NPM
- [NPM Documentation](https://docs.npmjs.com/)
- [package.json Guide](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

### CRUD - Muito importante leitura
- [CRUD](https://www.geeksforgeeks.org/java/what-is-the-difference-between-put-post-and-patch-in-restful-api/)
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
mkdir aula03
cd aula03
npm init -y
```

### 1.3 Instalar Dependências

```bash
npm install express
npm install nodemon --save-dev
```

**✅ Checkpoint:** Todos devem ter o ambiente configurado antes de prosseguir.

---

## 💻 Exercício 1: Servidor HTTP Básico com Node.js Puro

### Objetivo
Criar um servidor HTTP simples usando apenas o módulo `http` nativo do Node.js.

### Instruções

Criar o ficheiro `server-basico.js`:

```javascript
// server-basico.js
// Importar o módulo http
const http = require('http');

// Definir a porta
const PORT = 3000;

// TODO 1: Criar o servidor usando http.createServer()
// Dica: A documentação é a melhor amiga do developer
// e do Node.js HTTP Module
// O callback recebe dois parâmetros: request e response
const server = http.createServer((req, res) => {
    
    // TODO 2: Definir o status code e headers da Response
    // Dica: Use res.writeHead(statusCode, headers)
    // Status: 200, Content-Type: 'text/html; charset=utf-8'
    
    
    // TODO 3: Criar uma Response HTML simples
    // Dica: Use res.end() para enviar a response
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Meu Primeiro Servidor Node.js</title>
        </head>
        <body>
            <h1>🚀 Servidor Node.js Funcionando!</h1>
            <p>Este é meu primeiro servidor HTTP.</p>
            <p>URL acedido: ${req.url}</p>
            <p>Método HTTP: ${req.method}</p>
        </body>
        </html>
    `;
    
    // Enviar a response (COMPLETAR ESTA LINHA)
    
});

// TODO 4: Iniciar o servidor
// Dica: Use server.listen(PORT, callback)
// O callback deve exibir uma mensagem no console


```

### Testar

```bash
node server-basico.js
```

Aceder no navegador: `http://localhost:3000`

### 🤔 Questões para Reflexão

1. O que acontece se aceder uma URL diferente (ex: `/teste`)?
2. Como poderia implementar rotas diferentes?
3. Qual a limitação de usar apenas o módulo `http`?

---

## 💻 Exercício 2: Rotas Dinâmicas com Node.js

### Objetivo
Implementar um servidor que responde de forma diferente dependendo da rota acedida.

### Instruções

Criar o ficheiro `server-rotas.js`:

```javascript
// server-rotas.js
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
    
    // TODO 1: Implementar diferentes responses baseadas em req.url
    // Rotas a implementar:
    // - "/" → Página inicial
    // - "/sobre" → Página sobre
    // - "/api/dados" → Retornar JSON
    // - Qualquer outra → 404 Not Found
    
    if (req.url === '/') {
        // TODO 2: Completar response para página inicial
        res.writeHead(/* COMPLETAR: status code */, { /* COMPLETAR: headers */ });
        res.end('<h1>Página Inicial</h1><p>Bem-vindo ao servidor Node.js!</p>');
        
    } else if (req.url === '/sobre') {
        // TODO 3: Completar response para página sobre
        // Deve retornar HTML com informações sobre o projeto
        
        
    } else if (req.url === '/api/dados') {
        // TODO 4: Retornar dados em formato JSON
        // Dica: Use JSON.stringify() para converter objeto em string
        // Content-Type deve ser 'application/json'
        
        const dados = {
            mensagem: 'Dados do servidor',
            timestamp: new Date().toISOString(),
            servidor: 'Node.js',
            versao: process.version
        };
        
        // COMPLETAR: Configurar headers e enviar resposta JSON
        
        
    } else {
        // TODO 5: Implementar resposta 404
        // Status code: 404
        // Retornar HTML informando que a página não foi encontrada
        
        
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor à escuta em http://localhost:${PORT}`);
});
```

### Testar

```bash
node server-rotas.js
```

**URLs para testar:**
- `http://localhost:3000/`
- `http://localhost:3000/sobre`
- `http://localhost:3000/api/dados`
- `http://localhost:3000/feriado`

### 🤔 Questões para Reflexão

1. Como lidar com rotas dinâmicas (ex: `/user/:id`)?
2. Como implementar diferentes métodos HTTP (GET, POST, PUT, DELETE)?
   [CRUD](https://www.geeksforgeeks.org/java/what-is-the-difference-between-put-post-and-patch-in-restful-api/)
---

## 💻 Exercício 3: Primeiro Servidor Express.js

### Objetivo
Criar um servidor usando Express.js e comparar com Node.js puro.
[CRUD](https://www.geeksforgeeks.org/java/what-is-the-difference-between-put-post-and-patch-in-restful-api/)

### Instruções

Criar o ficheiro `server-express.js`:

```javascript
// server-express.js
// TODO 1: Importar o Express
// Dica: const express = require('express');


const app = express();
const PORT = 3000;

// TODO 2: Configurar middleware para parsear JSON
// Dica: app.use(express.json());


// TODO 3: Implementar rota GET para página inicial
// Dica: app.get('/rota', (req, res) => { ... })
// Rota: '/'
// Resposta: Objeto JSON com mensagem de boas-vindas


// TODO 4: Implementar rota GET /sobre
// Retornar objeto JSON com informações sobre o servidor


// TODO 5: Implementar rota GET /api/hora
// Retornar a hora atual do servidor em formato JSON
// Dica: Use new Date().toISOString()


// TODO 6: Implementar rota POST /api/echo
// Deve retornar de volta o que receber no body
// Dica: O body está em req.body
app.post('/api/echo', (req, res) => {
    // COMPLETAR
    
});

// TODO 7: Implementar rota GET com parâmetro dinâmico
// Rota: /api/saudacao/:nome
// Exemplo: /api/saudacao/Pedro → retornar "Olá, Pedro!"
// Dica: Use req.params.nome


// TODO 8: Implementar middleware para rotas não encontradas (404)
// Este deve ser o último middleware
// Dica: app.use((req, res) => { ... })


// TODO 9: Iniciar o servidor
// Dica: app.listen(PORT, callback)

```

### Configurar script no package.json

Edite `package.json` e adicione na seção `scripts`:

```json
"scripts": {
  "start": "node server-express.js",
  "dev": "nodemon server-express.js"
}
```

### Testar

```bash
npm run dev
```

**Testar com curl ou Postman:**

```bash
# GET /
curl http://localhost:3000/

# GET /sobre
curl http://localhost:3000/sobre

# GET /api/hora
curl http://localhost:3000/api/hora

# POST /api/echo
curl -X POST http://localhost:3000/api/echo \
  -H "Content-Type: application/json" \
  -d '{"mensagem":"Olá Express"}'

# GET /api/saudacao/Pedro
curl http://localhost:3000/api/saudacao/Pedro
```

### 🤔 Questões para Reflexão

1. Quais as vantagens do Express sobre Node.js puro?
2. O que são middlewares e para que servem?
3. Como lidar com erros no Express?

---

## 💻 Exercício 4: API RESTful Simples - Gestor de Tarefas

### Objetivo
Criar uma API REST completa para gerir uma lista de tarefas (CRUD).
[CRUD](https://www.geeksforgeeks.org/java/what-is-the-difference-between-put-post-and-patch-in-restful-api/)

### Instruções

Criar o ficheiro `api-tarefas.js`:

```javascript
// api-tarefas.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Base de dados simulada (em memória)
let tarefas = [
    { id: 1, titulo: 'Estudar Node.js', completa: false },
    { id: 2, titulo: 'Fazer exercícios', completa: false },
    { id: 3, titulo: 'Preparar projeto', completa: true }
];

let proximoId = 4;

// TODO 1: GET /api/tarefas - Listar todas as tarefas
// Retornar array de tarefas


// TODO 2: GET /api/tarefas/:id - Obter uma tarefa específica
// Dica: Use find() para procurar pelo id
// Retornar 404 se não encontrar


// TODO 3: POST /api/tarefas - Criar nova tarefa
// Body esperado: { "titulo": "Nova tarefa" }
// Adicionar id automaticamente
// Retornar status 201 e a tarefa criada
app.post('/api/tarefas', (req, res) => {
    // COMPLETAR: Validar se titulo existe
    
    
    // COMPLETAR: Criar nova tarefa
    const novaTarefa = {
        id: proximoId++,
        titulo: /* COMPLETAR */,
        completa: false
    };
    
    // COMPLETAR: Adicionar ao array e retornar resposta
    
});

// TODO 4: PUT /api/tarefas/:id - Atualizar tarefa
// Body esperado: { "titulo": "...", "completa": true/false }
// Retornar 404 se não encontrar


// TODO 5: DELETE /api/tarefas/:id - Remover tarefa
// Dica: Use filter() ou splice()
// Retornar 404 se não encontrar
// Retornar 204 (No Content) em caso de sucesso


// TODO 6: GET /api/tarefas/stats - Estatísticas
// Retornar: total, completas, pendentes


// Middleware 404
app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`📋 API de Tarefas à escuta em http://localhost:${PORT}`);
    console.log('Endpoints disponíveis:');
    console.log('  GET    /api/tarefas');
    console.log('  GET    /api/tarefas/:id');
    console.log('  POST   /api/tarefas');
    console.log('  PUT    /api/tarefas/:id');
    console.log('  DELETE /api/tarefas/:id');
    console.log('  GET    /api/tarefas/stats');
});
```

### Testar a API

```bash
# Listar todas
curl http://localhost:3000/api/tarefas

# Obter uma específica
curl http://localhost:3000/api/tarefas/1

# Criar nova
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nova tarefa de teste"}'

# Atualizar
curl -X PUT http://localhost:3000/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Tarefa atualizada","completa":true}'

# Remover
curl -X DELETE http://localhost:3000/api/tarefas/1

# Estatísticas
curl http://localhost:3000/api/tarefas/stats
```

---

## 💻 Exercício 5: Backend Java com Spring Boot (DESAFIO)

### Objetivo
Implementar a mesma API de tarefas usando Java e Spring Boot para comparar as abordagens.

### Pré-requisitos
- Java JDK 17 ou superior
- Maven ou Gradle

### Instruções

Criar a estrutura do projeto Spring Boot:

```bash
# Visitar: https://start.spring.io/
# Configurações:
# - Project: Maven
# - Language: Java
# - Spring Boot: 3.x
# - Dependencies: Spring Web
```

Criar o ficheiro `TarefaController.java`:

```java
// src/main/java/com/exemplo/tarefas/controller/TarefaController.java
package com.exemplo.tarefas.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {
    
    // Base de dados simulada
    private List<Tarefa> tarefas = new ArrayList<>(Arrays.asList(
        new Tarefa(1L, "Estudar Java", false),
        new Tarefa(2L, "Fazer exercícios", false),
        new Tarefa(3L, "Preparar projeto", true)
    ));
    
    private Long proximoId = 4L;
    
    // TODO 1: Implementar GET /api/tarefas
    // Anotação: @GetMapping
    // Retornar: List<Tarefa>
    @GetMapping
    public /* COMPLETAR */ listarTodas() {
        // COMPLETAR
        
    }
    
    // TODO 2: Implementar GET /api/tarefas/{id}
    // Anotação: @GetMapping("/{id}")
    // Parâmetro: @PathVariable Long id
    // Retornar: ResponseEntity<Tarefa>
    
    
    // TODO 3: Implementar POST /api/tarefas
    // Anotação: @PostMapping
    // Parâmetro: @RequestBody Tarefa tarefa
    // Retornar: ResponseEntity<Tarefa> com status 201
    
    
    // TODO 4: Implementar PUT /api/tarefas/{id}
    // Anotação: @PutMapping("/{id}")
    
    
    // TODO 5: Implementar DELETE /api/tarefas/{id}
    // Anotação: @DeleteMapping("/{id}")
    // Retornar: ResponseEntity<Void> com status 204
    
}

// TODO 6: Criar classe Tarefa
// src/main/java/com/exemplo/tarefas/model/Tarefa.java
class Tarefa {
    private Long id;
    private String titulo;
    private Boolean completa;
    
    // COMPLETAR: Construtor, getters e setters
    
}
```

### Recursos de Referência Java/Spring

- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Spring Web Annotations](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/package-summary.html)
- [ResponseEntity](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/ResponseEntity.html)

---

## 📊 Parte Final: Comparação e Reflexão

### Tabela Comparativa

| Aspecto | Node.js/Express | Java/Spring Boot |
|---------|----------------|------------------|
| **Linhas de código** | ? | ? |
| **Tempo de setup** | ? | ? |
| **Facilidade de leitura** | ? | ? |
| **Performance percebida** | ? | ? |
| **Tipagem** | Dinâmica | Estática |

### 🤔 Questões para Discussão

1. **Qual abordagem preferem e porquê?**
2. **Quando escolheriam Node.js vs Java?**
3. **Que desafios encontraram em cada tecnologia?**
4. **Como é o modelo assíncrono do Node.js comparado com Java?**

---

## 📚 Trabalho para Casa

### 1. Melhorar a API de Tarefas

Adicione as seguintes funcionalidades:

- **Validação de dados**: Verificar se o título não está vazio
- **Filtros**: GET /api/tarefas?completa=true
- **Ordenação**: GET /api/tarefas?ordenar=titulo
- **Paginação**: GET /api/tarefas?pagina=1&limite=10

### 2. Explorar Conceitos

Pesquise sobre:

- **Event Loop** do Node.js
- **Callbacks vs Promises vs Async/Await**
- **Diferença entre `require` e `import` em Node.js**

### 3. Preparação para Próxima Aula

- Ler sobre **Socket.IO** para comunicação em tempo real
- Instalar Socket.IO: `npm install socket.io`
- Rever conceitos de **WebSockets**

---

## 🔗 Recursos Adicionais

### Documentação Oficial
- [Node.js API Docs](https://nodejs.org/api/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MDN HTTP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP)

### Tutoriais Recomendados
- [Node.js Tutorial - W3Schools](https://www.w3schools.com/nodejs/)
- [Express.js Tutorial](https://expressjs.com/en/starter/hello-world.html)
- [RESTful API Design](https://restfulapi.net/)

### Ferramentas Úteis
- **Postman**: Para testar APIs - https://www.postman.com/
- **Insomnia**: Alternativa ao Postman - https://insomnia.rest/
- **Thunder Client**: Extensão do VS Code

---

## ✅ Checklist de Conclusão

Antes de terminar a aula, confirme que conseguiu:

- [ ] Criar um servidor HTTP básico com Node.js puro
- [ ] Implementar rotas dinâmicas
- [ ] Criar servidor com Express.js
- [ ] Implementar API RESTful completa (CRUD)
- [ ] (Desafio) Implementar backend Java equivalente
- [ ] Comparar as duas abordagens
- [ ] Testar todas as rotas com curl ou Postman

---

**Última atualização:** Outubro 2025  
**Repositório:** https://github.com/CD-ipca/exercicios  
**Dúvidas:** fmanso@ipca.pt
