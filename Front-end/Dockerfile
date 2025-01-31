# Etapa 1: Build da aplicação Angular usando a imagem Node.js
FROM node:18.19.1 AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Instalar Angular CLI globalmente
RUN npm install @angular/cli@17.3.6 --save-dev

# Copiar o código da aplicação
COPY . .

# Executar o build da aplicação para produção
RUN npx ng build --configuration production  

# Etapa 2: Criar uma imagem para servir a aplicação com Nginx (ou outro servidor)
FROM nginx:alpine AS production

# Copiar os arquivos gerados no build para o diretório de conteúdo estático do Nginx
COPY --from=build /app/dist/e-drive/browser/ /usr/share/nginx/html/e-drive

# Copiar o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar os certificados SSL para o contêiner
COPY src/environments/certificados/server.crt /etc/nginx/ssl/server.crt
COPY src/environments/certificados/server.key /etc/nginx/ssl/server.key

# Expor as portas 80 e 443
EXPOSE 80 443

# Rodar o Nginx para servir a aplicação
CMD ["nginx", "-g", "daemon off;"]
