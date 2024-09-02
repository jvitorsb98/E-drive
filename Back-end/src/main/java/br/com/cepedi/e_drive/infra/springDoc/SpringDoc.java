package br.com.cepedi.e_drive.infra.springDoc;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do SpringDoc para a documentação da API.
 * <p>
 * Esta classe configura o SpringDoc para gerar a documentação da API usando OpenAPI.
 * </p>
 */
@Configuration
@SecurityScheme(
        name = "bearer-key",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SpringDoc {

    /**
     * Configura o OpenAPI com as informações da API e a documentação externa.
     * <p>
     * Este método cria uma instância de {@link OpenAPI} que fornece informações sobre a API,
     * incluindo o título, versão, descrição e licença. Além disso, configura um link externo
     * para a documentação adicional.
     * </p>
     *
     * @return Uma instância de {@link OpenAPI} configurada com informações da API e documentação externa.
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-drive")
                        .version("v1")
                        .description("REST API E-drive")
                        .license(new License()
                                .name("apache 2.4")
                                .url("https://springdoc.org/")
                        )
                )
                .externalDocs(new ExternalDocumentation()
                        .description("link de acesso")
                        .url("https://edrive.com.br"));
    }
}
