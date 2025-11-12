// src/services/productService.js
const AppError = require('../utils/AppError');
const Product = require('../models/Product');

// Simular base de dados em memória
let products = [
  {
    id: 1,
    name: 'Smartphone XYZ',
    description: 'Smartphone de última geração',
    price: 999.99,
    categoryId: 1,
    stock: 50,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Laptop Pro',
    description: 'Laptop para uso profissional',
    price: 1499.99,
    categoryId: 1,
    stock: 20,
    createdAt: '2023-09-02T10:00:00Z',
    updatedAt: '2023-09-02T10:00:00Z'
  },
  {
    id: 3,
    name: 'Headphones',
    description: 'Headphones com cancelamento de ruído',
    price: 199.99,
    categoryId: 2,
    stock: 100,
    createdAt: '2023-09-03T10:00:00Z',
    updatedAt: '2023-09-03T10:00:00Z'
  }
];

// Contador para IDs (simulação de auto-incremento)
let nextId = products.length + 1;

/**
 * Serviço para operações com produtos
 */
const productService = {
  /**
   * Obter todos os produtos
   * @param {Object} filters - Filtros para busca
   * @returns {Promise<Array>} - Lista de produtos
   */
  async getAllProducts(filters = {}) {
    // Aplicar filtros (simulando uma consulta de base de dados)
    let filteredProducts = [...products];

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === parseInt(filters.categoryId));
    }

    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }

    // Aplicar paginação
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Extrair produtos da página atual
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Informações de paginação
    const pagination = {
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: endIndex < filteredProducts.length,
      hasPreviousPage: startIndex > 0
    };

    // Converter para instâncias de Product
    const productInstances = paginatedProducts.map(p => new Product(p));

    return {
      products: productInstances,
      pagination
    };
  },

  /**
   * Obter um produto pelo ID
   * @param {number} id - ID do produto
   * @returns {Promise<Product>} - Produto encontrado
   * @throws {AppError} - Erro se o produto não for encontrado
   */
  async getProductById(id) {
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
      throw AppError.notFound('Produto', id);
    }

    return new Product(product);
  },

  /**
   * Criar um novo produto
   * @param {Object} productData - Dados do produto
   * @returns {Promise<Product>} - Produto criado
   * @throws {AppError} - Erro se dados forem inválidos
   */
  async createProduct(productData) {
    // Criar instância do produto
    const newProduct = new Product({
      ...productData,
      id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Validar dados
    const validationErrors = newProduct.validate();
    if (validationErrors.length > 0) {
      throw AppError.badRequest('Dados inválidos', { errors: validationErrors });
    }

    // Verificar se já existe produto com o mesmo nome (simulando constraint de unicidade)
    const existingProduct = products.find(p =>
      p.name.toLowerCase() === newProduct.name.toLowerCase()
    );

    if (existingProduct) {
      throw AppError.conflict('Produto', 'nome', newProduct.name);
    }

    // Adicionar à "base de dados"
    products.push(newProduct);

    return newProduct;
  },

  /**
   * Atualizar um produto existente
   * @param {number} id - ID do produto
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Product>} - Produto atualizado
   * @throws {AppError} - Erro se produto não for encontrado ou dados forem inválidos
   */
  async updateProduct(id, updateData) {
    // Encontrar índice do produto
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw AppError.notFound('Produto', id);
    }

    // Criar cópia do produto atual
    const currentProduct = { ...products[index] };

    // Atualizar apenas os campos fornecidos
    const updatedProduct = new Product({
      ...currentProduct,
      ...updateData,
      id: currentProduct.id, // Garantir que o ID não mude
      updatedAt: new Date().toISOString()
    });

    // Validar dados atualizados
    const validationErrors = updatedProduct.validate();
    if (validationErrors.length > 0) {
      throw AppError.badRequest('Dados inválidos', { errors: validationErrors });
    }

    // Verificar se o nome já existe em outro produto (se o nome foi alterado)
    if (updateData.name && updateData.name !== currentProduct.name) {
      const existingProduct = products.find(p =>
        p.id !== parseInt(id) &&
        p.name.toLowerCase() === updatedProduct.name.toLowerCase()
      );

      if (existingProduct) {
        throw AppError.conflict('Produto', 'nome', updatedProduct.name);
      }
    }

    // Atualizar à "base de dados"
    products[index] = updatedProduct;

    return updatedProduct;
  },

  /**
   * Excluir um produto
   * @param {number} id - ID do produto
   * @returns {Promise<boolean>} - true se excluído com sucesso
   * @throws {AppError} - Erro se produto não for encontrado
   */
  async deleteProduct(id) {
    // Encontrar índice do produto
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw AppError.notFound('Produto', id);
    }

    // Remover da "base de dados"
    products.splice(index, 1);

    return true;
  }
};

module.exports = productService;
