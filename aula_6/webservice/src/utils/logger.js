// src/utils/logger.js
const winston = require('winston');
const config = require('../config');

// Definir formato para os logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, ...rest }) => {
    let log = `${timestamp} ${level.toUpperCase()}: ${message}`;
    if (Object.keys(rest).length > 0) {
      log += ` ${JSON.stringify(rest)}`;
    }
    return log;
  })
);

// Criar logger
const logger = winston.createLogger({
  level: config.logger.level,
  format: logFormat,
  transports: [
    // Log para console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // Log para arquivo (em ambiente de produção)
    ...(config.server.env === 'production' ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ] : [])
  ]
});

module.exports = logger;
