// src/server.js
/**
 * Módulo principal do servidor
 *
 * Este módulo é responsável por:
 * 1. Inicializar a conexão com a base de dados
 * 2. Iniciar o servidor HTTP
 * 3. Configurar tratamento de erros e sinais de termino
 * 4. Gerenciar o graceful shutdown da aplicação
 */

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { testConnection, closePool } = require('./config/database');
const { initDatabase } = require('./config/initDatabase');

/**
 * Função para inicializar o servidor e a base de dados
 *
 * Esta função:
 * 1. Testa a conexão com PostgreSQL
 * 2. Inicializa a estrutura da base de dados (tabelas, índices, dados iniciais)
 * 3. Inicia o servidor HTTP apenas se a base de dados estiver pronta
 *
 * Abordagem assíncrona garante que a aplicação só inicia quando
 * todos os recursos necessários estão disponíveis.
 */
const startServer = async () => {
  try {
    // Passo 1: Testar conexão com PostgreSQL
    logger.info('🔌 Testando conexão com PostgreSQL...');
    const isConnected = await testConnection();

    if (!isConnected) {
      logger.error('❌ Falha ao conectar com PostgreSQL. Servidor não iniciado.');
      process.exit(1); // Terminar aplicação se não conseguir conectar
    }

    // Passo 2: Inicializar estrutura da base de dados
    logger.info('📊 Inicializando base de dados...');
    const dbInitialized = await initDatabase();

    if (!dbInitialized) {
      logger.error('❌ Falha ao inicializar base de dados. Servidor não iniciado.');
      process.exit(1); // Terminar aplicação se não conseguir inicializar DB
    }

    // Passo 3: Iniciar servidor HTTP
    server = app.listen(config.server.port, () => {
      logger.info(`🚀 Servidor à escuta na porta ${config.server.port} em modo ${config.server.env}`);
      logger.info(`📝 Aceder a documentação em http://localhost:${config.server.port}/api-docs`);
      logger.info(`🗄️  PostgreSQL conectado em ${config.database.host}:${config.database.port}`);
    });

  } catch (error) {
    // Capturar qualquer erro durante a inicialização
    logger.error('❌ Erro crítico ao iniciar servidor', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1); // Terminar aplicação em caso de erro crítico
  }
};

// Variável para armazenar a instância do servidor
let server;

// Iniciar o servidor
startServer();

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado', { error: error.message, stack: error.stack });
  // Em ambiente de produção, pode ser melhor encerrar o processo
  if (config.server.env === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejeição de promessa não tratada', { reason, promise });
  // Em ambiente de produção, pode ser melhor encerrar o processo
  if (config.server.env === 'production') {
    process.exit(1);
  }
});

/**
 * Tratamento de sinais para termino da aplicação
 *
 * SIGTERM: Sinal de terminação (ex: docker stop, kill)
 * SIGINT: Sinal de interrupção (ex: Ctrl+C no terminal)
 *
 * Ambos os sinais iniciam um graceful shutdown.
 */
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Função de Graceful Shutdown
 *
 * Graceful Shutdown é o processo de encerrar a aplicação de forma
 * controlada e segura:
 *
 * 1. Parar de aceitar novos requests HTTP
 * 2. Aguardar requests em andamento terminarem
 * 3. Fechar conexões com base de dados
 * 4. Finalizar processos pendentes
 * 5. Encerrar a aplicação
 *
 * Isto garante que:
 * - Nenhum request é perdido
 * - Transações de base de dados são finalizadas
 * - Dados não são corrompidos
 */
async function gracefulShutdown() {
  logger.info('📥 Recebido sinal de termino, iniciando graceful shutdown...');

  // Passo 1: Parar de aceitar novos requests
  if (server) {
    server.close(async () => {
      logger.info('✅ Servidor HTTP encerrado');

      try {
        // Passo 2: Fechar pool de conexões com PostgreSQL
        logger.info('🔌 Fechando conexões com PostgreSQL...');
        await closePool();

        logger.info('✅ Graceful shutdown completado com sucesso');
        process.exit(0); // Encerrar processo com código de sucesso
      } catch (error) {
        logger.error('❌ Erro durante graceful shutdown', {
          error: error.message
        });
        process.exit(1); // Encerrar processo com código de erro
      }
    });
  } else {
    // Se o servidor ainda não foi iniciado
    logger.info('Servidor não foi iniciado, encerrando...');
    process.exit(0);
  }

  // Timeout de segurança: Se o graceful shutdown demorar mais de 10 segundos,
  // forçar o termino da aplicação
  setTimeout(() => {
    logger.error('⚠️  Timeout do graceful shutdown (10s), forçando termino');
    process.exit(1);
  }, 10000);
}

module.exports = server; // Exportar para testes
