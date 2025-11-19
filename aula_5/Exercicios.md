# Aula 5 - Threads e Concorrência

## Exercícios Práticos

**Disciplina:** Computação Distribuída  
**Professor:** Filipe Gomes Manso  
**IPCA** - Instituto Politécnico do Cávado e do Ave

---

## 🎯 Objetivos dos Exercícios

Nesta aula prática, irão:
- Implementar o primeiro Worker Thread
- Comparar performance single-thread vs multi-thread  
- Criar um Worker Pool reutilizável
- Integrar workers num servidor HTTP
- Resolver problemas de concorrência

---

## 🛠️ Preparação Inicial

### 1. Criar Estrutura do Projeto

```bash
mkdir aula05
cd aula05
npm init -y

# Recomendação: criar pastas para cada exercício
mkdir exercicio1 exercicio2 exercicio3 exercicio4
```

### 2. Verificar Node.js

```bash
node --version
# Mínimo requerido: v12.x (Worker Threads estável)
# Recomendado: v18.x ou superior
```

---

## 💻 Exercício 1: Primeiro Worker Thread

### 🎯 Objetivo

Implementar e comparar processamento sequencial vs paralelo usando Worker Threads.

### 📋 Contexto

Vamos calcular números primos até 50.000 - uma operação CPU-intensive que beneficia de paralelização.

---

### Parte A: Implementação Sequencial

#### Ficheiro: `exercicio1/sequencial.js`

**O que fazer:**
1. Implementar função `calcularPrimos(max)` que encontra todos os primos até `max`
2. Executar a função 3 vezes sequencialmente
3. Medir o tempo total

```javascript
// sequencial.js
console.log('🔄 Iniciando cálculo sequencial...\n');

// TODO 1: Implementar função que calcula números primos
function calcularPrimos(max) {
    console.log(`Calculando números primos até ${max}...`);
    const inicio = Date.now();
    const primos = [];
    
    // TODO: Implementar algoritmo de verificação de primos
    // Dica: Para cada número de 2 até max:
    //   - Verificar se é divisível por algum número de 2 até √num
    //   - Se não for divisível, é primo
    
    // ESCREVER CÓDIGO AQUI
    
    const tempo = Date.now() - inicio;
    return { 
        quantidade: primos.length, 
        tempo, 
        ultimos10: primos.slice(-10) 
    };
}

// TODO 2: Executar 3 cálculos sequenciais e medir tempo total
console.time('Total Sequencial');

// ESCREVER CÓDIGO AQUI
// Executar calcularPrimos(50000) três vezes
// Imprimir resultados de cada execução

console.timeEnd('Total Sequencial');
```

**Testar:**
```bash
node exercicio1/sequencial.js
```

**Perguntas:**
- Quanto tempo levou cada cálculo?
- Quanto tempo levou o total?
- Os três cálculos foram em paralelo ou sequenciais?

---

### Parte B: Worker Thread

#### Ficheiro: `exercicio1/primo-worker.js`

**O que fazer:**
Criar um worker que calcula primos e comunica o resultado de volta.

```javascript
// primo-worker.js
const { parentPort, workerData } = require('worker_threads');

// TODO 1: Implementar função calcularPrimos
// (pode copiar do sequencial.js)
function calcularPrimos(max) {
    // ESCREVER CÓDIGO AQUI
}

// TODO 2: Calcular primos com os dados recebidos
const inicio = Date.now();
// ESCREVER CÓDIGO AQUI: chamar calcularPrimos com workerData.max
const tempo = Date.now() - inicio;

// TODO 3: Enviar resultado de volta para o parent
// Use: parentPort.postMessage({ ... })
// ESCREVER CÓDIGO AQUI
```

#### Ficheiro: `exercicio1/paralelo.js`

**O que fazer:**
Criar 3 workers que executam **em paralelo**.

```javascript
// paralelo.js
const { Worker } = require('worker_threads');

console.log('⚡ Iniciando cálculo com Worker Threads...\n');

// TODO 1: Implementar função que cria e executa um worker
function executarWorker(max) {
    return new Promise((resolve, reject) => {
        // ESCREVER CÓDIGO AQUI
        // 1. Criar Worker('./exercicio1/primo-worker.js')
        // 2. Passar { workerData: { max } }
        // 3. Escutar eventos: 'message', 'error', 'exit'
        // 4. Resolver promise com resultado
    });
}

async function executarParalelo() {
    console.time('Total Paralelo');
    
    // TODO 2: Criar array com 3 promessas executando workers
    const promessas = [
        // ESCREVER CÓDIGO AQUI
        // Dica: executarWorker(50000) três vezes
    ];
    
    // TODO 3: Aguardar todas as promessas
    // Use: Promise.all()
    // ESCREVER CÓDIGO AQUI
    
    console.timeEnd('Total Paralelo');
    
    // TODO 4: Imprimir resultados
    // ESCREVER CÓDIGO AQUI
}

executarParalelo().catch(console.error);
```

**Testar:**
```bash
node exercicio1/paralelo.js
```

### 📝 Questões para Reflexão

1. Qual foi o speedup obtido? (tempo sequencial / tempo paralelo)
2. Por que o tempo do paralelo NÃO é 1/3 do sequencial?
3. O que aconteceria se criássemos 100 workers simultaneamente?
4. Quando NÃO compensa usar Worker Threads?

---

## 🏊 Exercício 2: Worker Pool 

### 🎯 Objetivo

Implementar um pool de workers reutilizáveis - mais eficiente que criar/destruir workers.

---

### Parte A: Classe WorkerPool 

#### Ficheiro: `exercicio2/worker-pool.js`

```javascript
// worker-pool.js
const { Worker } = require('worker_threads');
const os = require('os');

class WorkerPool {
    constructor(workerScript, poolSize = os.cpus().length) {
        this.workerScript = workerScript;
        this.poolSize = poolSize;
        this.workers = [];
        this.fila = [];
        
        console.log(`🏊 Criando pool com ${poolSize} workers...`);
        this.inicializar();
    }
    
    inicializar() {
        // TODO 1: Criar poolSize workers
        // Usar: this.criarWorker(i)
        // ESCREVER CÓDIGO AQUI
    }
    
    criarWorker(id) {
        const worker = new Worker(this.workerScript);
        
        worker.id = id;
        worker.ocupado = false;
        
        // TODO 2: Configurar event handlers
        worker.on('message', (resultado) => {
            // ESCREVER CÓDIGO AQUI
            // 1. Marcar worker como não ocupado
            // 2. Resolver a promessa da tarefa atual
            // 3. Processar próxima tarefa da fila
            //    Use: this.processarFila()
        });
        
        worker.on('error', (erro) => {
            console.error(`❌ Erro no Worker ${id}:`, erro);
            // TODO: Rejeitar promessa e processar fila
            // ESCREVER CÓDIGO AQUI
        });
        
        this.workers.push(worker);
    }
    
    executar(dados) {
        return new Promise((resolve, reject) => {
            const tarefa = { dados, resolve, reject };
            
            // TODO 3: Procurar worker disponível
            // ESCREVER CÓDIGO AQUI
            // Se encontrar: this.executarTarefa(worker, tarefa)
            // Senão: this.fila.push(tarefa)
        });
    }
    
    executarTarefa(worker, tarefa) {
        // TODO 4: Marcar worker ocupado e enviar mensagem
        // ESCREVER CÓDIGO AQUI
    }
    
    processarFila() {
        // TODO 5: Se há tarefas na fila e worker disponível:
        //   - Retirar tarefa da fila
        //   - Executar com worker disponível
        // ESCREVER CÓDIGO AQUI
    }
    
    async fechar() {
        console.log('🛑 A fechar worker pool...');
        // TODO 6: Terminar todos os workers
        // Use: Promise.all com worker.terminate()
        // ESCREVER CÓDIGO AQUI
    }
}

module.exports = WorkerPool;
```

---

### Parte B: Worker de Processamento

#### Ficheiro: `exercicio2/task-worker.js`

```javascript
// task-worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', (dados) => {
    const inicio = Date.now();
    
    // TODO: Simular processamento CPU-intensive
    // ESCREVER CÓDIGO AQUI
    // Dica: Loop que faz operações matemáticas
    // Ex: for (let i = 0; i < 100000000; i++) Math.sqrt(i);
    
    const tempo = Date.now() - inicio;
    
    // TODO: Enviar resultado de volta
    parentPort.postMessage({
        id: dados.id,
        tempo,
        resultado: 'processado'
    });
});
```

---

### Parte C: Teste do Pool

#### Ficheiro: `exercicio2/test-pool.js`

```javascript
// test-pool.js
const WorkerPool = require('./worker-pool');

async function testarPool() {
    // TODO 1: Criar worker pool com 4 workers
    // ESCREVER CÓDIGO AQUI
    
    // TODO 2: Criar 20 tarefas
    const tarefas = [];
    for (let i = 0; i < 20; i++) {
        tarefas.push({ id: i, dados: Math.random() * 100 });
    }
    
    console.log('📦 Processando 20 tarefas com 4 workers...\n');
    console.time('Processamento Total');
    
    // TODO 3: Processar todas as tarefas usando o pool
    // Use: pool.executar() para cada tarefa
    // Use: Promise.all() para aguardar todas
    // ESCREVER CÓDIGO AQUI
    
    console.timeEnd('Processamento Total');
    
    // TODO 4: Imprimir estatísticas
    // ESCREVER CÓDIGO AQUI
    
    // TODO 5: Fechar pool
    // ESCREVER CÓDIGO AQUI
}

testarPool().catch(console.error);
```

**Testar:**
```bash
node exercicio2/test-pool.js
```

### 📝 Questões para Reflexão

1. Como o pool distribui as tarefas entre os workers?
2. O que acontece quando chegam mais tarefas do que workers disponíveis?
3. Altere para 2 workers. Como muda o desempenho?
4. Por que reutilizar workers é mais eficiente?

---

## 🌐 Exercício 3: Servidor HTTP com Workers

### 🎯 Objetivo

Criar um servidor que usa workers para operações pesadas sem bloquear requests leves.

---

### Parte A: Worker de Hash

#### Ficheiro: `exercicio3/hash-worker.js`

```javascript
// hash-worker.js
const { parentPort } = require('worker_threads');
const crypto = require('crypto');

parentPort.on('message', (dados) => {
    const inicio = Date.now();
    
    // TODO 1: Implementar função de hash intensivo
    // Objetivo: encontrar hash que comece com N zeros (mining simulation)
    function hashIntensivo(texto, dificuldade) {
        // ESCREVER CÓDIGO AQUI
        // 1. Iniciar nonce = 0
        // 2. Loop até encontrar hash que começa com dificuldade zeros
        // 3. Incrementar nonce a cada iteração
        // 4. Calcular hash = sha256(texto + nonce)
        // 5. Retornar { hash, nonce }
    }
    
    // TODO 2: Calcular hash e enviar resultado
    // ESCREVER CÓDIGO AQUI
});
```

---

### Parte B: Servidor HTTP

#### Ficheiro: `exercicio3/servidor.js`

```javascript
// servidor.js
const http = require('http');
const WorkerPool = require('../exercicio2/worker-pool');

// TODO 1: Criar worker pool
// ESCREVER CÓDIGO AQUI

const servidor = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/hash' && req.method === 'POST') {
        // TODO 2: Processar request de hash
        // 1. Ler corpo da request (req.on('data'))
        // 2. Parsear JSON
        // 3. Executar worker com os dados
        // 4. Retornar resultado
        // ESCREVER CÓDIGO AQUI
        
    } else if (req.url === '/ping' && req.method === 'GET') {
        // TODO 3: Endpoint rápido (teste de não-bloqueio)
        // ESCREVER CÓDIGO AQUI
        // Retornar: { pong: true, timestamp: Date.now() }
        
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
});

const PORTA = 3000;
servidor.listen(PORTA, () => {
    console.log(`🚀 Servidor à escuta em http://localhost:${PORTA}`);
    console.log('\nEndpoints:');
    console.log('  POST /hash  - Calcular hash (CPU-intensive)');
    console.log('  GET  /ping  - Verificar disponibilidade');
});
```

**Testar:**

```bash
# Terminal 1: Iniciar servidor
node exercicio3/servidor.js

# Terminal 2: Testar com curl
curl -X POST http://localhost:3000/hash \
  -H "Content-Type: application/json" \
  -d '{"texto":"teste","dificuldade":4}'

# Enquanto o hash está a calcular, testar ping:
curl http://localhost:3000/ping
```

### 📝 Questões para Reflexão

1. O `/ping` responde imediatamente mesmo durante cálculo de hash?
2. O que aconteceria SEM workers? (testar descomentando código sequencial)
3. Quantas requisições de hash podem ser processadas simultaneamente?
4. Como o pool gerencia múltiplas requisições simultâneas?

---

## 🎖️ Desafio Extra: Monitor de Sistema (Opcional)

### 🎯 Objetivo

Criar um monitor de sistema que reporta métricas em tempo real usando comunicação bidirecional.

### Requisitos

1. **Worker** que monitora:
   - Uso de CPU
   - Uso de memória
   - Uptime do sistema
   - Envia atualizações a cada N milissegundos

2. **Main thread** que:
   - Aceita comandos via terminal (start, stop, status)
   - Exibe estatísticas recebidas do worker
   - Controla intervalo de atualização

### Estrutura

```
desafio/
├── monitor-worker.js   # Worker de monitoramento
└── main.js             # Interface de comando
```

### Dicas

- Use `os.cpus()`, `os.totalmem()`, `os.freemem()`
- Use `readline` para interface de terminal
- Implemente comandos: START, STOP, STATUS, EXIT


---

## 📊 Entrega

### O que entregar:

1. **Código completo** de todos os exercícios
2. **Screenshot** dos outputs de cada exercício
3. **Respostas** às questões de reflexão (documento .txt ou .md)
4. **Análise comparativa** dos tempos (sequencial vs paralelo)

### Como entregar:

```bash
# Criar ZIP do projeto por exemplo:
zip -r aula05-[SEUNOME].zip aula05-threads-concorrencia/

# Fazer upload no Moodle
```

**Prazo:** Até 1 semana após a aula e antes da próxima aula

---

## 🔗 Recursos de Apoio

### Documentação
- [Node.js Worker Threads](https://nodejs.org/api/worker_threads.html)
- [MDN - Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

### Vídeos Recomendados
- "Node.js Worker Threads Explained" - Traversy Media
- "Understanding Concurrency" - Fireship

### Onde tirar dúvidas:
- Email: fmanso@ipca.pt
- Fórum da disciplina no Moodle

---

## 💡 Dicas para o Sucesso

1. **Testar frequentemente** - Não deixar para testar tudo no final
2. **Uso do console.log** - Ajuda a entender o fluxo de execução
3. **Ler os erros** - As mensagens de erro do Node.js são informativas
4. **Comparar com teoria** - Reveja os slides quando tiver dúvidas
5. **Trabalhar em par** - Programação em par é permitida e recomendada
6. **Pedir ajuda** - Não ficar preso mais de 30 minutos no mesmo problema

---

**Boa sorte! 🚀**

**Última atualização:** Novembro 2025  
**Versão:** v1.0
