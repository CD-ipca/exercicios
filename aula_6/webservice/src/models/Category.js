// src/models/Category.js

/**
 * Modelo para Categoria
 *
 * Em uma implementação real, isso seria uma classe ou esquema de base de dados
 * Estamos simulando com um objeto simples para fins didáticos
 */
class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Valida os dados da categoria
   * @returns {Array} - Array de erros de validação
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Nome da categoria é obrigatório');
    }

    return errors;
  }

  /**
   * Converte o objeto para formato JSON
   * @returns {Object} - Representação JSON da categoria
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Category;
