package br.com.cepedi.e_drive.security.infra;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuração de segurança para a aplicação.
 * <p>
 * Esta classe é responsável por configurar a segurança da aplicação, incluindo a definição das regras de autorização,
 * a configuração do gerenciamento de sessão e a adição de filtros de segurança personalizados.
 * </p>
 */
@Configuration
@EnableWebSecurity
public class SettingsSecurity {

    @Autowired
    private br.com.cepedi.e_drive.security.infra.SecurityFilter securityFilter;

    /**
     * Configura o filtro de segurança da aplicação.
     * <p>
     * Esta configuração define a política de criação de sessões, desativa o CSRF, define as permissões de acesso para
     * diferentes endpoints e adiciona o filtro de segurança personalizado {@link SecurityFilter}.
     * </p>
     *
     * @param http A configuração de segurança HTTP.
     * @return O {@link SecurityFilterChain} configurado.
     * @throws Exception Se ocorrer um erro durante a configuração do filtro de segurança.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.requestMatchers("/auth/login").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/auth/register").permitAll();
                    req.requestMatchers("/auth/user/exists").permitAll();

//                    req.requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll();
//                    req.requestMatchers("/auth/reset-password/**").permitAll();
//                    req.requestMatchers("/auth/activate-account").permitAll();
//
//                    req.requestMatchers(HttpMethod.POST, "/api/v2/brands/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.PUT, "/api/v2/brands/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.DELETE, "/api/v2/brands/**").hasRole("ADMIN");
//
//                    req.requestMatchers(HttpMethod.POST, "/api/v2/categories/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.PUT, "/api/v2/categories/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.DELETE, "/api/v2/categories/**").hasRole("ADMIN");
//
//                    req.requestMatchers(HttpMethod.POST, "/api/v2/payments/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.DELETE, "/api/v2/payments/**").hasRole("ADMIN");
//
//                    req.requestMatchers(HttpMethod.POST, "/api/v2/possible-facets/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.PUT, "/api/v2/possible-facets/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.DELETE, "/api/v2/possible-facets/**").hasRole("ADMIN");
//
//                    req.requestMatchers(HttpMethod.POST, "/api/v2/products/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.PUT, "/api/v2/products/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.DELETE, "/api/v2/products/**").hasRole("ADMIN");
//
//                    req.requestMatchers(HttpMethod.POST, "/api/v2/productsAttributte/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.PUT, "/api/v2/productsAttributte/**").hasRole("ADMIN");
//                    req.requestMatchers(HttpMethod.DELETE, "/api/v2/productsAttributte/**").hasRole("ADMIN");
//
//
//                    req.requestMatchers(HttpMethod.GET, "/api/v2/payments/users/{userId}").authenticated();
//                    req.requestMatchers(HttpMethod.GET, "/api/v2/payments").hasRole("ADMIN");

                    req.anyRequest().permitAll();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * Configura o {@link AuthenticationManager} para autenticação.
     *
     * @param configuration A configuração de autenticação.
     * @return O {@link AuthenticationManager} configurado.
     * @throws Exception Se ocorrer um erro durante a configuração do gerenciador de autenticação.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Configura o codificador de senhas {@link PasswordEncoder}.
     *
     * @return Um {@link BCryptPasswordEncoder} para codificação de senhas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
