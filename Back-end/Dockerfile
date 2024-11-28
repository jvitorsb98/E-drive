# Usar uma imagem base do OpenJDK 21
FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y \
    libx11-6 \
    libfontconfig1 \
    libfreetype6 \
    && rm -rf /var/lib/apt/lists/*

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o arquivo JAR gerado para o contêiner
COPY target/e-drive-0.0.1-SNAPSHOT.jar app.jar

# Expor a porta que a aplicação usará
EXPOSE 8080

# Comando para executar a aplicação
CMD ["java", "-jar", "app.jar"]
