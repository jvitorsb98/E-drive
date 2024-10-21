package br.com.cepedi.e_drive.audit.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

/**
 * Configuração do Web MVC para registrar interceptadores.
 * <p>
 * A classe {@link WebConfig} implementa a interface {@link WebMvcConfigurer} para configurar os interceptadores
 * utilizados na aplicação. Neste caso, a configuração inclui o {@link AuditInterceptor}, que é responsável
 * por capturar e registrar o endereço IP do cliente para auditoria.
 * </p>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AuditInterceptor auditInterceptor;

    /**
     * Adiciona interceptadores à configuração do Spring MVC.
     * <p>
     * Este método é usado para registrar o {@link AuditInterceptor}, que intercepta as requisições HTTP
     * para capturar e armazenar o endereço IP do cliente antes que a requisição seja processada pelos controladores.
     * </p>
     *
     * @param registry O {@link InterceptorRegistry} usado para registrar interceptadores.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditInterceptor);       //para a opção via Interceptor
        //registry.addInterceptor(ipAddressInterceptor); //para a opção via AOP
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver localeResolver = new SessionLocaleResolver();

        localeResolver.setDefaultLocale(Locale.forLanguageTag("en"));
        return localeResolver;
    }

}
