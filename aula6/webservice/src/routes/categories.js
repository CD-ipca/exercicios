// src/routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route   GET /api/v1/categories
 * @desc    Obter todas as categorias
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Obter uma categoria pelo ID
 * @access  Public
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route   POST /api/v1/categories
 * @desc    Criar uma nova categoria
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.post('/', categoryController.createCategory);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Atualizar uma categoria existente
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Excluir uma categoria
 * @access  Public (deveria ser Protected em uma aplicação real)
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
