package br.com.cepedi.e_drive.audit.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração do Web MVC para registrar interceptadores.
 * <p>
 * A classe {@link WebConfig} implementa a interface {@link WebMvcConfigurer} para configurar os interceptadores
 * utilizados na aplicação. Neste caso, a configuração inclui o {@link IpAddressInterceptor}, que é responsável
 * por capturar e registrar o endereço IP do cliente para auditoria.
 * </p>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private IpAddressInterceptor ipAddressInterceptor;

    /**
     * Adiciona interceptadores à configuração do Spring MVC.
     * <p>
     * Este método é usado para registrar o {@link IpAddressInterceptor}, que intercepta as requisições HTTP
     * para capturar e armazenar o endereço IP do cliente antes que a requisição seja processada pelos controladores.
     * </p>
     *
     * @param registry O {@link InterceptorRegistry} usado para registrar interceptadores.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(ipAddressInterceptor); // Adiciona o interceptor para captura do IP do cliente
    }
}
