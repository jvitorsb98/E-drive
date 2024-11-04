package br.com.cepedi.e_drive;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EDriveApplicationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads() {
        assertNotNull(applicationContext);
    }

   
    @Test
    void applicationStartsSuccessfully() {
        assertDoesNotThrow(() -> {
            String[] args = {};
            EDriveApplication.main(args);
        }, "A aplicação deve iniciar sem lançar exceções.");
    }
    @Test
    void cachingIsEnabled() {
        assertTrue(EDriveApplication.class.isAnnotationPresent(EnableCaching.class),
                "A anotação @EnableCaching deve estar presente para habilitar o cache.");
    }

    @Test
    void schedulingIsEnabled() {
        assertTrue(EDriveApplication.class.isAnnotationPresent(EnableScheduling.class),
                "A anotação @EnableScheduling deve estar presente para habilitar agendamentos.");
    }
}
