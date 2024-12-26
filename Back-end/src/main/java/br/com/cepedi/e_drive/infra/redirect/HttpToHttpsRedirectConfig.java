package br.com.cepedi.e_drive.infra.redirect;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpToHttpsRedirectConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatFactory() {
        return factory -> {
            factory.addAdditionalTomcatConnectors(createHttpConnector());
        };
    }

    private Connector createHttpConnector() {
        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
        connector.setScheme("http");
        connector.setPort(8082); // Porta HTTP
        connector.setSecure(false);
        connector.setRedirectPort(8443); // Redireciona para HTTPS na porta 8443
        return connector;
    }
}
