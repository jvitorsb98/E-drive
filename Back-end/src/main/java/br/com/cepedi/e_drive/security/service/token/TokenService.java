package br.com.cepedi.e_drive.security.service.token;

import br.com.cepedi.e_drive.security.model.entitys.Token;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterToken;
import br.com.cepedi.e_drive.security.repository.TokenRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Serviço responsável pela geração, verificação e revogação de tokens JWT.
 * <p>
 * Esta classe fornece métodos para criar tokens de autenticação e de recuperação de senha,
 * verificar se um token é válido, registrar tokens na base de dados e obter informações dos tokens.
 * </p>
 */
@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    @Value("${api.security.token.secret}")
    private String secret;

    private static final String ISSUER = "API Voll.med";

    /**
     * Revoga um token JWT, desabilitando-o na base de dados.
     *
     * @param token O token JWT a ser revogado.
     */
    public void revokeToken(String token) {
        Optional<Token> tokenEntity = tokenRepository.findByToken(token);
        if (tokenEntity.isPresent()) {
            Token tokenToUpdate = tokenEntity.get();
            tokenToUpdate.disabled();
            tokenRepository.save(tokenToUpdate);
        }
    }

    /**
     * Gera um token JWT para um usuário.
     *
     * @param user O usuário para o qual o token será gerado.
     * @return O token JWT gerado.
     */
    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            // Adiciona as roles como uma lista de strings no token
            String token = JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(user.getEmail()) // Usa o e-mail como subject
                    .withClaim("id", user.getId())
                    .withClaim("email", user.getEmail())
                    .withClaim("roles", user.getAuthorities().stream()
                            .map(role -> role.getAuthority()) // Extrai as roles
                            .collect(Collectors.toList()))
                    .withExpiresAt(expirationDate()) // Defina o método de expiração
                    .sign(algorithm);

            registerToken(token, user);

            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }

    /**
     * Registra um token JWT na base de dados.
     *
     * @param tokenValue O valor do token JWT.
     * @param user O usuário associado ao token.
     */
    private void registerToken(String tokenValue, User user) {
        Instant expiresAt = JWT.decode(tokenValue).getExpiresAtAsInstant();
        DataRegisterToken dataRegisterToken = new DataRegisterToken(tokenValue, user.getId(), expiresAt);
        Token tokenEntity = new Token(dataRegisterToken, user);
        tokenRepository.save(tokenEntity);
    }

    /**
     * Gera um token JWT para recuperação de senha.
     *
     * @param user O usuário para o qual o token será gerado.
     * @return O token JWT gerado para recuperação de senha.
     */
    public String generateTokenRecoverPassword(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(user.getEmail()) // Usa o e-mail como subject
                    .withClaim("id", user.getId())
                    .withClaim("email", user.getEmail())
                    .withExpiresAt(expirationDateRecoverPassword())
                    .sign(algorithm);
            registerToken(token, user);  // Registra o token na base de dados
            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }

    /**
     * Verifica se um token JWT é válido.
     *
     * @param token O token JWT a ser verificado.
     * @return Verdadeiro se o token for válido e não estiver desabilitado, falso caso contrário.
     */
    public boolean isValidToken(String token) {
        try {
            var algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(token);

            Optional<Token> tokenEntity = tokenRepository.findByToken(token);
            return tokenEntity.isPresent() && tokenEntity.get().getDisabled() != null && !tokenEntity.get().getDisabled();
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    /**
     * Obtém a data de expiração do token JWT.
     *
     * @return A data de expiração do token.
     */
    private Instant expirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    /**
     * Obtém a data de expiração do token de recuperação de senha.
     *
     * @return A data de expiração do token de recuperação de senha.
     */
    private Instant expirationDateRecoverPassword() {
        return LocalDateTime.now().plusMinutes(30).toInstant(ZoneOffset.of("-03:00"));
    }

    /**
     * Obtém o e-mail associado a um token JWT.
     *
     * @param token O token JWT.
     * @return O e-mail associado ao token.
     */
    public String getEmailByToken(String token) {
        return JWT.decode(token).getClaim("email").asString();
    }

    public Long getIdUSerByToken(String token) {
        return JWT.decode(token).getClaim("id").asLong();
    }

    /**
     * Obtém o assunto (subject) de um token JWT.
     *
     * @param tokenJWT O token JWT.
     * @return O assunto do token JWT.
     * @throws JWTVerificationException Se o token JWT for inválido ou expirado.
     */
    public String getSubject(String tokenJWT) throws JWTVerificationException {
        try {
            var algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException("Token JWT inválido ou expirado!");
        }
    }

    /**
     * Gera um token JWT para ativação de e-mail.
     *
     * @param user O usuário para o qual o token será gerado.
     * @return O token JWT gerado para ativação de e-mail.
     */
    public String generateTokenForActivatedEmail(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(user.getEmail()) // Usa o e-mail como subject
                    .withClaim("id", user.getId())
                    .withClaim("email", user.getEmail())
                    .sign(algorithm);
            registerToken(token, user);  // Registra o token na base de dados
            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }

    /**
     * Gera um token JWT para reativação de conta de usuário.
     *
     * Este método cria um token JWT contendo o e-mail e o ID do usuário como claims e registra
     * o token gerado no banco de dados. O token tem uma validade de 1 hora.
     *
     * @param user O objeto {@link User} para o qual o token será gerado.
     * @return O token JWT gerado como uma {@link String}.
     * @throws RuntimeException Se ocorrer um erro durante a criação do token JWT.
     */
    public String generateTokenForReactivation(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(user.getEmail()) // Usa o e-mail como subject
                    .withClaim("id", user.getId())
                    .withClaim("email", user.getEmail())
                    .withExpiresAt(expirationDateRecoverPassword())
                    .sign(algorithm);
            registerToken(token, user);  // Registra o token na base de dados
            return token;
        } catch (JWTCreationException exception) {
            // Lança uma exceção se houver falha na criação do token
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }


}
