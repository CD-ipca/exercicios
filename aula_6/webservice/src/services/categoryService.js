// src/services/categoryService.js
const AppError = require('../utils/AppError');
const Category = require('../models/Category');
const { query } = require('../config/database');

/**
 * Serviço para operações com categorias
 */
const categoryService = {
  /**
   * Obter todas as categorias
   * @returns {Promise<Array>} - Lista de categorias
   */
  async getAllCategories() {
    const result = await query('SELECT * FROM categories ORDER BY id');
    return result.rows.map(row => new Category({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  },

  /**
   * Obter uma categoria pelo ID
   * @param {number} id - ID da categoria
   * @returns {Promise<Category>} - Categoria encontrada
   * @throws {AppError} - Erro se a categoria não for encontrada
   */
  async getCategoryById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw AppError.notFound('Categoria', id);
    }

    const row = result.rows[0];
    return new Category({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  },

  /**
   * Criar uma nova categoria
   * @param {Object} categoryData - Dados da categoria
   * @returns {Promise<Category>} - Categoria criada
   * @throws {AppError} - Erro se dados forem inválidos
   */
  async createCategory(categoryData) {
    // Criar instância da categoria para validação (sem ID ainda)
    const tempCategory = new Category({
      ...categoryData,
      id: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Validar dados
    const validationErrors = tempCategory.validate();
    if (validationErrors.length > 0) {
      throw AppError.badRequest('Dados inválidos', { errors: validationErrors });
    }

    try {
      // Inserir na base de dados
      const result = await query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
        [categoryData.name, categoryData.description]
      );

      const row = result.rows[0];
      return new Category({
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      // Verificar se é erro de unicidade (duplicate key)
      if (error.code === '23505') {
        throw AppError.conflict('Categoria', 'nome', categoryData.name);
      }
      throw error;
    }
  },

  /**
   * Atualizar uma categoria existente
   * @param {number} id - ID da categoria
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Category>} - Categoria atualizada
   * @throws {AppError} - Erro se categoria não for encontrada ou dados forem inválidos
   */
  async updateCategory(id, updateData) {
    // Buscar categoria atual
    const currentResult = await query('SELECT * FROM categories WHERE id = $1', [id]);

    if (currentResult.rows.length === 0) {
      throw AppError.notFound('Categoria', id);
    }

    const currentRow = currentResult.rows[0];
    const currentCategory = {
      id: currentRow.id,
      name: currentRow.name,
      description: currentRow.description,
      createdAt: currentRow.created_at,
      updatedAt: currentRow.updated_at
    };

    // Atualizar apenas os campos fornecidos
    const updatedCategory = new Category({
      ...currentCategory,
      ...updateData,
      id: currentCategory.id, // Garantir que o ID não mude
      updatedAt: new Date().toISOString()
    });

    // Validar dados atualizados
    const validationErrors = updatedCategory.validate();
    if (validationErrors.length > 0) {
      throw AppError.badRequest('Dados inválidos', { errors: validationErrors });
    }

    try {
      // Atualizar na base de dados
      const result = await query(
        'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [updatedCategory.name, updatedCategory.description, id]
      );

      const row = result.rows[0];
      return new Category({
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      // Verificar se é erro de unicidade (duplicate key)
      if (error.code === '23505') {
        throw AppError.conflict('Categoria', 'nome', updatedCategory.name);
      }
      throw error;
    }
  },

  /**
   * Excluir uma categoria
   * @param {number} id - ID da categoria
   * @returns {Promise<boolean>} - true se excluída com sucesso
   * @throws {AppError} - Erro se categoria não for encontrada
   */
  async deleteCategory(id) {
    // Verificar se a categoria existe
    const checkResult = await query('SELECT * FROM categories WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      throw AppError.notFound('Categoria', id);
    }

    // Verificar se existem produtos usando esta categoria
    const productsService = require('./productService');
    const { products } = await productsService.getAllProducts({ categoryId: id });

    if (products.length > 0) {
      throw AppError.badRequest(
        `Não é possível excluir a categoria pois existem ${products.length} produtos associados a ela`,
        { categoryId: id, productCount: products.length }
      );
    }

    // Remover da base de dados
    await query('DELETE FROM categories WHERE id = $1', [id]);

    return true;
  }
};

module.exports = categoryService;
