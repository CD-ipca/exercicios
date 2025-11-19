// src/config/database.js
/**
 * Módulo de Conexão com PostgreSQL
 *
 * Este módulo gerencia a conexão com a base de dados PostgreSQL utilizando
 * o driver 'pg' (node-postgres). Implementa um pool de conexões para melhor
 * desempenho e gestão de recursos.
 *
 * Pool de Conexões:
 * - Um pool mantém múltiplas conexões abertas com a base de dados
 * - Quando uma query é executada, uma conexão do pool é utilizada
 * - Após a execução, a conexão retorna ao pool (não é fechada)
 * - Isto melhora significativamente o desempenho em aplicações com múltiplos requests
 */

const { Pool } = require('pg');
const config = require('./index');
const logger = require('../utils/logger');

/**
 * Configuração do Pool de Conexões PostgreSQL
 *
 * Opções importantes:
 * - host: Endereço do servidor de base de dados
 * - port: Porta do PostgreSQL (padrão 5432)
 * - user: Nome do utilizador da base de dados
 * - password: Senha do utilizador
 * - database: Nome da base de dados a conectar
 * - max: Número máximo de clientes no pool (padrão: 10)
 * - idleTimeoutMillis: Tempo que um cliente inativo permanece no pool antes de ser fechado
 * - connectionTimeoutMillis: Tempo máximo de espera para obter uma conexão do pool
 */
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  max: 20, // Número máximo de clientes no pool
  idleTimeoutMillis: 30000, // 30 segundos - tempo que cliente inativo fica no pool
  connectionTimeoutMillis: 2000, // 2 segundos - tempo máximo de espera por uma conexão
});

/**
 * Event Listener: Conexão bem-sucedida
 *
 * Este evento é disparado quando um novo cliente se conecta com sucesso à base de dados.
 * Útil para logging e debugging.
 */
pool.on('connect', () => {
  logger.info('✅ Nova conexão estabelecida com PostgreSQL');
});

/**
 * Event Listener: Erro na conexão
 *
 * Este evento é disparado quando ocorre um erro com um cliente no pool.
 * Importante para detectar problemas de conexão e timeouts.
 *
 * @param {Error} err - Objeto de erro contendo detalhes da falha
 * @param {Object} client - Cliente que gerou o erro
 */
pool.on('error', (err, client) => {
  logger.error('❌ Erro inesperado no cliente PostgreSQL', {
    error: err.message,
    stack: err.stack
  });
  // Não executar process.exit() aqui - deixar a aplicação continuar
  // O pool tentará recuperar automaticamente
});

/**
 * Event Listener: Cliente removido do pool
 *
 * Disparado quando um cliente é removido do pool (por timeout ou erro).
 * Útil para monitoramento da saúde do pool.
 */
pool.on('remove', () => {
  logger.info('Cliente PostgreSQL removido do pool');
});

/**
 * Função para testar a conexão com a base de dados
 *
 * Esta função executa uma query simples para verificar se a conexão
 * com a base de dados está funcionando corretamente.
 *
 * @returns {Promise<boolean>} - Retorna true se conectado, false caso contrário
 */
const testConnection = async () => {
  try {
    // Executar uma query simples para testar a conexão
    // SELECT NOW() retorna a data/hora atual do servidor PostgreSQL
    const result = await pool.query('SELECT NOW()');
    logger.info('✅ Conexão com PostgreSQL testada com sucesso', {
      timestamp: result.rows[0].now
    });
    return true;
  } catch (error) {
    // Log detalhado do erro para facilitar debugging
    logger.error('❌ Falha ao conectar com PostgreSQL', {
      error: error.message,
      host: config.database.host,
      port: config.database.port,
      database: config.database.database
    });
    return false;
  }
};

/**
 * Função para executar queries na base de dados
 *
 * Esta é uma função wrapper que adiciona logging e tratamento de erros
 * às queries executadas. Útil para debugging e monitoramento.
 *
 * @param {string} text - Query SQL a ser executada
 * @param {Array} params - Parâmetros da query (para prepared statements)
 * @returns {Promise<Object>} - Resultado da query
 *
 * Exemplo de uso:
 * const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
const query = async (text, params) => {
  const start = Date.now(); // Marcar início da execução

  try {
    // Executar a query utilizando uma conexão do pool
    const result = await pool.query(text, params);

    // Calcular duração da query
    const duration = Date.now() - start;

    // Log da query executada (útil para debugging e otimização)
    logger.info('Query executada', {
      text,
      duration: `${duration}ms`,
      rows: result.rowCount
    });

    return result;
  } catch (error) {
    // Log detalhado do erro da query
    logger.error('Erro ao executar query', {
      text,
      error: error.message,
      stack: error.stack
    });
    throw error; // Re-lançar o erro para ser tratado pelo caller
  }
};

/**
 * Função para obter um cliente específico do pool
 *
 * Útil quando você precisa executar múltiplas queries na mesma conexão,
 * como em transações. IMPORTANTE: Você deve libertar o cliente manualmente
 * após o uso chamando client.release()
 *
 * @returns {Promise<Object>} - Cliente do pool
 *
 * Exemplo de uso com transação:
 * const client = await getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query('INSERT INTO ...');
 *   await client.query('UPDATE ...');
 *   await client.query('COMMIT');
 * } catch (e) {
 *   await client.query('ROLLBACK');
 *   throw e;
 * } finally {
 *   client.release(); // SEMPRE liberar o cliente!
 * }
 */
const getClient = async () => {
  try {
    const client = await pool.connect();
    logger.info('Cliente obtido do pool');
    return client;
  } catch (error) {
    logger.error('Erro ao obter cliente do pool', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Função para encerrar o pool de conexões
 *
 * Deve ser chamada quando a aplicação está encerrando para fechar
 * todas as conexões abertas com a base de dados de forma limpa.
 *
 * @returns {Promise<void>}
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('🔌 Pool de conexões PostgreSQL encerrado');
  } catch (error) {
    logger.error('Erro ao encerrar pool de conexões', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Obter estatísticas do pool
 *
 * Retorna informações sobre o estado atual do pool de conexões.
 * Útil para monitoramento e debugging.
 *
 * @returns {Object} - Estatísticas do pool
 */
const getPoolStats = () => {
  return {
    totalConnections: pool.totalCount, // Total de clientes no pool
    idleConnections: pool.idleCount,   // Clientes inativos disponíveis
    waitingRequests: pool.waitingCount  // Requests aguardando por uma conexão
  };
};

// Exportar funções e objetos para uso em outros módulos
module.exports = {
  pool,           // Pool completo (use com cuidado)
  query,          // Função para executar queries simples
  getClient,      // Obter cliente para transações
  testConnection, // Testar se a conexão está funcionando
  closePool,      // Encerrar pool (usar no shutdown da aplicação)
  getPoolStats    // Obter estatísticas do pool
};
