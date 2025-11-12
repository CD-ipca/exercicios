FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Expor porta da aplicação
EXPOSE 3000

# Configurar utilizador não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
USER nodeuser

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]
