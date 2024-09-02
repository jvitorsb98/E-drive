package br.com.cepedi.e_drive.security.infra;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Configuração para habilitar a execução assíncrona em Spring.
 * <p>
 * Esta classe é marcada com a annotation {@link Configuration} para que o Spring a trate como uma classe de configuração.
 * A annotation {@link EnableAsync} habilita o suporte a execução assíncrona, permitindo que métodos anotados com {@code @Async}
 * sejam executados em threads separadas.
 * </p>
 * <p>
 * Você pode adicionar configurações adicionais relacionadas à execução assíncrona nesta classe se necessário.
 * </p>
 */
@Configuration
@EnableAsync
public class AsyncConfig {
    // Aqui você pode adicionar configurações adicionais se necessário.
}
