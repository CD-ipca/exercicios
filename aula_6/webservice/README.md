# Web Service API Template

Template de API RESTful para aulas de Computação Distribuída (IPCA), com foco em arquitetura modular e boas práticas de desenvolvimento.

## 📂 Estrutura do Projeto

```
webservice-api/
├── src/                    # Código fonte
│   ├── config/             # Configurações da aplicação
│   ├── controllers/        # Controladores para requisições HTTP
│   ├── middleware/         # Middleware Express
│   ├── models/             # Modelos de dados
│   ├── routes/             # Definição de rotas
│   ├── services/           # Lógica de negócios
│   ├── utils/              # Utilitários e helpers
│   ├── app.js              # Configuração e inicialização do Express
│   └── server.js           # Ponto de entrada da aplicação
├── tests/                  # Testes automatizados
├── docs/                   # Documentação
├── .env                    # Variáveis de ambiente (não versionadas)
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── Dockerfile              # Configuração para Docker
├── docker-compose.yml      # Configuração multi-container
├── package.json            # Dependências e scripts
└── README.md               # Documentação do projeto
```

## 🚀 Funcionalidades

- API RESTful completa seguindo as melhores práticas
- Arquitetura em camadas (controllers, services, models)
- Tratamento centralizado de erros
- Logging estruturado
- Verificações de health check
- Containerização com Docker
- Configuração de ambiente via dotenv
- Pronto para implantação em produção

## ⚙️ Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Docker e Docker Compose (opcional, para containerização)

## 🛠️ Instalação

### Desenvolvimento Local

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd webservice-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Crie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

4. Execute a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

### Usando Docker

1. Construa e inicie os containers:
   ```bash
   docker-compose up -d
   ```

2. Verifique se os containers estão à escuta:
   ```bash
   docker-compose ps
   ```

## 🔍 Uso da API

A API estará disponível em `http://localhost:3000` por padrão.

### Endpoints

#### Produtos

- `GET /api/v1/products` - Listar todos os produtos
- `GET /api/v1/products/:id` - Obter um produto específico
- `POST /api/v1/products` - Criar um novo produto
- `PUT /api/v1/products/:id` - Atualizar um produto existente
- `DELETE /api/v1/products/:id` - Excluir um produto

#### Categorias

- `GET /api/v1/categories` - Listar todas as categorias
- `GET /api/v1/categories/:id` - Obter uma categoria específica
- `POST /api/v1/categories` - Criar uma nova categoria
- `PUT /api/v1/categories/:id` - Atualizar uma categoria existente
- `DELETE /api/v1/categories/:id` - Excluir uma categoria

#### Health Check

- `GET /api/health` - Verificação básica de saúde da API
- `GET /api/health/details` - Verificação detalhada com métricas do sistema

### Exemplos de Uso

```bash
# Listar todos os produtos
curl http://localhost:3000/api/v1/products

# Criar um novo produto
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Produto","price":99.99,"categoryId":1,"stock":10}'

# Atualizar um produto
curl -X PUT http://localhost:3000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":89.99,"stock":20}'

# Excluir um produto
curl -X DELETE http://localhost:3000/api/v1/products/1
```

## 🧪 Testes

Execute os testes automatizados:

```bash
npm test
# ou
yarn test
```

## 📊 Monitorização

Verifique a saúde da aplicação:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/details
```

## 🔄 CI/CD

Para implementar integração e entrega contínuas:

1. Configure seu pipeline CI/CD (.gitlab-ci.yml ou .github/workflows)
2. Adicione etapas para:
   - Lint
   - Testes
   - Build
   - Deploy

## 📚 Documentação Adicional

- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Docker](https://docs.docker.com/)

## 🌟 Recursos Futuros

- Autenticação e autorização (JWT)
- Validação de dados com Joi/express-validator
- Integração com base de dados (PostgreSQL, MongoDB)
- Swagger/OpenAPI para documentação interativa
- Cache com Redis
- Testes de integração e e2e
- Monitorização avançada
