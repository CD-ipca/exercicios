# Aula 8 – Exercícios Práticos: Test-Driven Development

## Computação Distribuída | IPCA

---

## 🛠 Configuração Inicial

### Pré-requisitos
- Node.js v18+ instalado
- Projeto `webservice` da aula 6
- VS Code com extensão Jest

### 1.1 Verificar Instalações

```bash
# Verificar versões
node --version
npm --version
```

### 1.2 Preparar o Projeto

```bash
# Navegar para o webservice da aula 6
cd aula_6/webservice

# Instalar dependências (se ainda não instaladas)
npm install

# Verificar que Jest já está instalado
npx jest --version
```

### 1.3 Verificar package.json

O projeto deve ter os scripts de teste configurados:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 1.4 Estrutura de Testes Existente

O webservice já tem a seguinte estrutura:

```
webservice/
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   └── orderController.js
│   ├── services/
│   │   ├── productService.js
│   │   ├── categoryService.js
│   │   └── orderService.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
│   ├── product.test.js         # Já existe
│   └── productService.test.js  # Já existe
└── package.json
```

✅ **Checkpoint:** Confirmar que `npm test -- tests/product.test.js` executa com sucesso

---

## 💻 Exercício 1: Testes do Modelo Category

### 🎯 Objetivo
Criar testes unitários para o modelo `Category` seguindo o padrão do `product.test.js`.

### Instruções

**Criar ficheiro `tests/category.test.js`:**

```javascript
// tests/category.test.js
// Testes unitários para o modelo Category

const Category = require('../src/models/Category');

describe('Category Model', () => {

  // ============================================
  // TESTES DO CONSTRUCTOR
  // ============================================
  describe('constructor', () => {
    // TODO 1: Testar criação com todos os campos
    it('deve criar categoria com todos os campos', () => {
      const data = {
        id: 1,
        name: 'Eletrónica',
        description: 'Produtos eletrónicos'
      };

      const category = new Category(data);

      // COMPLETAR: Verificar que os campos foram atribuídos corretamente
      // expect(category.id).toBe(1);
      // expect(category.name).toBe('Eletrónica');
      // ...
    });

    // TODO 2: Testar valores default
    it('deve usar valores default para campos opcionais', () => {
      const category = new Category({
        name: 'Categoria Simples'
      });

      // COMPLETAR: Verificar valores default
      // expect(category.description).toBe('');
      // expect(category.createdAt).toBeDefined();
    });
  });

  // ============================================
  // TESTES DE VALIDAÇÃO
  // ============================================
  describe('validate', () => {
    // TODO 3: Testar validação com dados válidos
    it('deve retornar array vazio para categoria válida', () => {
      const category = new Category({
        name: 'Categoria Válida',
        description: 'Uma descrição'
      });

      // COMPLETAR
      // const errors = category.validate();
      // expect(errors).toHaveLength(0);
    });

    // TODO 4: Testar validação quando nome está vazio
    it('deve retornar erro quando nome está vazio', () => {
      const category = new Category({
        name: '',
        description: 'Descrição'
      });

      // COMPLETAR
    });

    // TODO 5: Testar validação quando nome é apenas espaços
    it('deve retornar erro quando nome é apenas espaços', () => {
      // COMPLETAR
    });

    // TODO 6: Testar validação quando nome não é fornecido
    it('deve retornar erro quando nome não é fornecido', () => {
      const category = new Category({
        description: 'Apenas descrição'
      });

      // COMPLETAR
    });
  });

  // ============================================
  // TESTES DO toJSON
  // ============================================
  describe('toJSON', () => {
    // TODO 7: Testar conversão para JSON
    it('deve retornar objeto com todas as propriedades', () => {
      const category = new Category({
        id: 1,
        name: 'Livros',
        description: 'Livros e publicações'
      });

      const json = category.toJSON();

      // COMPLETAR: Verificar todas as propriedades
      // expect(json).toHaveProperty('id', 1);
      // expect(json).toHaveProperty('name', 'Livros');
      // ...
    });
  });
});
```

### Testar

```bash
npm test -- tests/category.test.js
```

### 🤔 Questões para Reflexão

1. Qual a diferença entre testar o constructor e testar validate?
2. Por que testamos cenários de erro (nome vazio)?
3. Quantos testes são suficientes para cobrir a validação?

---

## 💻 Exercício 2: Testes do Modelo Order

### 🎯 Objetivo
Criar testes unitários para o modelo `Order`, que é mais complexo e inclui cálculos.

### Instruções

**Criar ficheiro `tests/order.test.js`:**

```javascript
// tests/order.test.js
// Testes unitários para o modelo Order

const Order = require('../src/models/Order');

describe('Order Model', () => {

  // Dados de teste reutilizáveis
  const validOrderData = {
    id: 1,
    customerId: 'CUST001',
    customerName: 'João Silva',
    customerEmail: 'joao@example.com',
    items: [
      { productId: 1, productName: 'Laptop', quantity: 1, price: 999.99 },
      { productId: 2, productName: 'Mouse', quantity: 2, price: 29.99 }
    ],
    status: 'pending'
  };

  // ============================================
  // TESTES DO CONSTRUCTOR E CÁLCULOS
  // ============================================
  describe('constructor e calculateTotals', () => {
    // TODO 1: Testar criação com todos os campos
    it('deve criar pedido com todos os campos', () => {
      const order = new Order(validOrderData);

      // COMPLETAR: Verificar campos básicos
      // expect(order.customerId).toBe('CUST001');
      // expect(order.items).toHaveLength(2);
    });

    // TODO 2: Testar cálculo do subtotal
    it('deve calcular subtotal corretamente', () => {
      const order = new Order(validOrderData);

      // subtotal = (1 * 999.99) + (2 * 29.99) = 1059.97
      // COMPLETAR
      // expect(order.subtotal).toBe(1059.97);
    });

    // TODO 3: Testar cálculo do IVA (20%)
    it('deve calcular taxa (IVA 20%) corretamente', () => {
      const order = new Order(validOrderData);

      // tax = 1059.97 * 0.20 = 211.99 (arredondado)
      // COMPLETAR
    });

    // TODO 4: Testar cálculo do total
    it('deve calcular total corretamente', () => {
      const order = new Order(validOrderData);

      // total = subtotal + tax = 1059.97 + 211.99 = 1271.96
      // COMPLETAR
    });

    // TODO 5: Testar com pedido vazio
    it('deve ter totais zero para pedido sem items', () => {
      const order = new Order({
        ...validOrderData,
        items: []
      });

      // COMPLETAR
      // expect(order.subtotal).toBe(0);
    });
  });

  // ============================================
  // TESTES DE VALIDAÇÃO
  // ============================================
  describe('validate', () => {
    // TODO 6: Testar validação com dados válidos
    it('deve retornar array vazio para pedido válido', () => {
      const order = new Order(validOrderData);
      const errors = order.validate();

      // COMPLETAR
    });

    // TODO 7: Testar validação sem customerId
    it('deve retornar erro quando customerId está vazio', () => {
      const order = new Order({
        ...validOrderData,
        customerId: ''
      });

      const errors = order.validate();

      // COMPLETAR: Verificar que existe erro para customerId
      // expect(errors.some(e => e.field === 'customerId')).toBe(true);
    });

    // TODO 8: Testar validação de email inválido
    it('deve retornar erro para email inválido', () => {
      const order = new Order({
        ...validOrderData,
        customerEmail: 'email-invalido'
      });

      // COMPLETAR
    });

    // TODO 9: Testar validação sem items
    it('deve retornar erro quando não há items', () => {
      const order = new Order({
        ...validOrderData,
        items: []
      });

      // COMPLETAR
    });

    // TODO 10: Testar validação de item sem productId
    it('deve retornar erro quando item não tem productId', () => {
      const order = new Order({
        ...validOrderData,
        items: [
          { productName: 'Produto', quantity: 1, price: 10 }
        ]
      });

      // COMPLETAR
    });

    // TODO 11: Testar validação de quantidade inválida
    it('deve retornar erro quando quantidade é zero ou negativa', () => {
      const order = new Order({
        ...validOrderData,
        items: [
          { productId: 1, productName: 'Produto', quantity: 0, price: 10 }
        ]
      });

      // COMPLETAR
    });

    // TODO 12: Testar validação de status inválido
    it('deve retornar erro para status inválido', () => {
      const order = new Order({
        ...validOrderData,
        status: 'invalido'
      });

      // COMPLETAR
    });
  });

  // ============================================
  // TESTES DOS MÉTODOS DE STATUS
  // ============================================
  describe('canBeModified', () => {
    // TODO 13: Testar que pedido pending pode ser modificado
    it('deve retornar true para pedido pending', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });

      // COMPLETAR
      // expect(order.canBeModified()).toBe(true);
    });

    // TODO 14: Testar que pedido processing não pode ser modificado
    it('deve retornar false para pedido processing', () => {
      // COMPLETAR
    });

    // TODO 15: Testar que pedido completed não pode ser modificado
    it('deve retornar false para pedido completed', () => {
      // COMPLETAR
    });
  });

  describe('canBeCancelled', () => {
    // TODO 16: Testar que pedido pending pode ser cancelado
    it('deve retornar true para pedido pending', () => {
      // COMPLETAR
    });

    // TODO 17: Testar que pedido completed não pode ser cancelado
    it('deve retornar false para pedido completed', () => {
      // COMPLETAR
    });
  });

  // ============================================
  // TESTES DOS MÉTODOS DE MANIPULAÇÃO DE ITEMS
  // ============================================
  describe('addItem', () => {
    // TODO 18: Testar adição de novo item
    it('deve adicionar novo item ao pedido', () => {
      const order = new Order(validOrderData);
      const initialLength = order.items.length;

      order.addItem({
        productId: 3,
        productName: 'Teclado',
        quantity: 1,
        price: 79.99
      });

      // COMPLETAR
      // expect(order.items).toHaveLength(initialLength + 1);
    });

    // TODO 19: Testar que adicionar item recalcula totais
    it('deve recalcular totais ao adicionar item', () => {
      const order = new Order(validOrderData);
      const initialSubtotal = order.subtotal;

      order.addItem({
        productId: 3,
        productName: 'Teclado',
        quantity: 1,
        price: 100
      });

      // COMPLETAR
      // expect(order.subtotal).toBe(initialSubtotal + 100);
    });

    // TODO 20: Testar que adicionar item existente aumenta quantidade
    it('deve aumentar quantidade se item já existe', () => {
      const order = new Order(validOrderData);

      // Adicionar mesmo productId que já existe (productId: 1)
      order.addItem({
        productId: 1,
        productName: 'Laptop',
        quantity: 1,
        price: 999.99
      });

      const laptopItem = order.items.find(i => i.productId === 1);

      // COMPLETAR: Quantidade deve ser 2 (1 original + 1 adicionado)
      // expect(laptopItem.quantity).toBe(2);
    });
  });

  describe('removeItem', () => {
    // TODO 21: Testar remoção de item
    it('deve remover item pelo productId', () => {
      const order = new Order(validOrderData);

      const result = order.removeItem(2); // Remover Mouse

      // COMPLETAR
      // expect(result).toBe(true);
      // expect(order.items.find(i => i.productId === 2)).toBeUndefined();
    });

    // TODO 22: Testar remoção de item inexistente
    it('deve retornar false para item inexistente', () => {
      const order = new Order(validOrderData);

      const result = order.removeItem(999);

      // COMPLETAR
    });
  });

  describe('updateItemQuantity', () => {
    // TODO 23: Testar atualização de quantidade
    it('deve atualizar quantidade do item', () => {
      const order = new Order(validOrderData);

      const result = order.updateItemQuantity(1, 5);

      // COMPLETAR
      // expect(result).toBe(true);
      // const item = order.items.find(i => i.productId === 1);
      // expect(item.quantity).toBe(5);
    });

    // TODO 24: Testar que atualização recalcula totais
    it('deve recalcular totais após atualização', () => {
      const order = new Order(validOrderData);

      order.updateItemQuantity(1, 2); // Laptop: 2 * 999.99

      // COMPLETAR: Verificar novo subtotal
    });
  });

  // ============================================
  // TESTES DO isValidEmail
  // ============================================
  describe('isValidEmail', () => {
    // TODO 25: Testar emails válidos
    it('deve retornar true para emails válidos', () => {
      const order = new Order(validOrderData);

      expect(order.isValidEmail('teste@exemplo.com')).toBe(true);
      expect(order.isValidEmail('user.name@domain.pt')).toBe(true);
      // COMPLETAR: Adicionar mais casos
    });

    // TODO 26: Testar emails inválidos
    it('deve retornar false para emails inválidos', () => {
      const order = new Order(validOrderData);

      expect(order.isValidEmail('emailsemarroba')).toBe(false);
      expect(order.isValidEmail('@semlocal.com')).toBe(false);
      // COMPLETAR: Adicionar mais casos
    });
  });
});
```

### Testar

```bash
npm test -- tests/order.test.js
```

### 🤔 Questões para Reflexão

1. Por que o modelo Order é mais complexo de testar?
2. Qual a importância de testar os cálculos automáticos?
3. Como garantir que os métodos de manipulação não quebram a integridade dos dados?

---

## 💻 Exercício 3: TDD - Adicionar Método ao Product

### 🎯 Objetivo
Aplicar TDD para adicionar um novo método `applyDiscount` ao modelo Product.

### Instruções

**PASSO 1 - RED: Adicionar testes ao ficheiro `tests/product.test.js`**

```javascript
// Adicionar ao final do ficheiro tests/product.test.js

  // ============================================
  // TDD: Novo método applyDiscount
  // ============================================
  describe('applyDiscount', () => {
    // TODO 1: Testar desconto percentual
    it('deve aplicar desconto e retornar novo preço', () => {
      const product = new Product({
        name: 'Laptop Pro',
        price: 1000,
        categoryId: 1
      });

      // Aplicar 20% de desconto
      const newPrice = product.applyDiscount(20);

      expect(newPrice).toBe(800);
      // Verificar que o preço original NÃO foi alterado
      expect(product.price).toBe(1000);
    });

    // TODO 2: Testar desconto de 0%
    it('deve retornar preço original para desconto 0%', () => {
      // COMPLETAR
    });

    // TODO 3: Testar desconto de 100%
    it('deve retornar 0 para desconto 100%', () => {
      // COMPLETAR
    });

    // TODO 4: Testar erro para desconto negativo
    it('deve lançar erro para desconto negativo', () => {
      const product = new Product({
        name: 'Produto',
        price: 100,
        categoryId: 1
      });

      expect(() => product.applyDiscount(-10)).toThrow();
    });

    // TODO 5: Testar erro para desconto maior que 100
    it('deve lançar erro para desconto maior que 100', () => {
      // COMPLETAR
    });

    // TODO 6: Testar arredondamento
    it('deve arredondar resultado para 2 casas decimais', () => {
      const product = new Product({
        name: 'Produto',
        price: 99.99,
        categoryId: 1
      });

      // 99.99 - 33% = 66.9933 → 66.99
      const newPrice = product.applyDiscount(33);
      expect(newPrice).toBe(66.99);
    });
  });
```

**Executar testes:** ❌ Devem falhar (método não existe)

```bash
npm test -- tests/product.test.js
```

**PASSO 2 - GREEN: Implementar o método no modelo**

Adicionar ao `src/models/Product.js`:

```javascript
  /**
   * Aplica um desconto ao preço do produto
   * @param {number} percentage - Percentagem de desconto (0-100)
   * @returns {number} - Novo preço com desconto
   * @throws {Error} - Se desconto for inválido
   */
  applyDiscount(percentage) {
    // TODO: Implementar
    // 1. Validar que percentage é número entre 0 e 100
    // 2. Calcular novo preço
    // 3. Arredondar para 2 casas decimais
    // 4. Retornar novo preço (SEM modificar this.price)
  }
```

**PASSO 3 - REFACTOR:** Melhorar se necessário, garantindo que testes passam.

### Testar

```bash
npm test -- tests/product.test.js
```

---

## 💻 Exercício 4: Testes de Integração com Supertest

### 🎯 Objetivo
Criar testes de integração para os endpoints da API.

### Instruções

**Criar ficheiro `tests/integration/api.test.js`:**

```javascript
// tests/integration/api.test.js
// Testes de integração para a API

const request = require('supertest');
const app = require('../../src/app');

describe('API Integration Tests', () => {

  // ============================================
  // HEALTH CHECK
  // ============================================
  describe('GET /health', () => {
    it('deve retornar status 200 e ok', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  // ============================================
  // PRODUCTS API
  // ============================================
  describe('Products API', () => {

    describe('GET /api/v1/products', () => {
      // TODO 1: Testar listagem de produtos
      it('deve retornar lista de produtos com status 200', async () => {
        const response = await request(app)
          .get('/api/v1/products');

        // COMPLETAR
        // expect(response.status).toBe(200);
        // expect(response.body.success).toBe(true);
        // expect(response.body).toHaveProperty('data');
      });

      // TODO 2: Testar paginação
      it('deve retornar paginação na resposta', async () => {
        const response = await request(app)
          .get('/api/v1/products?page=1&limit=5');

        // COMPLETAR
        // expect(response.body).toHaveProperty('pagination');
      });

      // TODO 3: Testar filtro por categoria
      it('deve filtrar produtos por categoryId', async () => {
        const response = await request(app)
          .get('/api/v1/products?categoryId=1');

        // COMPLETAR: Verificar que todos os produtos têm categoryId=1
      });
    });

    describe('GET /api/v1/products/:id', () => {
      // TODO 4: Testar procura por ID válido
      it('deve retornar produto específico', async () => {
        // COMPLETAR
      });

      // TODO 5: Testar 404 para ID inexistente
      it('deve retornar 404 para produto inexistente', async () => {
        const response = await request(app)
          .get('/api/v1/products/99999');

        expect(response.status).toBe(404);
      });
    });

    describe('POST /api/v1/products', () => {
      // TODO 6: Testar criação com dados válidos
      it('deve criar produto e retornar 201', async () => {
        const novoProduto = {
          name: 'Produto de Teste API',
          description: 'Descrição do teste',
          price: 149.99,
          categoryId: 1,
          stock: 10
        };

        const response = await request(app)
          .post('/api/v1/products')
          .send(novoProduto)
          .set('Content-Type', 'application/json');

        // COMPLETAR
        // expect(response.status).toBe(201);
        // expect(response.body.data.name).toBe('Produto de Teste API');
      });

      // TODO 7: Testar 400 para dados inválidos
      it('deve retornar 400 para dados inválidos', async () => {
        const produtoInvalido = {
          name: '',  // nome vazio
          price: -10 // preço negativo
        };

        const response = await request(app)
          .post('/api/v1/products')
          .send(produtoInvalido);

        // COMPLETAR
      });
    });
  });

  // ============================================
  // CATEGORIES API
  // ============================================
  describe('Categories API', () => {

    describe('GET /api/v1/categories', () => {
      // TODO 8: Testar listagem de categorias
      it('deve retornar lista de categorias', async () => {
        // COMPLETAR
      });
    });

    describe('GET /api/v1/categories/:id', () => {
      // TODO 9: Testar procura por ID
      it('deve retornar categoria específica', async () => {
        // COMPLETAR
      });
    });
  });

  // ============================================
  // ORDERS API
  // ============================================
  describe('Orders API', () => {

    describe('GET /api/v1/orders', () => {
      // TODO 10: Testar listagem de pedidos
      it('deve retornar lista de pedidos', async () => {
        // COMPLETAR
      });
    });

    describe('POST /api/v1/orders', () => {
      // TODO 11: Testar criação de pedido
      it('deve criar pedido com dados válidos', async () => {
        const novoPedido = {
          customerId: 'CUST-TEST-001',
          customerName: 'Cliente Teste',
          customerEmail: 'teste@example.com',
          items: [
            { productId: 1, quantity: 1 }
          ]
        };

        const response = await request(app)
          .post('/api/v1/orders')
          .send(novoPedido);

        // COMPLETAR
        // expect(response.status).toBe(201);
        // expect(response.body.data).toHaveProperty('subtotal');
        // expect(response.body.data).toHaveProperty('tax');
        // expect(response.body.data).toHaveProperty('total');
      });
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================
  describe('Error Handling', () => {
    // TODO 12: Testar 404 para endpoint inexistente
    it('deve retornar 404 para endpoint inexistente', async () => {
      const response = await request(app)
        .get('/api/v1/naoexiste');

      expect(response.status).toBe(404);
    });

    // TODO 13: Testar Content-Type
    it('deve retornar Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/v1/products');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
```

### Testar

```bash
# Nota: Estes testes precisam da base de dados PostgreSQL
# Se não tiver BD, alguns testes vão falhar - isso é esperado

npm test -- tests/integration/api.test.js
```

---

## 💻 Exercício 5: Code Coverage

### 🎯 Objetivo
Analisar e melhorar a cobertura de testes.

### Instruções

**1. Gerar relatório de cobertura:**

```bash
npm run test:coverage
```

**2. Analisar o relatório:**

O Jest vai mostrar uma tabela com:
- **Statements** - Linhas de código executadas
- **Branches** - Caminhos de decisão (if/else) testados
- **Functions** - Funções chamadas
- **Lines** - Linhas cobertas

**3. TODO:** Identificar áreas com baixa cobertura e adicionar testes.

**Objetivo:** Atingir pelo menos:
- Statements: 60%
- Branches: 50%
- Functions: 60%
- Lines: 60%

---

## ✅ Checklist de Conclusão

Antes de terminar, confirme que conseguiu:

- [ ] Criar testes para o modelo Category
- [ ] Criar testes para o modelo Order
- [ ] Aplicar TDD para o método applyDiscount
- [ ] Criar testes de integração básicos
- [ ] Gerar relatório de cobertura
- [ ] Todos os testes unitários passam (`npm test -- tests/product.test.js tests/category.test.js tests/order.test.js`)

---

## 🔗 Recursos de Apoio

### Documentação
- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)
- [Jest Matchers](https://jestjs.io/docs/expect)

### Comandos Úteis

```bash
# Executar todos os testes
npm test

# Executar teste específico
npm test -- tests/product.test.js

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com cobertura
npm run test:coverage

# Verbose (mais detalhes)
npm test -- --verbose
```

### Matchers Jest Mais Usados

```javascript
// Igualdade
expect(value).toBe(expected);        // igualdade estrita (===)
expect(value).toEqual(expected);     // igualdade profunda (objetos)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeDefined();

// Números
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(10);

// Strings
expect(string).toMatch(/regex/);
expect(string).toContain('substring');

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objetos
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', value);

// Exceções
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('mensagem');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## 💡 Dicas para o Sucesso

1. **Escrever testes primeiro** - É a essência do TDD
2. **Começar simples** - Testes pequenos e focados
3. **Nomear claramente** - "deve fazer X quando Y"
4. **Isolar testes** - Cada teste deve ser independente
5. **Executar frequentemente** - `npm run test:watch` é seu amigo
6. **Não ter medo de refatorar** - Testes dão confiança!

**Boa sorte!** 🚀

---

**Última atualização:** Novembro 2025
**Versão:** v1.0
**Projeto Base:** aula_6/webservice
