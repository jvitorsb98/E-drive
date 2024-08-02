package br.com.cepedi.e_drive.infra.springDoc;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
        name = "bearer-key",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SpringDoc {

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