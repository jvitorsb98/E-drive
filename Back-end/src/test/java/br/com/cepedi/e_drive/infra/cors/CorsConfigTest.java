package br.com.cepedi.e_drive.infra.cors;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import jakarta.servlet.ServletException;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;

@SpringBootTest
@ContextConfiguration(classes = {CorsConfig.class})
public class CorsConfigTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private CorsFilter corsFilter;

    @Test
    public void listBeans() {
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        for (String beanName : beanNames) {
            System.out.println(beanName);
        }
    }

    @Test
    public void corsFilter_ShouldNotBeNull() {
        assertThat(corsFilter).isNotNull();
    }



    @Test
    public void corsFilter_ShouldInvokeFilter() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("OPTIONS");
        request.addHeader("Origin", "http://localhost:4200");

        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        // Executa o filtro CORS
        corsFilter.doFilter(request, response, filterChain);

        // Verifica se o cabeçalho foi definido
        assertThat(response.getHeader("Access-Control-Allow-Origin")).isNotNull();
    }

    @Test
    public void corsFilter_ShouldBlockNonConfiguredOrigin() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("OPTIONS");
        request.addHeader("Origin", "http://notallowed.com");

        MockHttpServletResponse response = new MockHttpServletResponse();
        corsFilter.doFilter(request, response, new MockFilterChain());

        assertThat(response.getHeader("Access-Control-Allow-Origin")).isNull(); // Nenhum cabeçalho deve ser retornado
    }

}
