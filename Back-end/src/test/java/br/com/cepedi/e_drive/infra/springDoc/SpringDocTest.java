package br.com.cepedi.e_drive.infra.springDoc;

import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class SpringDocTest {

	@Autowired
	private ApplicationContext applicationContext;

	@Test
	@DisplayName("Verify OpenAPI Configuration")
	void testOpenAPIConfiguration() {
		OpenAPI openAPI = applicationContext.getBean(OpenAPI.class);
		assertNotNull(openAPI, "OpenAPI bean should not be null");

		// Verifique o título
		assertEquals("E-drive", openAPI.getInfo().getTitle(), "API title should be 'E-drive'");

		// Verifique a versão
		assertEquals("v1", openAPI.getInfo().getVersion(), "API version should be 'v1'");

		// Verifique a descrição
		assertEquals("REST API E-drive", openAPI.getInfo().getDescription(), "API description should be 'REST API E-drive'");

		// Verifique a licença
		assertNotNull(openAPI.getInfo().getLicense(), "API license should not be null");
		assertEquals("apache 2.4", openAPI.getInfo().getLicense().getName(), "API license name should be 'apache 2.4'");
		assertEquals("https://springdoc.org/", openAPI.getInfo().getLicense().getUrl(), "API license URL should be 'https://springdoc.org/'");

		// Verifique a documentação externa
		assertNotNull(openAPI.getExternalDocs(), "External documentation should not be null");
		assertEquals("link de acesso", openAPI.getExternalDocs().getDescription(), "External documentation description should be 'link de acesso'");
		assertEquals("https://edrive.com.br", openAPI.getExternalDocs().getUrl(), "External documentation URL should be 'https://edrive.com.br'");
	}
}
