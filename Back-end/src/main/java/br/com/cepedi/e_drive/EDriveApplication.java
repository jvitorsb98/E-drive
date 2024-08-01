package br.com.cepedi.e_drive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class EDriveApplication {

	public static void main(String[] args) {
		SpringApplication.run(EDriveApplication.class, args);
	}

}
