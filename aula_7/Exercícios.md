# Aula 7 - Desenvolvimento com Express.js
## Exercícios Práticos

**Disciplina:** Computação Distribuída  
**Professor:** Filipe Gomes Manso  
**IPCA** - Instituto Politécnico do Cávado e do Ave

---

## 🎯 Objetivos dos Exercícios

Nesta aula prática, vão:
- Consolidar conhecimentos de **JavaScript moderno** (async/await, array methods, classes)
- Implementar um **sistema de pedidos (Orders)** completo
- Praticar **arquitetura modular** (MVC pattern)
- Trabalhar com **relacionamentos entre entidades**
- Implementar **lógica de negócio real** (stock management, validações)
- Preparar a base para **sistemas distribuídos** (próximas aulas)

---

## 📚 Contexto

Vão continuar o desenvolvimento do **webservice de e-commerce** iniciado na Aula 6.

**Estado Atual do Projeto:**
- ✅ Produtos (ligados à base de dados)
- ✅ Categorias (ligados à base de dados)
- ✅ Estrutura modular (Controllers, Services, Models, Routes)

**Hoje vão adicionar:**
- 🆕 **Orders (Pedidos)** - Sistema completo de gestão de encomendas
- 🆕 **Order Items** - Relacionamento entre pedidos e produtos
- 🆕 **Stock Management** - Controlo de inventário
- 🆕 **Business Logic** - Validações e cálculos automáticos

---

## 🛠️ Preparação Inicial

### 1. Verificar Estrutura do Projeto

O vosso projeto deve ter esta estrutura:

```
webservice/
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── categoryController.js
│   ├── services/
│   │   ├── productService.js
│   │   └── categoryService.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── server.js
├── package.json
└── .env
```

### 2. Certificar que o Servidor está Funcional

```bash
cd webservice
npm install
npm run dev
```

Testar endpoints existentes:
```bash
# Testar produtos
curl http://localhost:3000/api/v1/products

# Testar categorias
curl http://localhost:3000/api/v1/categories
```

**✅ Checkpoint:** Servidor deve estar a funcionar antes de prosseguir.

---

## 💻 Exercício 1: Orders - Sistema de Pedidos (CRUD Básico)

### 📋 Objetivo

Implementar um sistema completo de gestão de pedidos (orders) seguindo o mesmo padrão arquitetural usado em Products e Categories.

### 🎯 Conceitos JavaScript a Praticar

- Classes e métodos
- Array methods: `map()`, `filter()`, `find()`, `reduce()`
- Async/await
- Destructuring
- Spread operator
- Date handling

---

### 📊 Estrutura de Dados - Order

Um pedido (order) tem a seguinte estrutura:

```javascript
{
  id: 1,
  customerId: "CUST001",
  customerName: "João Silva",
  customerEmail: "joao@example.com",
  items: [
    {
      productId: 1,
      productName: "Laptop Dell XPS 13",
      quantity: 1,
      price: 999.99
    },
    {
      productId: 5,
      productName: "Mouse Logitech MX",
      quantity: 2,
      price: 49.99
    }
  ],
  subtotal: 1099.97,
  tax: 219.99,      // 20% do subtotal
  total: 1319.96,   // subtotal + tax
  status: "pending", // pending | processing | completed | cancelled
  createdAt: "2024-11-19T10:30:00Z",
  updatedAt: "2024-11-19T10:30:00Z"
}
```

---

### 📝 Tarefas

#### Passo 1: Criar o Model (Order.js)

**Ficheiro:** `src/models/Order.js`

**O que implementar:**

1. **Classe Order** com:
   - Constructor que recebe dados do pedido
   - Método `validate()` - valida campos obrigatórios
   - Método `calculateTotals()` - calcula subtotal, tax e total
   - Método `toJSON()` - retorna representação JSON

2. **Validações:**
   - `customerId` é obrigatório
   - `customerName` é obrigatório (mínimo 3 caracteres)
   - `customerEmail` deve ser email válido
   - `items` deve ser array não vazio
   - Cada item deve ter: productId, productName, quantity (>0), price (>0)

3. **Cálculos:**
   - `subtotal` = soma de (quantity × price) de todos os items
   - `tax` = 20% do subtotal
   - `total` = subtotal + tax

**Dicas:**
```javascript
class Order {
  constructor(data) {
    this.id = data.id;
    this.customerId = data.customerId;
    // ... completar
    
    // Calcular totais automaticamente
    this.calculateTotals();
    
    // Timestamps
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  validate() {
    const errors = [];
    
    // TODO: Implementar validações
    // Exemplo:
    // if (!this.customerId) {
    //   errors.push({ field: 'customerId', message: 'Customer ID é obrigatório' });
    // }
    
    return errors;
  }
  
  calculateTotals() {
    // TODO: Usar reduce() para calcular subtotal
    // this.subtotal = this.items.reduce(...)
    
    // TODO: Calcular tax (20%)
    // this.tax = ...
    
    // TODO: Calcular total
    // this.total = ...
  }
  
  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      // ... completar
    };
  }
}

module.exports = Order;
```

---

#### Passo 2: Criar o Service (orderService.js)

**Ficheiro:** `src/services/orderService.js`

**O que implementar:**

Base de dados em memória (por agora) e métodos CRUD:

```javascript
const Order = require('../models/Order');

// Simulação de BD em memória
let orders = [];
let nextId = 1;

const orderService = {
  // TODO: Implementar getAllOrders(filters)
  // - Retornar todos os pedidos
  // - Suportar filtro por status: ?status=pending
  // - Suportar filtro por customerId: ?customerId=CUST001
  async getAllOrders(filters = {}) {
    // Dica: usar filter() se houver filtros
  },
  
  // TODO: Implementar getOrderById(id)
  // - Retornar pedido específico
  // - Lançar erro se não encontrado
  async getOrderById(id) {
    // Dica: usar find()
  },
  
  // TODO: Implementar createOrder(orderData)
  // - Criar nova instância de Order
  // - Validar (usar order.validate())
  // - Adicionar ao array
  // - Retornar order criado
  async createOrder(orderData) {
    // Dica: 
    // 1. const order = new Order({ id: nextId++, ...orderData });
    // 2. const errors = order.validate();
    // 3. if (errors.length > 0) throw new Error(...)
    // 4. orders.push(order);
    // 5. return order;
  },
  
  // TODO: Implementar updateOrderStatus(id, newStatus)
  // - Atualizar apenas o status
  // - Validar status válido: pending, processing, completed, cancelled
  // - Atualizar updatedAt
  async updateOrderStatus(id, newStatus) {
    // Dica: 
    // 1. Encontrar order
    // 2. Validar newStatus
    // 3. Atualizar status e updatedAt
  },
  
  // TODO: Implementar deleteOrder(id)
  // - Remover pedido (apenas se status = pending)
  // - Retornar true/false
  async deleteOrder(id) {
    // Dica: só permitir delete se status === 'pending'
  },
  
  // TODO: Implementar getOrderStats()
  // - Retornar estatísticas: total de orders, por status, valor total
  async getOrderStats() {
    // Dica: usar reduce() para calcular totais
    // return {
    //   totalOrders: orders.length,
    //   byStatus: { pending: X, processing: Y, ... },
    //   totalRevenue: sum of all completed orders
    // }
  }
};

module.exports = orderService;
```

---

#### Passo 3: Criar o Controller (orderController.js)

**Ficheiro:** `src/controllers/orderController.js`

**O que implementar:**

Handlers para as rotas HTTP:

```javascript
const orderService = require('../services/orderService');

const orderController = {
  // TODO: GET /api/v1/orders
  async getAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        customerId: req.query.customerId
      };
      
      const orders = await orderService.getAllOrders(filters);
      
      res.json({
        success: true,
        data: orders,
        meta: {
          total: orders.length
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  // TODO: GET /api/v1/orders/:id
  async getById(req, res, next) {
    // Implementar
  },
  
  // TODO: POST /api/v1/orders
  async create(req, res, next) {
    // Dica: retornar status 201
  },
  
  // TODO: PATCH /api/v1/orders/:id/status
  async updateStatus(req, res, next) {
    // Implementar
  },
  
  // TODO: DELETE /api/v1/orders/:id
  async delete(req, res, next) {
    // Implementar
  },
  
  // TODO: GET /api/v1/orders/stats
  async getStats(req, res, next) {
    // Implementar
  }
};

module.exports = orderController;
```

---

#### Passo 4: Criar as Routes (orderRoutes.js)

**Ficheiro:** `src/routes/orderRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// TODO: Definir rotas
// GET    /              - Lista todos os pedidos
// GET    /stats         - Estatísticas (IMPORTANTE: antes de /:id)
// GET    /:id           - Obter pedido específico
// POST   /              - Criar novo pedido
// PATCH  /:id/status    - Atualizar status
// DELETE /:id           - Remover pedido

// Exemplo:
// router.get('/', orderController.getAll);

module.exports = router;
```

**⚠️ IMPORTANTE:** A rota `/stats` deve vir **antes** de `/:id`, senão "stats" será interpretado como um ID!

---

#### Passo 5: Registar Routes na app.js

**Ficheiro:** `src/app.js`

Adicionar:

```javascript
const orderRoutes = require('./routes/orderRoutes');

// ... outras rotas ...

app.use('/api/v1/orders', orderRoutes);
```

---

### 🧪 Testes

Testar todos os endpoints com curl ou Postman:

```bash
# 1. Criar pedido
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "customerName": "João Silva",
    "customerEmail": "joao@example.com",
    "items": [
      {
        "productId": 1,
        "productName": "Laptop Dell",
        "quantity": 1,
        "price": 999.99
      }
    ]
  }'

# 2. Listar todos os pedidos
curl http://localhost:3000/api/v1/orders

# 3. Obter pedido específico
curl http://localhost:3000/api/v1/orders/1

# 4. Filtrar por status
curl http://localhost:3000/api/v1/orders?status=pending

# 5. Atualizar status
curl -X PATCH http://localhost:3000/api/v1/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'

# 6. Estatísticas
curl http://localhost:3000/api/v1/orders/stats

# 7. Tentar remover (deve falhar se não for pending)
curl -X DELETE http://localhost:3000/api/v1/orders/1
```

---

### ✅ Critérios de Sucesso - Exercício 1

- [ ] Model Order com validações funcionais
- [ ] Cálculo automático de totais (subtotal, tax, total)
- [ ] Todos os endpoints CRUD funcionam
- [ ] Filtros por status e customerId funcionam
- [ ] Endpoint de estatísticas retorna dados corretos
- [ ] Validações retornam erros apropriados
- [ ] Status codes HTTP corretos (200, 201, 400, 404)

---

## 💻 Exercício 2: Order Items - Gestão de Items do Pedido

### 📋 Objetivo

Adicionar funcionalidades para gerir os items de um pedido existente e validar a existência de produtos através do ProductService.

### 🎯 Conceitos a Praticar

- Comunicação entre Services (OrderService ↔ ProductService)
- Nested routes (`/orders/:id/items`)
- Validações complexas
- Error handling robusto
- Operações em arrays (add, remove, update)

---

### 📝 Tarefas

#### Passo 1: Adicionar Métodos ao orderService.js

Adicionar ao `orderService`:

```javascript
const productService = require('./productService');

// Dentro de orderService:

// TODO: Adicionar item a um pedido existente
async addItemToOrder(orderId, itemData) {
  // 1. Encontrar o pedido
  // 2. Validar que o pedido existe
  // 3. Validar que status é 'pending' (só pode adicionar se pending)
  // 4. IMPORTANTE: Verificar se produto existe no ProductService
  //    const product = await productService.getProductById(itemData.productId);
  // 5. Criar objeto item com dados do produto
  // 6. Verificar se item já existe no pedido (mesmo productId)
  //    - Se existe: aumentar quantity
  //    - Se não existe: adicionar novo item
  // 7. Recalcular totais: order.calculateTotals()
  // 8. Atualizar updatedAt
  // 9. Retornar order atualizado
},

// TODO: Remover item de um pedido
async removeItemFromOrder(orderId, productId) {
  // 1. Encontrar o pedido
  // 2. Validar que status é 'pending'
  // 3. Remover item do array (usar filter)
  // 4. Recalcular totais
  // 5. Atualizar updatedAt
},

// TODO: Atualizar quantity de um item
async updateItemQuantity(orderId, productId, newQuantity) {
  // 1. Validar newQuantity > 0
  // 2. Encontrar pedido e item
  // 3. Atualizar quantity
  // 4. Recalcular totais
},

// TODO: Obter items de um pedido
async getOrderItems(orderId) {
  // Retornar apenas o array de items
}
```

**Dica importante:** Para validar produtos, vão precisar importar e usar o `productService`:

```javascript
const productService = require('./productService');

// Num método async:
try {
  const product = await productService.getProductById(itemData.productId);
  
  if (!product) {
    throw new Error(`Produto ${itemData.productId} não encontrado`);
  }
  
  // Usar dados do produto
  const item = {
    productId: product.id,
    productName: product.name,
    quantity: itemData.quantity,
    price: product.price
  };
  
} catch (error) {
  // Tratar erro
}
```

---

#### Passo 2: Adicionar Controller Methods

**Ficheiro:** `src/controllers/orderController.js`

Adicionar:

```javascript
// TODO: POST /api/v1/orders/:id/items
async addItem(req, res, next) {
  try {
    const orderId = parseInt(req.params.id);
    const itemData = req.body;
    
    // Validar dados do item
    if (!itemData.productId || !itemData.quantity) {
      return res.status(400).json({
        success: false,
        error: 'productId e quantity são obrigatórios'
      });
    }
    
    const order = await orderService.addItemToOrder(orderId, itemData);
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
},

// TODO: DELETE /api/v1/orders/:id/items/:productId
async removeItem(req, res, next) {
  // Implementar
},

// TODO: PATCH /api/v1/orders/:id/items/:productId
async updateItemQuantity(req, res, next) {
  // Implementar
},

// TODO: GET /api/v1/orders/:id/items
async getItems(req, res, next) {
  // Implementar
}
```

---

#### Passo 3: Adicionar Nested Routes

**Ficheiro:** `src/routes/orderRoutes.js`

Adicionar:

```javascript
// Rotas para gestão de items
router.get('/:id/items', orderController.getItems);
router.post('/:id/items', orderController.addItem);
router.patch('/:id/items/:productId', orderController.updateItemQuantity);
router.delete('/:id/items/:productId', orderController.removeItem);
```

---

### 🧪 Testes

```bash
# 1. Criar um pedido vazio primeiro
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST002",
    "customerName": "Maria Santos",
    "customerEmail": "maria@example.com",
    "items": []
  }'

# 2. Adicionar item ao pedido (assumindo orderId = 1)
curl -X POST http://localhost:3000/api/v1/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'

# 3. Adicionar outro item
curl -X POST http://localhost:3000/api/v1/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 3,
    "quantity": 1
  }'

# 4. Ver items do pedido
curl http://localhost:3000/api/v1/orders/1/items

# 5. Atualizar quantity
curl -X PATCH http://localhost:3000/api/v1/orders/1/items/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'

# 6. Remover item
curl -X DELETE http://localhost:3000/api/v1/orders/1/items/3

# 7. Verificar pedido completo
curl http://localhost:3000/api/v1/orders/1

# 8. Testar erro: adicionar produto inexistente
curl -X POST http://localhost:3000/api/v1/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 9999,
    "quantity": 1
  }'
# Deve retornar erro 404 ou 400
```

---

### ✅ Critérios de Sucesso - Exercício 2

- [ ] Adicionar item valida existência do produto
- [ ] Não permite adicionar item se produto não existe
- [ ] Não permite modificar pedido se status não é 'pending'
- [ ] Ao adicionar item duplicado, aumenta quantity (não duplica)
- [ ] Remover item funciona corretamente
- [ ] Atualizar quantity funciona
- [ ] Totais são recalculados automaticamente
- [ ] Erros retornam mensagens claras

---

## 💻 Exercício 3: Stock Management - Gestão de Inventário

### 📋 Objetivo

Implementar lógica de negócio real: controlar stock dos produtos ao criar e cancelar pedidos.

### 🎯 Conceitos a Praticar

- Transações complexas (simular)
- Validações de negócio
- Rollback de operações
- Error handling avançado
- Estado consistente

---

### 📝 Tarefas

#### Passo 1: Adicionar Stock ao Product Model

**Ficheiro:** `src/models/Product.js`

Garantir que o modelo Product tem o campo `stock`:

```javascript
class Product {
  constructor(data) {
    // ...
    this.stock = data.stock || 0;
  }
  
  validate() {
    // ...
    // Adicionar validação:
    if (this.stock !== undefined && (!Number.isInteger(this.stock) || this.stock < 0)) {
      errors.push({ field: 'stock', message: 'Stock deve ser número inteiro não-negativo' });
    }
  }
}
```

---

#### Passo 2: Adicionar Métodos ao productService.js

**Ficheiro:** `src/services/productService.js`

Adicionar:

```javascript
// TODO: Atualizar stock de um produto
async updateStock(productId, quantityChange) {
  // quantityChange pode ser positivo (adicionar) ou negativo (remover)
  // 1. Encontrar produto
  // 2. Calcular novo stock: product.stock + quantityChange
  // 3. Validar que novo stock >= 0
  // 4. Atualizar stock
  // 5. Atualizar updatedAt
  // 6. Retornar produto atualizado
},

// TODO: Verificar disponibilidade de stock
async checkStockAvailability(productId, quantity) {
  // Retornar true/false
  // const product = await this.getProductById(productId);
  // return product && product.stock >= quantity;
}
```

---

#### Passo 3: Modificar orderService - Processo de Pedido

**Ficheiro:** `src/services/orderService.js`

Modificar o método `createOrder` para verificar e reduzir stock:

```javascript
async createOrder(orderData) {
  // 1. Criar order
  const order = new Order({
    id: nextId++,
    ...orderData,
    status: 'pending'
  });
  
  // 2. Validar order
  const errors = order.validate();
  if (errors.length > 0) {
    throw new Error(`Validação falhou: ${JSON.stringify(errors)}`);
  }
  
  // 3. Validar e enriquecer items com dados dos produtos
  const enrichedItems = [];
  
  for (const item of order.items) {
    // Buscar produto
    const product = await productService.getProductById(item.productId);
    
    if (!product) {
      throw new Error(`Produto ${item.productId} não encontrado`);
    }
    
    // Verificar stock
    if (product.stock < item.quantity) {
      throw new Error(
        `Stock insuficiente para ${product.name}. ` +
        `Disponível: ${product.stock}, Solicitado: ${item.quantity}`
      );
    }
    
    // Adicionar item enriquecido
    enrichedItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price
    });
  }
  
  // Atualizar items com dados enriquecidos
  order.items = enrichedItems;
  order.calculateTotals();
  
  // 4. IMPORTANTE: Reduzir stock de cada produto
  // TODO: Implementar redução de stock
  // for (const item of order.items) {
  //   await productService.updateStock(item.productId, -item.quantity);
  // }
  
  // 5. Adicionar order ao array
  orders.push(order);
  
  return order;
}
```

---

#### Passo 4: Adicionar Método para Processar Pedido

Adicionar novo método ao `orderService`:

```javascript
// TODO: Processar pedido (mudar status de pending para processing)
async processOrder(orderId) {
  // 1. Encontrar order
  // 2. Validar que status é 'pending'
  // 3. Verificar novamente stock de todos os produtos
  //    (pode ter mudado desde a criação do pedido)
  // 4. Reduzir stock (se ainda não foi feito no create)
  // 5. Atualizar status para 'processing'
  // 6. Retornar order
},

// TODO: Completar pedido
async completeOrder(orderId) {
  // Mudar status de 'processing' para 'completed'
},

// TODO: Cancelar pedido
async cancelOrder(orderId) {
  // 1. Encontrar order
  // 2. Validar que status não é 'completed'
  // 3. IMPORTANTE: Devolver stock aos produtos!
  //    for (const item of order.items) {
  //      await productService.updateStock(item.productId, +item.quantity);
  //    }
  // 4. Atualizar status para 'cancelled'
}
```

---

#### Passo 5: Adicionar Endpoints no Controller

**Ficheiro:** `src/controllers/orderController.js`

```javascript
// TODO: POST /api/v1/orders/:id/process
async processOrder(req, res, next) {
  // Chamar orderService.processOrder
},

// TODO: POST /api/v1/orders/:id/complete
async completeOrder(req, res, next) {
  // Chamar orderService.completeOrder
},

// TODO: POST /api/v1/orders/:id/cancel
async cancelOrder(req, res, next) {
  // Chamar orderService.cancelOrder
}
```

---

#### Passo 6: Adicionar Routes

**Ficheiro:** `src/routes/orderRoutes.js`

```javascript
// Rotas de workflow do pedido
router.post('/:id/process', orderController.processOrder);
router.post('/:id/complete', orderController.completeOrder);
router.post('/:id/cancel', orderController.cancelOrder);
```

---

### 🧪 Testes - Fluxo Completo

```bash
# 1. Criar alguns produtos com stock
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse Gamer",
    "description": "RGB 16000 DPI",
    "price": 49.99,
    "categoryId": 1,
    "stock": 10
  }'

# 2. Verificar stock inicial
curl http://localhost:3000/api/v1/products/1

# 3. Criar pedido (deve reduzir stock automaticamente)
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST003",
    "customerName": "Pedro Costa",
    "customerEmail": "pedro@example.com",
    "items": [
      {
        "productId": 1,
        "quantity": 3
      }
    ]
  }'

# 4. Verificar que stock foi reduzido
curl http://localhost:3000/api/v1/products/1
# Stock deve estar em 7 agora

# 5. Tentar criar pedido com stock insuficiente
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST004",
    "customerName": "Ana Silva",
    "customerEmail": "ana@example.com",
    "items": [
      {
        "productId": 1,
        "quantity": 20
      }
    ]
  }'
# Deve retornar erro: Stock insuficiente

# 6. Processar pedido
curl -X POST http://localhost:3000/api/v1/orders/1/process

# 7. Completar pedido
curl -X POST http://localhost:3000/api/v1/orders/1/complete

# 8. Criar outro pedido e cancelar
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST005",
    "customerName": "Carlos Mendes",
    "customerEmail": "carlos@example.com",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'

# 9. Verificar stock (deve ter reduzido mais 2)
curl http://localhost:3000/api/v1/products/1

# 10. Cancelar o pedido (deve devolver stock)
curl -X POST http://localhost:3000/api/v1/orders/2/cancel

# 11. Verificar stock novamente (deve ter voltado)
curl http://localhost:3000/api/v1/products/1
```

---

### ✅ Critérios de Sucesso - Exercício 3

- [ ] Ao criar pedido, stock é automaticamente reduzido
- [ ] Não permite criar pedido se stock insuficiente
- [ ] Mensagem de erro clara indica produto e stock disponível
- [ ] Ao cancelar pedido, stock é devolvido aos produtos
- [ ] Não permite cancelar pedido já completado
- [ ] Workflow de status funciona: pending → processing → completed
- [ ] Stock nunca fica negativo
- [ ] Múltiplos items no pedido todos reduzem stock corretamente

---

## 🎓 Conceitos Importantes

### 1. Array Methods em JavaScript

Métodos que vão usar muito nestes exercícios:

```javascript
// filter() - filtrar elementos
const pendingOrders = orders.filter(o => o.status === 'pending');

// find() - encontrar elemento
const order = orders.find(o => o.id === orderId);

// map() - transformar array
const orderIds = orders.map(o => o.id);

// reduce() - reduzir a um valor
const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// some() - verificar se algum elemento satisfaz condição
const hasLowStock = products.some(p => p.stock < 5);

// every() - verificar se todos os elementos satisfazem condição
const allInStock = items.every(item => item.stock > 0);
```

---

### 2. Async/Await e Error Handling

```javascript
// Padrão correto
async function createOrder(orderData) {
  try {
    // Operações assíncronas
    const product = await productService.getById(1);
    const order = await orderService.create(orderData);
    return order;
  } catch (error) {
    // Tratar erro ou re-lançar
    console.error('Erro ao criar pedido:', error);
    throw error; // Re-lançar para controller tratar
  }
}

// No controller
async create(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error); // Passar para error handler middleware
  }
}
```

---

### 3. Validações Robustas

```javascript
// Validar email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validar quantidade
function isValidQuantity(quantity) {
  return Number.isInteger(quantity) && quantity > 0;
}

// Validar status
function isValidStatus(status) {
  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
  return validStatuses.includes(status);
}
```

---

### 4. Comunicação entre Services

**IMPORTANTE para próximas aulas (microserviços):**

Neste exercício, chamam services diretamente:
```javascript
const product = await productService.getById(productId);
```

**Nas próximas aulas**, isto vai mudar para chamadas HTTP entre serviços separados:
```javascript
const response = await fetch(`http://product-service:3001/products/${productId}`);
const product = await response.json();
```

A arquitetura que estão a construir já prepara para esta separação!

---

## 🤔 Questões para Reflexão

Ao terminar os exercícios, reflitam sobre:

1. **Consistência de Dados:**
   - O que acontece se o servidor crashar a meio de criar um pedido?
   - Como garantir que stock e orders ficam consistentes?

2. **Performance:**
   - E se tivessem 1000 produtos num pedido?
   - Fazer 1000 chamadas ao ProductService é eficiente?

3. **Concorrência:**
   - E se 2 clientes tentarem comprar o último produto ao mesmo tempo?
   - Como prevenir "over-selling"?

4. **Escalabilidade:**
   - E se ProductService estiver em outro servidor?
   - E se precisarem de múltiplas instâncias do OrderService?

---

## 📊 Diagrama de Arquitetura Atual

```
┌─────────────────────────────────────────┐
│           Express Application            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Products │  │  Orders  │            │
│  │  Routes  │  │  Routes  │            │
│  └────┬─────┘  └────┬─────┘            │
│       │             │                   │
│  ┌────▼─────┐  ┌────▼─────┐           │
│  │ Product  │  │  Order   │           │
│  │Controller│  │Controller│           │
│  └────┬─────┘  └────┬─────┘           │
│       │             │                   │
│  ┌────▼─────┐  ┌────▼─────┐           │
│  │ Product  │◄─┤  Order   │           │
│  │ Service  │  │ Service  │           │
│  └────┬─────┘  └────┬─────┘           │
│       │             │                   │
│  ┌────▼─────┐  ┌────▼─────┐           │
│  │ Product  │  │  Order   │           │
│  │  Model   │  │  Model   │           │
│  └──────────┘  └──────────┘           │
└─────────────────────────────────────────┘
```

**Próxima evolução:**
```
┌──────────────┐         ┌──────────────┐
│   Product    │ ◄─HTTP──┤    Order     │
│   Service    │         │   Service    │
│  (Port 3001) │         │  (Port 3002) │
└──────────────┘         └──────────────┘
      │                          │
      ▼                          ▼
  PostgreSQL              PostgreSQL
   (Products)              (Orders)
```

---

## 🔗 Recursos Adicionais

### Documentação
- **Express.js:** https://expressjs.com/
- **JavaScript Array Methods:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- **Async/Await:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

### Ferramentas de Teste
- **Postman:** https://www.postman.com/
- **curl:** Já instalado
- **Thunder Client:** Extension para VS Code (alternativa ao Postman)

### Para Aprofundar
- **RESTful API Design:** https://restfulapi.net/
- **HTTP Status Codes:** https://httpstatuses.com/
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices

---

## 💡 Dicas para o Sucesso

1. **Façam commit frequentes no Git**
   ```bash
   git add .
   git commit -m "feat: implementar CRUD de orders"
   ```
   Comandos e flow de mais comum uso no git:
   
    ```bash
   git stash save # guarda tudo em “memoria”
   git checkout <branch master or main> # e fazes git pull para atualizar a tua versão
   git checkout -b 'nome_do_teu_branch' # o nome se não definido pode qualquer coisa como reboot-ui-fix-multistring
   git stash pop # repõe as tuas alterações
   git status # para ver o que alteraste e “
   git add <path-to-ficheiro> # para adicionar as alterações ao commit e futuro push
   git commit -m 'mensagem com o que fizeste: p.ex: fix multistring input'
   git push origin NOME_DO_TEU_BRANCH 
    ```

2. **Testem cada método individualmente** antes de avançar

3. **Usem console.log() para debug**
   ```javascript
   console.log('Order:', JSON.stringify(order, null, 2));
   ```

4. **Leiam as mensagens de erro** - são informativas!

5. **Comparem com Products/Categories** - o padrão é o mesmo

6. **Trabalhem em par** - programação em par é recomendada

7. **Peçam ajuda** - não fiquem bloqueados mais de 15-20 minutos

---

## ❓ Onde Tirar Dúvidas

- **Email:** fmanso@ipca.pt
- **Fórum da disciplina** no Moodle
- **Durante a aula prática**

---

**Bom trabalho! 🚀**

**Última atualização:** Novembro 2025  
**Versão:** v1.0
**Instituição:** IPCA
