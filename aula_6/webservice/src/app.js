// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// Importação das rotas
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const healthRoutes = require('./routes/health');

// Criar a aplicação Express
const app = express();

// Configurar middleware de segurança
app.use(helmet());
app.use(cors());

// Middleware para parsing do corpo dos requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rotas da API
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/health', healthRoutes);

// Rota para documentação da API (para futuras implementações)
app.use('/api-docs', (req, res) => {
  res.redirect('https://documenter.getpostman.com/'); // Substituir pelo URL real da documentação
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do WebService Template',
    documentation: '/api-docs',
    version: '1.0.0',
    endpoints: [
      { path: '/api/v1/products', description: 'Gestão de produtos' },
      { path: '/api/v1/categories', description: 'Gestão de categorias' },
      { path: '/api/health', description: 'Status de saúde da API' }
    ]
  });
});

// Middleware para rota não encontrada
app.use(notFoundHandler);

// Middleware para tratamento de erros
app.use(errorHandler);

module.exports = app;
