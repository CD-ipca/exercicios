// src/models/Product.js

/**
 * Modelo para Produto
 *
 * Em uma implementação real, isso seria uma classe ou esquema de base de dados
 * Estamos simulando com um objeto simples para fins didáticos
 */
class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.categoryId = data.categoryId;
    this.stock = data.stock || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Valida os dados do produto
   * @returns {Array} - Array de erros de validação
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Nome do produto é obrigatório');
    }

    if (!this.price || isNaN(this.price) || this.price <= 0) {
      errors.push('Preço deve ser um número positivo');
    }

    if (!this.categoryId) {
      errors.push('Categoria é obrigatória');
    }

    if (this.stock !== undefined && (isNaN(this.stock) || this.stock < 0)) {
      errors.push('Stock deve ser um número não-negativo');
    }

    return errors;
  }

  /**
   * Converte o objeto para formato JSON
   * @returns {Object} - Representação JSON do produto
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      categoryId: this.categoryId,
      stock: this.stock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;
