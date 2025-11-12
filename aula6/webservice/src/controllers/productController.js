// src/controllers/productController.js
const productService = require('../services/productService');
const AppError = require('../utils/AppError');

/**
 * Controlador para operações com produtos
 */
const productController = {
  /**
   * Obter todos os produtos
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async getAllProducts(req, res, next) {
    try {
      // Extrair filtros da query string
      const filters = {
        categoryId: req.query.categoryId,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        inStock: req.query.inStock === 'true',
        page: req.query.page,
        limit: req.query.limit
      };

      // Buscar produtos
      const { products, pagination } = await productService.getAllProducts(filters);

      // Retornar response
      res.status(200).json({
        status: 'success',
        pagination,
        data: {
          products: products.map(p => p.toJSON())
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter um produto pelo ID
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        throw AppError.badRequest('ID do produto inválido');
      }

      // Buscar produto
      const product = await productService.getProductById(parseInt(id));

      // Retornar response
      res.status(200).json({
        status: 'success',
        data: {
          product: product.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar um novo produto
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async createProduct(req, res, next) {
    try {
      const productData = req.body;

      // Criar produto
      const newProduct = await productService.createProduct(productData);

      // Retornar response
      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar um produto existente
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        throw AppError.badRequest('ID do produto inválido');
      }

      // Atualizar produto
      const updatedProduct = await productService.updateProduct(parseInt(id), updateData);

      // Retornar response
      res.status(200).json({
        status: 'success',
        data: {
          product: updatedProduct.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir um produto
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   * @param {Function} next - Função de callback para próximo middleware
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        throw AppError.badRequest('ID do produto inválido');
      }

      // Excluir produto
      await productService.deleteProduct(parseInt(id));

      // Retornar response (sem conteúdo)
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
