package br.com.cepedi.e_drive.security.infra;

import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class SecurityFilterTest {

    @InjectMocks
    private SecurityFilter securityFilter;

    @Mock
    private TokenService tokenService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Do not set authentication when token is invalid")
    void doFilterInternal_DoesNotSetAuthentication_WhenTokenIsInvalid() throws ServletException, IOException {
        String token = "invalidToken";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(tokenService.getSubject(token)).thenReturn(null);

        securityFilter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Does not set authentication when authorization header is missing")
    void doFilterInternal_DoesNotSetAuthentication_WhenAuthorizationHeaderIsMissing() throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn(null);

        securityFilter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Do not set authentication when user is not found")
    void doFilterInternal_SetsAuthentication_WhenTokenIsValid() throws ServletException, IOException {
        String token = "validToken";
        String email = "user@example.com";

        // Criação de uma instância de User da sua entidade
        br.com.cepedi.e_drive.security.model.entitys.User user = new br.com.cepedi.e_drive.security.model.entitys.User();
        user.setEmail(email);
        user.setPassword("password");

        // Exemplo: Supondo que user.getRoles() retorna um Set<Role> onde Role contém informações de autoridade
        // Cria uma coleção de GrantedAuthority com base nas roles do usuário
        Collection<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName())) // Role.getName() deve retornar o nome da role
                .collect(Collectors.toSet());

        // Mock da implementação de UserDetails a partir da entidade User
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );

        // Simula o cabeçalho de autorização e o token
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(tokenService.getSubject(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(user);

        securityFilter.doFilterInternal(request, response, filterChain);

        // Verifica se o usuário foi autenticado
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        assertTrue(authentication instanceof UsernamePasswordAuthenticationToken);
        assertEquals(userDetails.getUsername(), ((UserDetails) authentication.getPrincipal()).getUsername());

        // Verifica se o filtro continua a cadeia de processamento
        verify(filterChain).doFilter(request, response);
    }

}
