# Aula 3 - Introdução ao Node.js e Express
## Exercícios Práticos - VERSÃO SOLUÇÕES COMPLETAS

**Disciplina:** Computação Distribuída 
**Professor:** Filipe Gomes Manso
**IPCA - Instituto Politécnico do Cávado e do Ave**

---

## 🎯 Notas Pedagógicas

### Objetivos de Aprendizagem
- Compreender fundamentos do Node.js e modelo event-driven
- Dominar criação de servidores HTTP nativos
- Implementar APIs RESTful com Express.js
- Comparar diferentes tecnologias backend (Node.js vs Java)


### Pontos de Atenção
- Garantir que todos têm Node.js instalado antes de começar
- Alguns alunos podem ter dificuldade com callbacks/promises
- Enfatizar diferenças entre código síncrono e assíncrono
- Preparar exemplos de erros comuns (portas em uso, JSON malformado)

---

## 💻 Exercício 1: Servidor HTTP Básico - SOLUÇÃO COMPLETA

```javascript
// server-basico.js
const http = require('http');

const PORT = 3000;

// SOLUÇÃO TODO 1: Criar o servidor
const server = http.createServer((req, res) => {
    
    // SOLUÇÃO TODO 2: Definir status code e headers
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    // SOLUÇÃO TODO 3: Criar resposta HTML
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Meu Primeiro Servidor Node.js</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .info {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            </style>
        </head>
        <body>
            <div class="info">
                <h1>🚀 Servidor Node.js online!</h1>
                <p>Este é meu primeiro servidor HTTP.</p>
                <p><strong>URL acedido:</strong> ${req.url}</p>
                <p><strong>Método HTTP:</strong> ${req.method}</p>
                <p><strong>Headers:</strong></p>
                <pre>${JSON.stringify(req.headers, null, 2)}</pre>
            </div>
        </body>
        </html>
    `;
    
    // Enviar a resposta
    res.end(html);
});

// SOLUÇÃO TODO 4: Iniciar o servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor online em http://localhost:${PORT}`);
    console.log(`📝 Pressione Ctrl+C para parar o servidor`);
});

// Tratamento de erros
server.on('error', (erro) => {
    if (erro.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso!`);
    } else {
        console.error('❌ Erro no servidor:', erro);
    }
});
```

### Conceitos-Chave a Enfatizar

1. **http.createServer()**: Função que cria instância do servidor HTTP
2. **Request object**: Contém informações da requisição (url, method, headers)
3. **Response object**: Usado para enviar resposta ao cliente
4. **res.writeHead()**: Define status code e headers
5. **res.end()**: Finaliza resposta e envia ao cliente

### Extensões Possíveis

```javascript
// Adicionar logging de requisições
server.on('request', (req) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
});
```

---

## 💻 Exercício 2: Rotas Dinâmicas - SOLUÇÃO COMPLETA

```javascript
// server-rotas.js
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
    
    // Log da requisição
    console.log(`📨 ${req.method} ${req.url}`);
    
    // SOLUÇÃO TODO 1-5: Implementar rotas
    if (req.url === '/') {
        // Página inicial
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Página Inicial</title>
                <style>
                    body { font-family: Arial; max-width: 800px; margin: 50px auto; }
                    nav { margin: 20px 0; }
                    nav a { margin-right: 15px; color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>🏠 Página Inicial</h1>
                <p>Bem-vindo ao servidor Node.js!</p>
                <nav>
                    <a href="/">Início</a>
                    <a href="/sobre">Sobre</a>
                    <a href="/api/dados">API</a>
                </nav>
                <h2>Funcionalidades</h2>
                <ul>
                    <li>Servidor HTTP nativo do Node.js</li>
                    <li>Rotas dinâmicas</li>
                    <li>Suporte a JSON</li>
                    <li>Tratamento de 404</li>
                </ul>
            </body>
            </html>
        `);
        
    } else if (req.url === '/sobre') {
        // Página sobre
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sobre</title>
                <style>
                    body { font-family: Arial; max-width: 800px; margin: 50px auto; }
                    .card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1>📖 Sobre o Projeto</h1>
                <div class="card">
                    <h2>Computação Distribuída - Aula 3</h2>
                    <p><strong>Instituição:</strong> IPCA</p>
                    <p><strong>Disciplina:</strong> Computação Distribuída (322023)</p>
                    <p><strong>Tecnologia:</strong> Node.js ${process.version}</p>
                    <p><strong>Sistema:</strong> ${process.platform}</p>
                    <p><strong>Arquitetura:</strong> ${process.arch}</p>
                </div>
                <a href="/">← Voltar</a>
            </body>
            </html>
        `);
        
    } else if (req.url === '/api/dados') {
        // API JSON
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        
        const dados = {
            mensagem: 'Dados do servidor',
            timestamp: new Date().toISOString(),
            servidor: 'Node.js',
            versao: process.version,
            uptime: process.uptime(),
            memoria: {
                usada: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            },
            ambiente: {
                plataforma: process.platform,
                arquitetura: process.arch,
                nodeEnv: process.env.NODE_ENV || 'development'
            }
        };
        
        res.end(JSON.stringify(dados, null, 2));
        
    } else {
        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Não Encontrado</title>
                <style>
                    body { 
                        font-family: Arial; 
                        max-width: 800px; 
                        margin: 50px auto; 
                        text-align: center;
                    }
                    .error { color: #dc3545; }
                </style>
            </head>
            <body>
                <h1 class="error">404 - Página Não Encontrada</h1>
                <p>A rota <code>${req.url}</code> não existe neste servidor.</p>
                <p><a href="/">← Voltar à página inicial</a></p>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('Rotas disponíveis:');
    console.log('  GET  /');
    console.log('  GET  /sobre');
    console.log('  GET  /api/dados');
});
```

### Conceitos-Chave a Enfatizar

1. **Roteamento manual**: Uso de if/else para diferentes rotas
2. **Content-Type**: Importância de definir tipo de conteúdo correto
3. **Status Codes**: 200 (OK), 404 (Not Found)
4. **process object**: Informações sobre o ambiente Node.js
5. **JSON.stringify()**: Conversão de objeto para string JSON

---

## 💻 Exercício 3: Express.js - SOLUÇÃO COMPLETA

```javascript
// server-express.js
const express = require('express');
const app = express();
const PORT = 3000;

// SOLUÇÃO TODO 2: Middleware para parsear JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// SOLUÇÃO TODO 3: Rota GET para página inicial
app.get('/', (req, res) => {
    res.json({
        mensagem: 'Bem-vindo ao servidor Express.js!',
        versao: '1.0.0',
        documentacao: '/api/docs',
        endpoints: {
            inicial: '/',
            sobre: '/sobre',
            hora: '/api/hora',
            echo: 'POST /api/echo',
            saudacao: '/api/saudacao/:nome'
        }
    });
});

// SOLUÇÃO TODO 4: Rota GET /sobre
app.get('/sobre', (req, res) => {
    res.json({
        projeto: 'API Express.js - Aula 3',
        disciplina: 'Computação Distribuída',
        instituicao: 'IPCA',
        tecnologias: ['Node.js', 'Express.js'],
        versaoNode: process.version,
        ambiente: process.env.NODE_ENV || 'development',
        uptime: `${Math.floor(process.uptime())} segundos`
    });
});

// SOLUÇÃO TODO 5: Rota GET /api/hora
app.get('/api/hora', (req, res) => {
    res.json({
        timestamp: new Date().toISOString(),
        timestampUnix: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        formato: {
            data: new Date().toLocaleDateString('pt-PT'),
            hora: new Date().toLocaleTimeString('pt-PT')
        }
    });
});

// SOLUÇÃO TODO 6: Rota POST /api/echo
app.post('/api/echo', (req, res) => {
    const { body, headers, method, url } = req;
    
    res.json({
        mensagem: 'Echo do servidor',
        recebido: body,
        metadata: {
            metodo: method,
            url: url,
            contentType: headers['content-type'],
            timestamp: new Date().toISOString()
        }
    });
});

// SOLUÇÃO TODO 7: Rota GET com parâmetro dinâmico
app.get('/api/saudacao/:nome', (req, res) => {
    const { nome } = req.params;
    const idioma = req.query.idioma || 'pt';
    
    const saudacoes = {
        pt: `Olá, ${nome}!`,
        en: `Hello, ${nome}!`,
        es: `¡Hola, ${nome}!`,
        fr: `Bonjour, ${nome}!`
    };
    
    res.json({
        saudacao: saudacoes[idioma] || saudacoes.pt,
        nome: nome,
        idioma: idioma,
        timestamp: new Date().toISOString()
    });
});

// SOLUÇÃO TODO 8: Middleware 404
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        path: req.url,
        metodo: req.method,
        sugestao: 'Verifique a documentação em /'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: err.message
    });
});

// SOLUÇÃO TODO 9: Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
    console.log('\n📋 Endpoints disponíveis:');
    console.log('  GET    /');
    console.log('  GET    /sobre');
    console.log('  GET    /api/hora');
    console.log('  POST   /api/echo');
    console.log('  GET    /api/saudacao/:nome');
    console.log('  GET    /api/saudacao/:nome?idioma=en');
});
```

### Conceitos-Chave a Enfatizar

1. **Middlewares**: Funções que processam req/res antes das rotas
2. **app.use()**: Registra middlewares globais
3. **express.json()**: Parse automático de JSON no body
4. **req.params**: Parâmetros da URL (/rota/:parametro)
5. **req.query**: Query strings (/rota?chave=valor)
6. **Ordem importa**: Middlewares são executados na ordem de registro

---

## 💻 Exercício 4: API RESTful Completa - SOLUÇÃO

```javascript
// api-tarefas.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Base de dados simulada
let tarefas = [
    { id: 1, titulo: 'Estudar Node.js', completa: false, criadaEm: new Date().toISOString() },
    { id: 2, titulo: 'Fazer exercícios', completa: false, criadaEm: new Date().toISOString() },
    { id: 3, titulo: 'Preparar projeto', completa: true, criadaEm: new Date().toISOString() }
];

let proximoId = 4;

// Função auxiliar para encontrar tarefa
const encontrarTarefa = (id) => {
    return tarefas.find(t => t.id === parseInt(id));
};

// SOLUÇÃO TODO 1: GET /api/tarefas - Listar todas
app.get('/api/tarefas', (req, res) => {
    // Suporte para filtros via query params
    const { completa, ordenar } = req.query;
    
    let resultado = [...tarefas];
    
    // Filtrar por status
    if (completa !== undefined) {
        const statusCompleta = completa === 'true';
        resultado = resultado.filter(t => t.completa === statusCompleta);
    }
    
    // Ordenar
    if (ordenar === 'titulo') {
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (ordenar === 'id') {
        resultado.sort((a, b) => a.id - b.id);
    }
    
    res.json({
        sucesso: true,
        total: resultado.length,
        dados: resultado
    });
});

// SOLUÇÃO TODO 2: GET /api/tarefas/:id - Obter específica
app.get('/api/tarefas/:id', (req, res) => {
    const tarefa = encontrarTarefa(req.params.id);
    
    if (!tarefa) {
        return res.status(404).json({
            sucesso: false,
            erro: 'Tarefa não encontrada',
            id: req.params.id
        });
    }
    
    res.json({
        sucesso: true,
        dados: tarefa
    });
});

// SOLUÇÃO TODO 3: POST /api/tarefas - Criar nova
app.post('/api/tarefas', (req, res) => {
    const { titulo } = req.body;
    
    // Validação
    if (!titulo || titulo.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            erro: 'O campo "titulo" é obrigatório e não pode estar vazio'
        });
    }
    
    if (titulo.length > 100) {
        return res.status(400).json({
            sucesso: false,
            erro: 'O título não pode ter mais de 100 caracteres'
        });
    }
    
    // Criar nova tarefa
    const novaTarefa = {
        id: proximoId++,
        titulo: titulo.trim(),
        completa: false,
        criadaEm: new Date().toISOString()
    };
    
    tarefas.push(novaTarefa);
    
    res.status(201).json({
        sucesso: true,
        mensagem: 'Tarefa criada com sucesso',
        dados: novaTarefa
    });
});

// SOLUÇÃO TODO 4: PUT /api/tarefas/:id - Atualizar
app.put('/api/tarefas/:id', (req, res) => {
    const tarefa = encontrarTarefa(req.params.id);
    
    if (!tarefa) {
        return res.status(404).json({
            sucesso: false,
            erro: 'Tarefa não encontrada',
            id: req.params.id
        });
    }
    
    const { titulo, completa } = req.body;
    
    // Validação
    if (titulo !== undefined) {
        if (typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({
                sucesso: false,
                erro: 'O título deve ser uma string não vazia'
            });
        }
        tarefa.titulo = titulo.trim();
    }
    
    if (completa !== undefined) {
        if (typeof completa !== 'boolean') {
            return res.status(400).json({
                sucesso: false,
                erro: 'O campo "completa" deve ser booleano'
            });
        }
        tarefa.completa = completa;
    }
    
    tarefa.atualizadaEm = new Date().toISOString();
    
    res.json({
        sucesso: true,
        mensagem: 'Tarefa atualizada com sucesso',
        dados: tarefa
    });
});

// SOLUÇÃO TODO 5: DELETE /api/tarefas/:id - Remover
app.delete('/api/tarefas/:id', (req, res) => {
    const indice = tarefas.findIndex(t => t.id === parseInt(req.params.id));
    
    if (indice === -1) {
        return res.status(404).json({
            sucesso: false,
            erro: 'Tarefa não encontrada',
            id: req.params.id
        });
    }
    
    const tarefaRemovida = tarefas.splice(indice, 1)[0];
    
    res.status(200).json({
        sucesso: true,
        mensagem: 'Tarefa removida com sucesso',
        dados: tarefaRemovida
    });
});

// SOLUÇÃO TODO 6: GET /api/tarefas/stats - Estatísticas
app.get('/api/tarefas/estatisticas', (req, res) => {
    const total = tarefas.length;
    const completas = tarefas.filter(t => t.completa).length;
    const pendentes = total - completas;
    const percentualCompleto = total > 0 ? Math.round((completas / total) * 100) : 0;
    
    res.json({
        sucesso: true,
        dados: {
            total,
            completas,
            pendentes,
            percentualCompleto,
            ultimaAtualizacao: new Date().toISOString()
        }
    });
});

// Rota de documentação
app.get('/api/docs', (req, res) => {
    res.json({
        nome: 'API de Gestão de Tarefas',
        versao: '1.0.0',
        endpoints: {
            listar: {
                metodo: 'GET',
                rota: '/api/tarefas',
                queryParams: {
                    completa: 'true/false (filtrar por status)',
                    ordenar: 'titulo/id (ordenar resultados)'
                }
            },
            obter: {
                metodo: 'GET',
                rota: '/api/tarefas/:id'
            },
            criar: {
                metodo: 'POST',
                rota: '/api/tarefas',
                body: {
                    titulo: 'string (obrigatório, max 100 caracteres)'
                }
            },
            atualizar: {
                metodo: 'PUT',
                rota: '/api/tarefas/:id',
                body: {
                    titulo: 'string (opcional)',
                    completa: 'boolean (opcional)'
                }
            },
            remover: {
                metodo: 'DELETE',
                rota: '/api/tarefas/:id'
            },
            estatisticas: {
                metodo: 'GET',
                rota: '/api/tarefas/estatisticas'
            }
        }
    });
});

// Middleware 404
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Endpoint não encontrado',
        path: req.url,
        sugestao: 'Consulte /api/docs para ver endpoints disponíveis'
    });
});

// Middleware de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
        mensagem: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`📋 API de Tarefas em http://localhost:${PORT}`);
    console.log('\n📚 Documentação: http://localhost:${PORT}/api/docs');
    console.log('\n🔧 Endpoints:');
    console.log('  GET    /api/tarefas');
    console.log('  GET    /api/tarefas/:id');
    console.log('  POST   /api/tarefas');
    console.log('  PUT    /api/tarefas/:id');
    console.log('  DELETE /api/tarefas/:id');
    console.log('  GET    /api/tarefas/estatisticas');
});
```

### Script de Testes (criar ficheiro test-api.sh)

```bash
#!/bin/bash
# test-api.sh - Script para testar a API

echo "🧪 Testar API de Tarefas"
echo "=========================="
echo ""

echo "1. Listar todas as tarefas"
curl -s http://localhost:3000/api/tarefas | json_pp
echo -e "\n"

echo "2.  Criar nova tarefa"
curl -s -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Testar API"}' | json_pp
echo -e "\n"

echo "3.  Obter tarefa específica (id=1)"
curl -s http://localhost:3000/api/tarefas/1 | json_pp
echo -e "\n"

echo "4.  Atualizar tarefa (id=1)"
curl -s -X PUT http://localhost:3000/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"completa":true}' | json_pp
echo -e "\n"

echo "5.  Estatísticas"
curl -s http://localhost:3000/api/tarefas/estatisticas | json_pp
echo -e "\n"

echo "6.  Filtrar tarefas completas"
curl -s "http://localhost:3000/api/tarefas?completa=true" | json_pp
echo -e "\n"

echo "✅ Testes concluídos!"
```

---

## 💻 Exercício 5: Backend Java Spring Boot - SOLUÇÃO COMPLETA

### Estrutura do Projeto

```
tarefas-java/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/exemplo/tarefas/
│       │       ├── TarefasApplication.java
│       │       ├── controller/
│       │       │   └── TarefaController.java
│       │       ├── model/
│       │       │   └── Tarefa.java
│       │       └── service/
│       │           └── TarefaService.java
│       └── resources/
│           └── application.properties
└── pom.xml
```

### TarefasApplication.java

```java
package com.exemplo.tarefas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TarefasApplication {
    public static void main(String[] args) {
        SpringApplication.run(TarefasApplication.class, args);
    }
}
```

### Tarefa.java (Model)

```java
package com.exemplo.tarefas.model;

import java.time.LocalDateTime;

public class Tarefa {
    private Long id;
    private String titulo;
    private Boolean completa;
    private LocalDateTime criadaEm;
    private LocalDateTime atualizadaEm;
    
    // Construtores
    public Tarefa() {
        this.criadaEm = LocalDateTime.now();
    }
    
    public Tarefa(Long id, String titulo, Boolean completa) {
        this.id = id;
        this.titulo = titulo;
        this.completa = completa;
        this.criadaEm = LocalDateTime.now();
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public Boolean getCompleta() {
        return completa;
    }
    
    public void setCompleta(Boolean completa) {
        this.completa = completa;
    }
    
    public LocalDateTime getCriadaEm() {
        return criadaEm;
    }
    
    public void setCriadaEm(LocalDateTime criadaEm) {
        this.criadaEm = criadaEm;
    }
    
    public LocalDateTime getAtualizadaEm() {
        return atualizadaEm;
    }
    
    public void setAtualizadaEm(LocalDateTime atualizadaEm) {
        this.atualizadaEm = atualizadaEm;
    }
}
```

### TarefaService.java

```java
package com.exemplo.tarefas.service;

import com.exemplo.tarefas.model.Tarefa;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TarefaService {
    private final List<Tarefa> tarefas = new ArrayList<>();
    private final AtomicLong proximoId = new AtomicLong(4);
    
    public TarefaService() {
        // Inicializar com dados de exemplo
        tarefas.add(new Tarefa(1L, "Estudar Java", false));
        tarefas.add(new Tarefa(2L, "Fazer exercícios", false));
        tarefas.add(new Tarefa(3L, "Preparar projeto", true));
    }
    
    public List<Tarefa> listarTodas() {
        return new ArrayList<>(tarefas);
    }
    
    public Optional<Tarefa> buscarPorId(Long id) {
        return tarefas.stream()
                .filter(t -> t.getId().equals(id))
                .findFirst();
    }
    
    public Tarefa criar(Tarefa tarefa) {
        tarefa.setId(proximoId.getAndIncrement());
        tarefa.setCriadaEm(LocalDateTime.now());
        tarefas.add(tarefa);
        return tarefa;
    }
    
    public Optional<Tarefa> atualizar(Long id, Tarefa tarefaAtualizada) {
        return buscarPorId(id).map(tarefa -> {
            if (tarefaAtualizada.getTitulo() != null) {
                tarefa.setTitulo(tarefaAtualizada.getTitulo());
            }
            if (tarefaAtualizada.getCompleta() != null) {
                tarefa.setCompleta(tarefaAtualizada.getCompleta());
            }
            tarefa.setAtualizadaEm(LocalDateTime.now());
            return tarefa;
        });
    }
    
    public boolean remover(Long id) {
        return tarefas.removeIf(t -> t.getId().equals(id));
    }
    
    public long contarTotal() {
        return tarefas.size();
    }
    
    public long contarCompletas() {
        return tarefas.stream().filter(Tarefa::getCompleta).count();
    }
    
    public long contarPendentes() {
        return contarTotal() - contarCompletas();
    }
}
```

### TarefaController.java (SOLUÇÃO COMPLETA)

```java
package com.exemplo.tarefas.controller;

import com.exemplo.tarefas.model.Tarefa;
import com.exemplo.tarefas.service.TarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = "*")
public class TarefaController {
    
    @Autowired
    private TarefaService tarefaService;
    
    // SOLUÇÃO TODO 1: GET /api/tarefas
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodas() {
        List<Tarefa> tarefas = tarefaService.listarTodas();
        
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("sucesso", true);
        resposta.put("total", tarefas.size());
        resposta.put("dados", tarefas);
        
        return ResponseEntity.ok(resposta);
    }
    
    // SOLUÇÃO TODO 2: GET /api/tarefas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarPorId(@PathVariable Long id) {
        return tarefaService.buscarPorId(id)
                .map(tarefa -> {
                    Map<String, Object> resposta = new HashMap<>();
                    resposta.put("sucesso", true);
                    resposta.put("dados", tarefa);
                    return ResponseEntity.ok(resposta);
                })
                .orElseGet(() -> {
                    Map<String, Object> erro = new HashMap<>();
                    erro.put("sucesso", false);
                    erro.put("erro", "Tarefa não encontrada");
                    erro.put("id", id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
                });
    }
    
    // SOLUÇÃO TODO 3: POST /api/tarefas
    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@RequestBody Tarefa tarefa) {
        // Validação
        if (tarefa.getTitulo() == null || tarefa.getTitulo().trim().isEmpty()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("sucesso", false);
            erro.put("erro", "O campo 'titulo' é obrigatório");
            return ResponseEntity.badRequest().body(erro);
        }
        
        if (tarefa.getCompleta() == null) {
            tarefa.setCompleta(false);
        }
        
        Tarefa novaTarefa = tarefaService.criar(tarefa);
        
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("sucesso", true);
        resposta.put("mensagem", "Tarefa criada com sucesso");
        resposta.put("dados", novaTarefa);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
    
    // SOLUÇÃO TODO 4: PUT /api/tarefas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(
            @PathVariable Long id, 
            @RequestBody Tarefa tarefa) {
        
        return tarefaService.atualizar(id, tarefa)
                .map(tarefaAtualizada -> {
                    Map<String, Object> resposta = new HashMap<>();
                    resposta.put("sucesso", true);
                    resposta.put("mensagem", "Tarefa atualizada com sucesso");
                    resposta.put("dados", tarefaAtualizada);
                    return ResponseEntity.ok(resposta);
                })
                .orElseGet(() -> {
                    Map<String, Object> erro = new HashMap<>();
                    erro.put("sucesso", false);
                    erro.put("erro", "Tarefa não encontrada");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
                });
    }
    
    // SOLUÇÃO TODO 5: DELETE /api/tarefas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> remover(@PathVariable Long id) {
        boolean removido = tarefaService.remover(id);
        
        if (removido) {
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("sucesso", true);
            resposta.put("mensagem", "Tarefa removida com sucesso");
            return ResponseEntity.ok(resposta);
        } else {
            Map<String, Object> erro = new HashMap<>();
            erro.put("sucesso", false);
            erro.put("erro", "Tarefa não encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
    }
    
    // Endpoint adicional: Estatísticas
    @GetMapping("/estatisticas")
    public ResponseEntity<Map<String, Object>> estatisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", tarefaService.contarTotal());
        stats.put("completas", tarefaService.contarCompletas());
        stats.put("pendentes", tarefaService.contarPendentes());
        
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("sucesso", true);
        resposta.put("dados", stats);
        
        return ResponseEntity.ok(resposta);
    }
}
```

### application.properties

```properties
server.port=8080
spring.application.name=tarefas-api

# Logs
logging.level.root=INFO
logging.level.com.exemplo.tarefas=DEBUG
```

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.exemplo</groupId>
    <artifactId>tarefas</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 📊 Comparação Node.js vs Java - ANÁLISE PEDAGÓGICA

### Tabela Comparativa Completa

| Aspecto | Node.js/Express | Java/Spring Boot |
|---------|----------------|------------------|
| **Linhas de código (API completa)** | ~200 linhas | ~350 linhas |
| **Tempo de setup** | 2-3 minutos | 10-15 minutos |
| **Configuração inicial** | npm init + 2 dependências | Spring Initializr + Maven/Gradle |
| **Curva de aprendizagem** | Baixa-média | Média-alta |
| **Verbosidade** | Baixa | Alta |
| **Tipagem** | Dinâmica (opcional TypeScript) | Estática forte |
| **Modelo de concorrência** | Event-loop (single-threaded) | Multi-threaded |
| **Performance para I/O** | Excelente | Boa |
| **Performance para CPU** | Limitada | Excelente |
| **Ecossistema** | NPM (2M+ pacotes) | Maven Central (~400k) |
| **Documentação** | Boa | Excelente |
| **Debugging** | Fácil | Complexo |
| **Produção enterprise** | Crescente | Dominante |
| **Curva de escalabilidade** | Horizontal fácil | Vertical e horizontal |

### Pontos de Discussão com Alunos

#### Quando usar Node.js?

**Cenários ideais:**
- APIs RESTful leves e rápidas
- Aplicações I/O intensive (muitas requisições simultâneas)
- Real-time (chat, streaming, WebSockets)
- Microserviços pequenos
- Prototipagem rápida
- Equipes JavaScript full-stack

**Exemplos reais:**
- Netflix (UI layer)
- LinkedIn (mobile backend)
- PayPal (substituiu Java por Node.js)
- Uber (backend de matching)

#### Quando usar Java/Spring Boot?

**Cenários ideais:**
- Aplicações enterprise complexas
- Processamento CPU-intensive
- Sistemas que requerem tipagem forte
- Ambientes corporativos tradicionais
- Aplicações de longa duração
- Quando já existe expertise Java

**Exemplos reais:**
- Bancos e instituições financeiras
- Sistemas de e-commerce complexos
- Aplicações Android (backend)
- Sistemas legados modernizados

---

### Erros Comuns e Soluções

#### Erro 1: Porta já em uso
```javascript
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [número] /F

# Ou simplesmente mudar a porta
const PORT = process.env.PORT || 3001;
```


### Extensões e Desafios Extras

#### Desafio 1: Adicionar Validação Robusta
```javascript
// Usar biblioteca Joi para validação
const Joi = require('joi');

const tarefaSchema = Joi.object({
    titulo: Joi.string().min(3).max(100).required(),
    completa: Joi.boolean()
});

app.post('/api/tarefas', (req, res) => {
    const { error, value } = tarefaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }
    // processar tarefa...
});
```

#### Desafio 2: Persistência com ficheiro JSON
```javascript
const fs = require('fs').promises;

async function salvarTarefas() {
    await fs.writeFile('tarefas.json', JSON.stringify(tarefas, null, 2));
}

async function carregarTarefas() {
    try {
        const data = await fs.readFile('tarefas.json', 'utf8');
        tarefas = JSON.parse(data);
    } catch (erro) {
        console.log('ficheiro não encontrado, usando dados padrão');
    }
}

// Chamar ao iniciar
carregarTarefas();

// Salvar após cada modificação
app.post('/api/tarefas', async (req, res) => {
    // ... criar tarefa
    await salvarTarefas();
    res.status(201).json(novaTarefa);
});
```

#### Desafio 3: Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições
    message: 'Muitas requisições, tente novamente mais tarde'
});

app.use('/api/', limiter);
```

#### Desafio 4: Autenticação Básica
```javascript
const basicAuth = require('express-basic-auth');

app.use('/api/admin', basicAuth({
    users: { 'admin': 'senha123' },
    challenge: true,
    unauthorizedResponse: { erro: 'Não autorizado' }
}));

app.delete('/api/admin/tarefas/:id', (req, res) => {
    // apenas admins podem eliminar
});
```

**Última atualização:** Outubro 2025  
**Versão:** Professor v1.0  
**Repositório:** https://github.com/CD-ipca/exercicios  
**Dúvidas:** fmanso@ipca.pt
