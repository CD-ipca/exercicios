// src/middleware/notFoundHandler.js
const AppError = require('../utils/AppError');

/**
 * Middleware para lidar com rotas não encontradas
 */
module.exports = (req, res, next) => {
  next(new AppError(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 404));
};
