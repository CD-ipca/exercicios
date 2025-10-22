# Aula 1 - Paradigma da Computação Distribuída
## Exercícios Práticos

### 📚 Objetivos dos Exercícios
- Compreender na prática os conceitos de sistemas distribuídos
- Experimentar desafios reais de sincronização e comunicação
- Observar diferenças entre processamento centralizado e distribuído
- Preparar o ambiente de desenvolvimento para as próximas aulas

---

## 🛠️ Parte 1: Configuração do Ambiente

### Instalação de Ferramentas Essenciais

#### 1. Node.js e NPM
```bash
# Verificar se já está instalado
node --version
npm --version

# Se não estiver instalado, donwload: https://nodejs.org/
# Versão LTS recomendada: 18.x ou superior
```

#### 2. Git
```bash
# Verificar instalação
git --version

# Configurar (substituir com seus dados de registo do git)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

#### 3. Editor de Código
- **VS Code** (recomendado): https://code.visualstudio.com/
- Extensões úteis:
  - ESLint
  - Prettier
  - GitLens

#### 4. Criar Estrutura de Pasta para o Semestre
```bash
mkdir computacao-distribuida
cd computacao-distribuida
mkdir aula01 aula02 aula03 trabalho-pratico
cd aula01
npm init -y
```

**✅ Checkpoint:** Todos devem ter Node.js, Git e um editor funcionando antes de prosseguir.

---

## 💻 Parte 2: Exercício 1 - Processamento Sequencial vs Paralelo

### Contexto
Vamos criar dois programas que processam uma lista de números e comparar o desempenho.

### Exercício 1.1: Processamento Sequencial

Crie um arquivo `sequencial.js`:

```javascript
// sequencial.js
// Simula processamento pesado de dados

function processarNumero(numero) {
    // Simula operação demorada
    let resultado = 0;
    for (let i = 0; i < 100000000; i++) {
        resultado += Math.sqrt(numero);
    }
    return resultado;
}

function processarSequencial(numeros) {
    console.log('🔄 Iniciando processamento SEQUENCIAL...');
    const inicio = Date.now();
    
    const resultados = [];
    for (const numero of numeros) {
        console.log(`  Processando ${numero}...`);
        const resultado = processarNumero(numero);
        resultados.push(resultado);
    }
    
    const tempo = Date.now() - inicio;
    console.log(`✅ Processamento concluído em ${tempo}ms`);
    console.log(`📊 Resultados: ${resultados.length} números processados\n`);
    
    return { resultados, tempo };
}

// Teste
const numeros = [1, 2, 3, 4, 5, 6, 7, 8];
processarSequencial(numeros);
```

Execute:
```bash
node sequencial.js
```

### Exercício 1.2: Processamento Paralelo com Worker Threads

Crie um arquivo `paralelo.js`:

```javascript
// paralelo.js
const { Worker } = require('worker_threads');

function processarParalelo(numeros) {
    console.log('⚡ Iniciando processamento PARALELO...');
    const inicio = Date.now();
    
    const workers = [];
    const resultados = [];
    
    for (let i = 0; i < numeros.length; i++) {
        const worker = new Worker('./worker.js', {
            workerData: numeros[i]
        });
        
        workers.push(
            new Promise((resolve, reject) => {
                worker.on('message', (resultado) => {
                    console.log(`  ✓ Worker ${i + 1} completou`);
                    resultados[i] = resultado;
                    resolve();
                });
                worker.on('error', reject);
            })
        );
    }
    
    Promise.all(workers).then(() => {
        const tempo = Date.now() - inicio;
        console.log(`✅ Processamento concluído em ${tempo}ms`);
        console.log(`📊 Resultados: ${resultados.length} números processados\n`);
    });
}

// Teste
const numeros = [1, 2, 3, 4, 5, 6, 7, 8];
processarParalelo(numeros);
```

Crie o arquivo `worker.js`:

```javascript
// worker.js
const { parentPort, workerData } = require('worker_threads');

function processarNumero(numero) {
    let resultado = 0;
    for (let i = 0; i < 100000000; i++) {
        resultado += Math.sqrt(numero);
    }
    return resultado;
}

const resultado = processarNumero(workerData);
parentPort.postMessage(resultado);
```

Execute:
```bash
node paralelo.js
```

### 📝 Questões para Discussão
1. Qual foi a diferença de tempo entre os dois métodos?
2. Por que o processamento paralelo é mais rápido?
3. Existem situações onde o sequencial seria preferível?
4. O que aconteceria se tivéssemos 1000 números para processar?

---

## 🌐 Parte 3: Exercício 2 - Simulação de Sistema Distribuído

### Contexto
Vamos simular um sistema distribuído simples onde múltiplos "nós" (processos) tentam acessar um recurso compartilhado.

### Exercício 2.1: O Problema da Conta Bancária

Crie um arquivo `conta-centralizada.js`:

```javascript
// conta-centralizada.js
// Sistema centralizado - SEM problemas de concorrência

class ContaBancaria {
    constructor(saldoInicial) {
        this.saldo = saldoInicial;
    }
    
    depositar(valor) {
        const saldoAnterior = this.saldo;
        // Simula delay de processamento
        const delay = Math.random() * 100;
        
        setTimeout(() => {
            this.saldo = saldoAnterior + valor;
            console.log(`💰 Depósito: +${valor}€ | Saldo: ${this.saldo}€`);
        }, delay);
    }
    
    getSaldo() {
        return this.saldo;
    }
}

// Teste
const conta = new ContaBancaria(1000);
console.log(`🏦 Saldo inicial: ${conta.getSaldo()}€\n`);

// Múltiplos depósitos simultâneos
for (let i = 0; i < 5; i++) {
    conta.depositar(100);
}

// Verificar saldo final após 2 segundos
setTimeout(() => {
    console.log(`\n🏦 Saldo final: ${conta.getSaldo()}€`);
    console.log(`❓ Esperado: ${1000 + (5 * 100)}€`);
}, 2000);
```

Execute:
```bash
node conta-centralizada.js
```

### Exercício 2.2: Problema de Concorrência

Crie `conta-distribuida.js`:

```javascript
// conta-distribuida.js
// Simula problema de race condition

class ContaDistribuida {
    constructor(saldoInicial) {
        this.saldo = saldoInicial;
    }
    
    async depositar(valor, clienteId) {
        // 1. Ler saldo atual
        const saldoLido = this.saldo;
        console.log(`📖 Cliente ${clienteId} leu saldo: ${saldoLido}€`);
        
        // 2. Simula latência de rede
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        
        // 3. Calcular novo saldo
        const novoSaldo = saldoLido + valor;
        
        // 4. Simula mais latência
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        
        // 5. Escrever novo saldo
        this.saldo = novoSaldo;
        console.log(`✍️  Cliente ${clienteId} escreveu saldo: ${novoSaldo}€`);
    }
    
    getSaldo() {
        return this.saldo;
    }
}

// Teste
async function testar() {
    const conta = new ContaDistribuida(1000);
    console.log(`🏦 Saldo inicial: ${conta.getSaldo()}€\n`);
    
    // Múltiplos clientes fazendo depósitos simultaneamente
    const promessas = [];
    for (let i = 1; i <= 5; i++) {
        promessas.push(conta.depositar(100, i));
    }
    
    await Promise.all(promessas);
    
    console.log(`\n🏦 Saldo final: ${conta.getSaldo()}€`);
    console.log(`❓ Esperado: ${1000 + (5 * 100)}€`);
    console.log(`⚠️  Diferença: ${(1000 + (5 * 100)) - conta.getSaldo()}€ perdidos!`);
}

testar();
```

Execute:
```bash
node conta-distribuida.js
```

### 📝 Questões
1. O que aconteceu com o saldo final? Por quê?
2. Este é um exemplo de que tipo de problema em sistemas distribuídos?
3. Como poderíamos resolver este problema?

---

## 🔍 Parte 4: Exercício 3 - Latência e Disponibilidade

### Exercício 3.1: Simulando Latência de Rede

Crie `latencia-teste.js`:

```javascript
// latencia-teste.js
// Simula acesso a servidores em diferentes localizações

const servidores = [
    { nome: 'Local (Portugal)', latencia: 10 },
    { nome: 'Europa (Frankfurt)', latencia: 50 },
    { nome: 'EUA (Virginia)', latencia: 150 },
    { nome: 'Ásia (Singapura)', latencia: 300 }
];

function requisicao(servidor) {
    return new Promise((resolve) => {
        const inicio = Date.now();
        console.log(`🌍 Requisição para ${servidor.nome}...`);
        
        setTimeout(() => {
            const tempoReal = Date.now() - inicio;
            console.log(`✅ Resposta de ${servidor.nome} em ${tempoReal}ms`);
            resolve({ servidor: servidor.nome, tempo: tempoReal });
        }, servidor.latencia);
    });
}

async function testarLatencia() {
    console.log('🔬 Teste de Latência - Requisições Sequenciais\n');
    const inicioTotal = Date.now();
    
    for (const servidor of servidores) {
        await requisicao(servidor);
    }
    
    const tempoTotal = Date.now() - inicioTotal;
    console.log(`\n⏱️  Tempo total (sequencial): ${tempoTotal}ms\n`);
}

async function testarLatenciaParalela() {
    console.log('🔬 Teste de Latência - Requisições Paralelas\n');
    const inicioTotal = Date.now();
    
    const promessas = servidores.map(servidor => requisicao(servidor));
    await Promise.all(promessas);
    
    const tempoTotal = Date.now() - inicioTotal;
    console.log(`\n⏱️  Tempo total (paralelo): ${tempoTotal}ms\n`);
}

// Executar ambos os testes
async function executarTestes() {
    await testarLatencia();
    console.log('─'.repeat(60) + '\n');
    await testarLatenciaParalela();
}

executarTestes();
```

### Exercício 3.2: Simulando Falhas e Redundância

Crie `disponibilidade-teste.js`:

```javascript
// disponibilidade-teste.js
// Simula sistema com réplicas para alta disponibilidade

class Servidor {
    constructor(id, probabilidadeFalha = 0.3) {
        this.id = id;
        this.probabilidadeFalha = probabilidadeFalha;
    }
    
    async processar(dados) {
        // Simula latência
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        
        // Simula possível falha
        if (Math.random() < this.probabilidadeFalha) {
            throw new Error(`❌ Servidor ${this.id} falhou!`);
        }
        
        return `✅ Servidor ${this.id} processou: ${dados}`;
    }
}

class SistemaDistribuido {
    constructor(numeroReplicas) {
        this.servidores = [];
        for (let i = 1; i <= numeroReplicas; i++) {
            this.servidores.push(new Servidor(i));
        }
    }
    
    async processarComRedundancia(dados) {
        console.log(`🔄 Tentando processar: "${dados}"`);
        
        for (const servidor of this.servidores) {
            try {
                const resultado = await servidor.processar(dados);
                console.log(resultado);
                return resultado;
            } catch (erro) {
                console.log(erro.message);
                console.log(`🔁 Tentando próximo servidor...`);
            }
        }
        
        throw new Error('⚠️  Todos os servidores falharam!');
    }
}

// Teste
async function testar() {
    console.log('🧪 Teste de Disponibilidade com Redundância\n');
    
    const sistema = new SistemaDistribuido(3); // 3 réplicas
    
    for (let i = 1; i <= 5; i++) {
        console.log(`\n--- Requisição ${i} ---`);
        try {
            await sistema.processarComRedundancia(`Pedido ${i}`);
        } catch (erro) {
            console.log(erro.message);
        }
    }
}

testar();
```

Execute:
```bash
node latencia-teste.js
node disponibilidade-teste.js
```

### 📝 Questões
1. Como a latência afeta a experiência do utilizador?
2. Qual a importância de ter réplicas em diferentes localizações?
3. Como seria implementar um sistema de failover automático?

---

## 🎯 Parte 5: Desafio Extra

### Mini-Projeto: Sistema de Chat Distribuído Simples

Crie uma aplicação básica de chat onde múltiplas instâncias podem comunicar.

**Arquivos necessários:**

`chat-server.js`:
```javascript
// chat-server.js
const readline = require('readline');

class ChatNode {
    constructor(nome) {
        this.nome = nome;
        this.mensagens = [];
        this.peers = [];
    }
    
    enviarMensagem(mensagem) {
        const msg = {
            de: this.nome,
            texto: mensagem,
            timestamp: new Date().toISOString()
        };
        
        this.mensagens.push(msg);
        console.log(`[${this.nome}] Você: ${mensagem}`);
        
        // Simula broadcast para peers
        this.peers.forEach(peer => {
            setTimeout(() => {
                peer.receberMensagem(msg);
            }, Math.random() * 1000); // Simula latência variável
        });
    }
    
    receberMensagem(msg) {
        this.mensagens.push(msg);
        console.log(`[${this.nome}] ${msg.de}: ${msg.texto}`);
    }
    
    conectarPeer(peer) {
        this.peers.push(peer);
    }
}

// Criar 3 nós
const alice = new ChatNode('Alice');
const bob = new ChatNode('Bob');
const charlie = new ChatNode('Charlie');

// Conectar nós (topologia full mesh)
alice.conectarPeer(bob);
alice.conectarPeer(charlie);
bob.conectarPeer(alice);
bob.conectarPeer(charlie);
charlie.conectarPeer(alice);
charlie.conectarPeer(bob);

// Interface de linha de comando
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('💬 Sistema de Chat Distribuído');
console.log('Nós: Alice, Bob, Charlie');
console.log('Digite mensagens no formato: NOME: mensagem');
console.log('Exemplo: Alice: Olá a todos!\n');

rl.on('line', (input) => {
    const [nome, ...mensagemParts] = input.split(':');
    const mensagem = mensagemParts.join(':').trim();
    
    if (nome && mensagem) {
        const nomeNormalizado = nome.trim().toLowerCase();
        
        if (nomeNormalizado === 'alice') {
            alice.enviarMensagem(mensagem);
        } else if (nomeNormalizado === 'bob') {
            bob.enviarMensagem(mensagem);
        } else if (nomeNormalizado === 'charlie') {
            charlie.enviarMensagem(mensagem);
        } else {
            console.log('❌ Nó desconhecido. Use: Alice, Bob ou Charlie');
        }
    }
});
```

Execute:
```bash
node chat-server.js
```

### 📝 Experimente:
1. Enviar mensagens de diferentes nós
2. Observar a latência variável
3. Pensar em como adicionar persistência
4. Considerar como lidar com mensagens fora de ordem

---

## 📊 Parte 6: Resumo e Reflexão

### O que aprendemos hoje na prática?

#### ✅ Conceitos Experimentados:
- Diferença entre processamento sequencial e paralelo
- Problemas de concorrência (race conditions)
- Impacto da latência de rede
- Importância da redundância para disponibilidade
- Comunicação entre nós em sistema distribuído

#### 🤔 Questões para Reflexão:
1. Quais foram os maiores desafios encontrados?
2. Como estes conceitos se aplicam a sistemas reais que vocês utilizam?
3. Que soluções poderiam resolver os problemas observados?

---

## 📚 Trabalho para Casa

### 1. Experimentação Adicional
- Modifique o exemplo da conta bancária para incluir um sistema de locks
- Adicione mais servidores ao teste de disponibilidade
- Melhore o chat distribuído com persistência de mensagens

---

## 🔗 Recursos Adicionais

### Documentação
- [Node.js Worker Threads](https://nodejs.org/api/worker_threads.html)
- [Understanding Concurrency](https://nodejs.dev/learn/understanding-javascript-concurrency)

### Ferramentas para Explorar
- Docker (vamos usar)
- Postman (para testar APIs)
- Redis (sistema distribuído real)

---

**Última atualização:** Outubro 2025  
**Disciplina:** Computação Distribuída 
