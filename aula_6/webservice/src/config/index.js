// src/config/index.js
require('dotenv').config();

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Configurações de log
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // Configurações de rate limiting
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },

  // Configuração de base de dados PostgreSQL
  // Estas configurações são carregadas das variáveis de ambiente (.env)
  database: {
    host: process.env.DB_HOST || 'localhost', // Endereço do servidor PostgreSQL
    port: parseInt(process.env.DB_PORT) || 5432, // Porta do PostgreSQL (padrão: 5432)
    user: process.env.DB_USER || 'postgres', // Utilizador da base de dados
    password: process.env.DB_PASSWORD || 'postgres', // Senha do utilizador
    database: process.env.DB_NAME || 'postgres', // Nome da base de dados
  },

  // Futura configuração de autenticação
  auth: {
    // jwt: {
    //   secret: process.env.JWT_SECRET || 'chave_secreta_padrao_mudar_em_producao',
    //   expiresIn: process.env.JWT_EXPIRATION || '1h',
    // },
  },
};

module.exports = config;
