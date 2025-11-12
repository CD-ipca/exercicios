// src/middleware/errorHandler.js
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const config = require('../config');

/**
 * Middleware para tratamento centralizado de erros
 */
module.exports = (err, req, res, next) => {
  // Registrar o erro
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    error: err.name,
    stack: config.server.env === 'development' ? err.stack : undefined,
    statusCode: err.statusCode
  });

  // Determinar o código de status HTTP
  const statusCode = err.statusCode || 500;

  // Preparar response para o cliente
  const errorResponse = {
    status: 'error',
    message: err.message || 'Erro interno do servidor',
  };

  // Adicionar detalhes se for um erro da aplicação e estiver em desenvolvimento
  if (err instanceof AppError && config.server.env === 'development') {
    if (err.additionalInfo && Object.keys(err.additionalInfo).length > 0) {
      errorResponse.details = err.additionalInfo;
    }

    if (err.stack) {
      errorResponse.stack = err.stack;
    }
  }

  // Responder com o erro
  res.status(statusCode).json(errorResponse);
};
