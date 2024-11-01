# Etapa 1: Build da aplicação Angular usando a imagem Node.js
FROM node:18.19.0 AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Definir NODE_OPTIONS
ENV NODE_OPTIONS=--openssl-legacy-provider

# Instalar dependências (incluindo Angular CLI como dependência de desenvolvimento)
RUN npm install

# Copiar o código da aplicação
COPY . .

RUN npm install -g @angular/cli@17.3.6 


# Executar o build da aplicação Angular usando o caminho completo para o ng
# Executar o build da aplicação Angular usando o caminho completo para o ng
RUN ng build --configuration production 

# Etapa 2: Servir os arquivos estáticos com um servidor leve (como Nginx)
FROM nginx:alpine AS production

# Copiar os arquivos compilados para o diretório padrão do Nginx
COPY --from=build /app/dist/e-drive /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expor a porta 80 para o Nginx
EXPOSE 80

# Iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]