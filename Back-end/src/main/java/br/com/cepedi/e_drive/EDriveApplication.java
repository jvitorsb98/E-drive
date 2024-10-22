package br.com.cepedi.e_drive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Classe principal para a aplicação Spring Boot E-Drive.
 * <p>
 * Esta classe é a entrada principal da aplicação, responsável por iniciar a aplicação Spring Boot.
 * Ela também habilita o suporte para cache, o que pode melhorar o desempenho da aplicação ao armazenar
 * em cache os resultados de operações caras.
 * </p>
 */
@EnableCaching
@SpringBootApplication
@EnableScheduling
public class EDriveApplication {

	/**
	 * Método principal que inicia a aplicação Spring Boot.
	 * <p>
	 * Este método utiliza a classe {@link SpringApplication} para iniciar a aplicação,
	 * carregando o contexto Spring e iniciando o servidor embutido.
	 * </p>
	 *
	 * @param args Argumentos de linha de comando passados para a aplicação.
	 */
	public static void main(String[] args) {
		SpringApplication.run(EDriveApplication.class, args);
	}
}
