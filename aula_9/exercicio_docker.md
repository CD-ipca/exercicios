# Exercício Prático - Aula 9: Docker

## Separar o Serviço de Orders para um Container Independente

**Objetivo:** Extrair a funcionalidade de Orders do webservice monolítico e transformá-la num microserviço Docker independente.

---

## Contexto

Atualmente, o webservice tem tudo junto (monolith):
```
webservice-api (porta 3000)
├── Products
├── Categories
└── Orders        ← Vamos extrair isto!
```

**Objetivo final:**
```
┌─────────────────────┐     ┌─────────────────────┐
│  webservice-api     │     │  order-service      │
│  (porta 3000)       │     │  (porta 3001)       │
│  ├── Products       │     │  └── Orders         │
│  └── Categories     │     │                     │
└─────────────────────┘     └─────────────────────┘
         │                           │
         └───────────┬───────────────┘
                     │
              ┌──────┴──────┐
              │  PostgreSQL │
              │  (porta 5432)│
              └─────────────┘
```

---

## Parte 1: Análise do Projeto Existente

Antes de começar, analisa o projeto `aula_6/webservice`:

1. **Estrutura de pastas** - Como está organizado?
2. **Ficheiros relacionados com Orders** - Quais são e onde estão?
3. **Dependências** - O que é preciso no `package.json`?
4. **Dockerfile existente** - Como está configurado?
5. **docker-compose.yml** - Como está a orquestração atual?

**Dica:** Os ficheiros que vais precisar copiar/adaptar estão em:
- `src/models/`
- `src/controllers/`
- `src/routes/`
- `src/services/`
- `src/config/`

---

## Parte 2: Criar o Order-Service

### 2.1 Estrutura a criar

```
aula_9/
├── order-service/
│   ├── src/
│   │   └── (estrutura semelhante ao webservice)
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env
└── docker-compose.yml
```

### 2.2 Tarefas

1. **Inicializar o projeto Node.js** para o order-service
2. **Copiar os ficheiros** relacionados com Orders do webservice original
3. **Adaptar as dependências** - remover o que não é necessário
4. **Criar app.js e server.js** simplificados para o microserviço
5. **Resolver imports/requires** - alguns paths vão ter de mudar

### 2.3 Desafios a resolver

- O `orderService.js` original tem dependências do `productService` - como resolver?
- A configuração da base de dados precisa de ser copiada
- O `DB_HOST` no container será `db` (nome do serviço), não `localhost`

---

## Parte 3: Dockerfile

Criar um `Dockerfile` para o order-service.

**Requisitos:**
- Base image: `node:18-alpine`
- Porta: `3001`
- Usar utilizador não-root (segurança)
- Otimizar para cache de layers

**Referência:** Ver o Dockerfile existente em `aula_6/webservice/`

---

## Parte 4: Docker Compose

Criar um `docker-compose.yml` na pasta `aula_9/` que orquestre:

| Serviço | Build/Image | Porta |
|---------|-------------|-------|
| api | `../aula_6/webservice` | 3000 |
| order-service | `./order-service` | 3001 |
| db | `postgres:14-alpine` | 5432 |

**Requisitos:**
- Todos os serviços na mesma network
- Base de dados com volume para persistência
- Variáveis de ambiente para configurar DB_HOST

**Referência:** Ver o docker-compose.yml existente em `aula_6/webservice/`

---

## Parte 5: Testar

### Comandos úteis

```bash
# Build e arranque
docker compose up --build

# Ver containers
docker compose ps

# Ver logs
docker compose logs -f order-service

# Aceder ao container
docker compose exec order-service sh
```

### Endpoints a testar

| Serviço | URL |
|---------|-----|
| API Health | `http://localhost:3000/health` |
| Order Health | `http://localhost:3001/health` |
| Listar Orders | `http://localhost:3001/api/v1/orders` |

---

## Checklist de Conclusão

- [ ] Order-service arranca sem erros
- [ ] Health check responde em `localhost:3001/health`
- [ ] GET `/api/v1/orders` funciona
- [ ] Serviço principal (porta 3000) continua funcional
- [ ] Ambos os serviços usam a mesma base de dados

---

## Dicas de Troubleshooting

| Problema | Possível Solução |
|----------|------------------|
| `Cannot find module` | Verificar paths dos requires |
| `ECONNREFUSED db:5432` | DB_HOST deve ser `db`, não `localhost` |
| Container crasha | Ver logs: `docker compose logs order-service` |
| Porta já em uso | `docker compose down` e tentar novamente |

---

## Conceitos Praticados

- Separação de serviços em containers
- Dockerfile e boas práticas
- Docker Compose para múltiplos serviços
- Networking entre containers
- Variáveis de ambiente
