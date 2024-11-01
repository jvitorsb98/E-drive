# Etapa 1: Build da aplicação Angular usando a imagem Node.js
FROM node:18.19.1 AS development

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./


# Adicionar o diretório de binários globais ao PATH
ENV PATH /usr/local/bin:$PATH

# Instalar dependências do projeto
RUN npm install 

RUN npm install @angular/cli@17.3.6 --save-dev


# Copiar o código da aplicação
COPY . .

# Expor a porta que o Angular serve
EXPOSE 4200

# Comando para rodar a aplicação em modo de desenvolvimento
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
