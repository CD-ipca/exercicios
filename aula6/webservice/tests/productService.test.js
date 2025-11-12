// tests/productService.test.js
const productService = require('../src/services/productService');
const AppError = require('../src/utils/AppError');

// Mock para testar funcionalidades sem base de dados real
jest.mock('../src/models/Product', () => {
  return class Product {
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

    validate() {
      const errors = [];
      if (!this.name) errors.push('Nome é obrigatório');
      if (!this.price || this.price <= 0) errors.push('Preço inválido');
      return errors;
    }

    toJSON() {
      return { ...this };
    }
  };
});

describe('Product Service', () => {
  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const result = await productService.getAllProducts();
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.products)).toBe(true);
    });

    it('should filter products by category', async () => {
      const categoryId = 1;
      const result = await productService.getAllProducts({ categoryId });

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach(product => {
        expect(product.categoryId).toBe(categoryId);
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const product = await productService.getProductById(1);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
    });

    it('should throw an error if product not found', async () => {
      await expect(productService.getProductById(999)).rejects.toThrow(AppError);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProductData = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        categoryId: 1,
        stock: 10
      };

      const newProduct = await productService.createProduct(newProductData);
      expect(newProduct).toBeDefined();
      expect(newProduct.name).toBe(newProductData.name);
      expect(newProduct.price).toBe(newProductData.price);
    });

    it('should throw an error if data is invalid', async () => {
      // Produto sem nome
      const invalidProduct = {
        price: 99.99,
        categoryId: 1
      };

      await expect(productService.createProduct(invalidProduct)).rejects.toThrow(AppError);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateData = {
        price: 129.99,
        stock: 50
      };

      const updatedProduct = await productService.updateProduct(1, updateData);
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.price).toBe(updateData.price);
      expect(updatedProduct.stock).toBe(updateData.stock);
    });

    it('should throw an error if product not found', async () => {
      const updateData = {
        price: 129.99
      };

      await expect(productService.updateProduct(999, updateData)).rejects.toThrow(AppError);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      // Primeiro criamos um produto para depois excluí-lo
      const newProductData = {
        name: 'Product to Delete',
        price: 49.99,
        categoryId: 1
      };

      const newProduct = await productService.createProduct(newProductData);
      const result = await productService.deleteProduct(newProduct.id);

      expect(result).toBe(true);

      // Verificar se o produto foi realmente excluído
      await expect(productService.getProductById(newProduct.id)).rejects.toThrow(AppError);
    });

    it('should throw an error if product not found', async () => {
      await expect(productService.deleteProduct(999)).rejects.toThrow(AppError);
    });
  });
});
