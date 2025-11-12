// src/config/initDatabase.js
/**
 * Script de Inicialização da Base de Dados
 *
 * Este módulo é responsável por:
 * 1. Criar as tabelas necessárias se não existirem
 * 2. Inserir dados iniciais (seed data) para desenvolvimento/testes
 * 3. Verificar a integridade da estrutura da base de dados
 *
 * É executado automaticamente quando o servidor inicia.
 */

const { query } = require('./database');
const logger = require('../utils/logger');

/**
 * SQL para criar a tabela de Categorias
 *
 * Campos:
 * - id: Chave primária auto-incrementada (SERIAL é equivalente a AUTO_INCREMENT)
 * - name: Nome da categoria (obrigatório, único)
 * - description: Descrição da categoria (opcional)
 * - created_at: Data de criação (preenchida automaticamente)
 * - updated_at: Data de última atualização (preenchida automaticamente)
 *
 * IF NOT EXISTS: Cria a tabela apenas se ela não existir
 */
const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * SQL para criar a tabela de Produtos
 *
 * Campos:
 * - id: Chave primária auto-incrementada
 * - name: Nome do produto (obrigatório)
 * - description: Descrição do produto (opcional)
 * - price: Preço do produto (NUMERIC para precisão decimal)
 * - category_id: Chave estrangeira para a tabela categories
 * - stock: Quantidade em estoque (padrão: 0)
 * - created_at: Data de criação (preenchida automaticamente)
 * - updated_at: Data de última atualização (preenchida automaticamente)
 *
 * FOREIGN KEY: Relacionamento com a tabela categories
 * ON DELETE SET NULL: Se a categoria for deletada, category_id fica NULL
 */
const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * SQL para criar índices
 *
 * Índices melhoram o desempenho de queries de busca.
 * - Índice no category_id facilita JOIN entre products e categories
 * - Índice no name facilita buscas por nome de produto
 *
 * IF NOT EXISTS: Cria o índice apenas se ele não existir
 */
const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
`;

/**
 * Função para criar trigger de atualização de updated_at
 *
 * Triggers são funções que executam automaticamente quando
 * determinadas operações ocorrem na base de dados.
 *
 * Este trigger atualiza o campo updated_at sempre que um
 * registro é modificado (UPDATE).
 */
const createUpdateTrigger = `
  -- Criar função que atualiza o campo updated_at
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Criar trigger para a tabela categories
  DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
  CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- Criar trigger para a tabela products
  DROP TRIGGER IF EXISTS update_products_updated_at ON products;
  CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

/**
 * Dados iniciais (seed data) para a tabela de categorias
 *
 * INSERT ... ON CONFLICT DO NOTHING:
 * - Tenta inserir os dados
 * - Se já existir (conflito de UNIQUE constraint), não faz nada
 * - Evita erros em múltiplas execuções do script
 */
const seedCategories = `
  INSERT INTO categories (id, name, description) VALUES
    (1, 'Eletrônicos', 'Produtos eletrônicos como smartphones, laptops, etc.'),
    (2, 'Acessórios', 'Acessórios para dispositivos eletrônicos'),
    (3, 'Vestuário', 'Roupas e calçados')
  ON CONFLICT (name) DO NOTHING;
`;

/**
 * Dados iniciais (seed data) para a tabela de produtos
 *
 * NOTA: Utiliza ON CONFLICT para evitar duplicação de dados
 * em múltiplas execuções do script de inicialização
 */
const seedProducts = `
  INSERT INTO products (id, name, description, price, category_id, stock, created_at, updated_at) VALUES
    (1, 'Smartphone XYZ', 'Smartphone de última geração', 999.99, 1, 50, '2023-09-01 10:00:00', '2023-09-01 10:00:00'),
    (2, 'Laptop Pro', 'Laptop para uso profissional', 1499.99, 1, 20, '2023-09-02 10:00:00', '2023-09-02 10:00:00'),
    (3, 'Headphones', 'Headphones com cancelamento de ruído', 199.99, 2, 100, '2023-09-03 10:00:00', '2023-09-03 10:00:00')
  ON CONFLICT (id) DO NOTHING;
`;

/**
 * Resetar a sequência dos IDs
 *
 * SERIAL cria automaticamente uma sequência para gerar IDs.
 * Após inserir dados com IDs específicos, precisamos ajustar
 * a sequência para continuar a partir do próximo ID disponível.
 *
 * COALESCE: Retorna o primeiro valor não-nulo
 * MAX(id): Encontra o maior ID existente
 * Se não houver registros, começa em 1
 */
const resetSequences = `
  -- Resetar sequência de categories
  SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1), true);

  -- Resetar sequência de products
  SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1), true);
`;

/**
 * Função principal de inicialização da base de dados
 *
 * Esta função executa todos os scripts de criação e seed data
 * de forma sequencial. Se ocorrer algum erro, a operação é abortada.
 *
 * @returns {Promise<boolean>} - true se sucesso, false se erro
 */
const initDatabase = async () => {
  try {
    logger.info('🚀 Iniciando configuração da base de dados...');

    // 1. Criar tabela de categorias
    logger.info('📊 Criando tabela de categorias...');
    await query(createCategoriesTable);

    // 2. Criar tabela de produtos
    logger.info('📦 Criando tabela de produtos...');
    await query(createProductsTable);

    // 3. Criar índices para melhorar performance
    logger.info('🔍 Criando índices...');
    await query(createIndexes);

    // 4. Criar triggers de atualização automática
    logger.info('⚡ Criando triggers...');
    await query(createUpdateTrigger);

    // 5. Inserir dados iniciais de categorias
    logger.info('🌱 Inserindo dados iniciais de categorias...');
    await query(seedCategories);

    // 6. Inserir dados iniciais de produtos
    logger.info('🌱 Inserindo dados iniciais de produtos...');
    await query(seedProducts);

    // 7. Resetar sequências de IDs
    logger.info('🔄 Resetando sequências de IDs...');
    await query(resetSequences);

    logger.info('✅ Base de dados configurada com sucesso!');
    return true;
  } catch (error) {
    // Log detalhado do erro
    logger.error('❌ Erro ao inicializar base de dados', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};

/**
 * Função para verificar se as tabelas existem
 *
 * Útil para diagnóstico e verificação de integridade.
 *
 * @returns {Promise<Object>} - Objeto com status das tabelas
 */
const checkTables = async () => {
  try {
    // Query para verificar existência das tabelas
    const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN ('categories', 'products')
    `);

    const tables = result.rows.map(row => row.table_name);

    return {
      categoriesExists: tables.includes('categories'),
      productsExists: tables.includes('products'),
      tables: tables
    };
  } catch (error) {
    logger.error('Erro ao verificar tabelas', { error: error.message });
    throw error;
  }
};

// Exportar funções para uso em outros módulos
module.exports = {
  initDatabase,  // Inicializar toda a estrutura da base de dados
  checkTables    // Verificar se as tabelas existem
};
