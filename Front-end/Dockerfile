# Usar a imagem do Node.js
FROM node:18.19.0 AS development

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta 4200 para o Angular
EXPOSE 4200

# Comando para iniciar a aplicação com o script de broadcast
CMD ["npm", "run", "broadcast"]
