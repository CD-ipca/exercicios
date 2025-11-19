// src/routes/health.js
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @route   GET /api/health
 * @desc    Verificação básica de saúde da API
 * @access  Public
 */
router.get('/', healthController.getBasicHealth);

/**
 * @route   GET /api/health/details
 * @desc    Verificação detalhada de saúde da API
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.get('/details', healthController.getDetailedHealth);

module.exports = router;
