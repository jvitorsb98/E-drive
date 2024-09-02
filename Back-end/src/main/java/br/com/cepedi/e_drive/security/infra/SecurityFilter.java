package br.com.cepedi.e_drive.security.infra;

import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de segurança que intercepta requisições HTTP para realizar a autenticação baseada em token JWT.
 * <p>
 * Esta classe estende {@link OncePerRequestFilter} para garantir que o filtro seja executado apenas uma vez por requisição.
 * </p>
 * <p>
 * O filtro recupera o token JWT do cabeçalho da requisição, valida o token e, se for válido, realiza a autenticação do usuário
 * baseado nas informações do token.
 * </p>
 */
@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository repository;

    /**
     * Executa o filtro de segurança para verificar e autenticar o token JWT.
     *
     * @param request A requisição HTTP.
     * @param response A resposta HTTP.
     * @param filterChain O encadeamento de filtros para continuar o processamento da requisição.
     * @throws ServletException Se ocorrer um erro durante o processamento do filtro.
     * @throws IOException Se ocorrer um erro de I/O durante o processamento do filtro.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String tokenJWT = recoverToken(request);

        if (tokenJWT != null) {
            String subject = tokenService.getSubject(tokenJWT);
            UserDetails user = repository.findByEmail(subject);
            if (user != null) {
                var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Recupera o token JWT do cabeçalho da requisição HTTP.
     *
     * @param request A requisição HTTP.
     * @return O token JWT, ou {@code null} se o cabeçalho de autorização não estiver presente.
     */
    private String recoverToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "");
        }

        return null;
    }
}
