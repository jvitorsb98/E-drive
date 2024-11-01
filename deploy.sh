#!/bin/bash

# Passo 1: Verifica se o banco de dados existe
DB_CONTAINER_NAME=$(docker compose ps -q db)  # Obtém o nome do contêiner do banco de dados

# Verifica se o banco de dados está vazio
DB_EXISTS=$(docker exec -it "$DB_CONTAINER_NAME" psql -U postgres -d e_drive -c "SELECT 1 FROM pg_database WHERE datname='e_drive';" | grep -E '^[0-9]+' | tr -d ' ')

# Se o banco não existir, inicializa com always, caso contrário, com never
if [ -z "$DB_EXISTS" ]; then
    echo "O banco de dados não existe. Inicializando com SPRING_SQL_INIT_MODE=always."
    export SPRING_SQL_INIT_MODE=always
else
    echo "O banco de dados já existe. Inicializando com SPRING_SQL_INIT_MODE=never."
    export SPRING_SQL_INIT_MODE=never
fi

# Passo 2: Inicializa o docker compose
docker compose up --build -d  # Inclui --build para reconstruir as imagens

# Aguarda alguns segundos para garantir que o serviço esteja pronto
sleep 10

# Passo 3: Para o serviço
docker compose stop backend
echo mvn -v
# Passo 4: Executa o comando Maven pulando os testes
(cd Back-end && mvn package -DskipTests)

# Passo 5: Reinicia o docker compose para aplicar as alterações
docker compose up -d  # Não inclui --build para evitar recriação do banco
