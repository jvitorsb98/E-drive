package br.com.cepedi.e_drive.infra.cors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configuração para habilitar e configurar o suporte a CORS (Cross-Origin Resource Sharing) na aplicação.
 * <p>
 * CORS é um mecanismo de segurança que permite que recursos de um servidor sejam acessados de um domínio diferente
 * do que o servidor original. Esta configuração define quais origens, métodos e cabeçalhos são permitidos nas
 * solicitações CORS.
 * </p>
 */
@Configuration
public class CorsConfig {

    /**
     * Define um bean do tipo {@link CorsFilter} que aplica a configuração CORS na aplicação.
     * <p>
     * A configuração permite que solicitações CORS sejam feitas da origem especificada, com quaisquer cabeçalhos e
     * métodos. A configuração inclui:
     * <ul>
     *     <li>Permissão para credenciais (cookies) serem incluídos nas solicitações.</li>
     *     <li>Permissão para solicitações da origem "http://localhost:4200".</li>
     *     <li>Permissão para qualquer cabeçalho nas solicitações.</li>
     *     <li>Permissão para qualquer método HTTP (GET, POST, PUT, DELETE, etc.).</li>
     * </ul>
     * </p>
     *
     * @return um {@link CorsFilter} configurado com as regras definidas para CORS.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOriginPattern("https://192.168.*.*:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
