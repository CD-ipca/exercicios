// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @route   GET /api/v1/products
 * @desc    Obter todos os produtos
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Obter um produto pelo ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Criar um novo produto
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.post('/', productController.createProduct);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Atualizar um produto existente
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.put('/:id', productController.updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Excluir um produto
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
