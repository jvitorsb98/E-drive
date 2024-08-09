package br.com.cepedi.e_drive.security.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;

import freemarker.template.Configuration;
import freemarker.cache.FileTemplateLoader;

import java.io.IOException;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class FreeMarkerConfigTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("Should load FreeMarkerConfigurationFactoryBean bean")
    void testFreeMarkerConfigurationBean() throws IOException {
        FreeMarkerConfigurationFactoryBean bean = applicationContext.getBean(FreeMarkerConfigurationFactoryBean.class);

        assertNotNull(bean, "FreeMarkerConfigurationFactoryBean should be present in the application context");

        // Verifique a configuração do FreeMarker
        Configuration configuration = bean.getObject();
        assertNotNull(configuration, "FreeMarker Configuration should not be null");

        // Verifique o TemplateLoader
        assertNotNull(configuration.getTemplateLoader(), "TemplateLoader should not be null");

        // Verifique se o TemplateLoader é do tipo FileTemplateLoader
        assertTrue(configuration.getTemplateLoader() instanceof FileTemplateLoader, "TemplateLoader should be an instance of FileTemplateLoader");

        // Verifique o diretório base do FileTemplateLoader
        FileTemplateLoader fileTemplateLoader = (FileTemplateLoader) configuration.getTemplateLoader();
        String baseDir = Paths.get("target", "classes", "templates").toAbsolutePath().toString();
        assertEquals(baseDir, fileTemplateLoader.getBaseDirectory().getAbsolutePath().toString(), "Template loader base directory should match");
    }
}

