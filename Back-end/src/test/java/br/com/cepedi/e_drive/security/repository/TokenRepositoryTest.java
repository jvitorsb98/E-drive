package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.Token;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterToken;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class TokenRepositoryTest {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository; // Adicione um UserRepository

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
    }

    @Test
    @Order(1)
    @Transactional
    public void testCreateAndFindToken() {
        // Criar e salvar um usuário fictício
        User user = new User();
        // Configure o usuário conforme necessário
        userRepository.save(user); // Salvar o usuário antes de criar o token

        // Criar um Token com Faker
        String tokenValue = faker.lorem().characters(32);
        Instant expireDate = Instant.now().plusSeconds(3600);

        Token token = new Token(new DataRegisterToken(tokenValue, null, expireDate), user);

        // Salvar o token
        tokenRepository.save(token);

        // Encontrar o token pelo valor
        Optional<Token> foundToken = tokenRepository.findByToken(tokenValue);

        // Verificar se o token foi encontrado
        assertThat(foundToken).isPresent();
        assertThat(foundToken.get().getToken()).isEqualTo(tokenValue);
        assertThat(foundToken.get().getExpireDate()).isEqualTo(expireDate);
        assertThat(foundToken.get().getUser()).isEqualTo(user);
        assertThat(foundToken.get().getDisabled()).isFalse();
    }

    @Test
    @Order(2)
    @Transactional
    public void testFindNonExistentToken() {
        // Tentar encontrar um token que não existe
        Optional<Token> foundToken = tokenRepository.findByToken("nonexistenttoken");

        // Verificar se o token não foi encontrado
        assertThat(foundToken).isNotPresent();
    }
}

