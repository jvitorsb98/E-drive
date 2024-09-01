package br.com.cepedi.e_drive.security.service.freeMarkenConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;

/**
 * Configuração do FreeMarker para o projeto.
 * <p>
 * Esta classe configura o caminho do carregador de templates do FreeMarker
 * para que ele possa encontrar os arquivos de template no classpath.
 * </p>
 */
@Configuration
public class FreeMarkerConfig {

    /**
     * Cria um bean de configuração do FreeMarker.
     *
     * @return Um bean configurado do tipo {@link FreeMarkerConfigurationFactoryBean}.
     */
    @Bean
    public FreeMarkerConfigurationFactoryBean freemarkerConfiguration() {
        FreeMarkerConfigurationFactoryBean bean = new FreeMarkerConfigurationFactoryBean();
        // Define o caminho do carregador de templates como o diretório "templates" no classpath
        bean.setTemplateLoaderPath("classpath:/templates/");
        return bean;
    }
}
