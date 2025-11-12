// src/controllers/categoryController.js
const categoryService = require('../services/categoryService');
const AppError = require('../utils/AppError');

/**
 * Controlador para operações com categorias
 */
const categoryController = {
  /**
   * Obter todas as categorias
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async getAllCategories(req, res, next) {
    try {
      // get categorias
      const categories = await categoryService.getAllCategories();

      // Retornar response
      res.status(200).json({
        status: 'success',
        data: {
          categories: categories.map(c => c.toJSON())
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter uma categoria pelo ID
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        throw AppError.badRequest('ID da categoria inválido');
      }

      // Buscar categoria
      const category = await categoryService.getCategoryById(parseInt(id));

      // Retornar response
      res.status(200).json({
        status: 'success',
        data: {
          category: category.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar uma nova categoria
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async createCategory(req, res, next) {
    try {
      const categoryData = req.body;

      // Criar categoria
      const newCategory = await categoryService.createCategory(categoryData);

      // Retornar response
      res.status(201).json({
        status: 'success',
        data: {
          category: newCategory.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar uma categoria existente
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        throw AppError.badRequest('ID da categoria inválido');
      }

      // Atualizar categoria
      const updatedCategory = await categoryService.updateCategory(parseInt(id), updateData);

      // Retornar response
      res.status(200).json({
        status: 'success',
        data: {
          category: updatedCategory.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir uma categoria
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        throw AppError.badRequest('ID da categoria inválido');
      }

      // Excluir categoria
      await categoryService.deleteCategory(parseInt(id));

      // Retornar response (sem conteúdo)
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
