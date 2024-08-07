package br.com.cepedi.e_drive.security.model.entitys;

import com.github.javafaker.Faker;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterToken;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Token")
public class TokenTest {

    private Faker faker;
    private Token token;
    private User user;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        user = new User(); // Consider using a constructor or builder to set necessary fields
        // Prepare data for token
        DataRegisterToken dataRegisterToken = new DataRegisterToken(
                faker.lorem().word(), // Token value
                null, Instant.now().plusSeconds(3600) // Expiry date
        );
        token = new Token(dataRegisterToken, user);
    }

    @Test
    @DisplayName("Test creation of Token entity")
    void testTokenCreation() {
        assertNotNull(token);
        assertNotNull(token.getToken());
        assertNotNull(token.getExpireDate());
        assertEquals(false, token.getDisabled());
    }

    @Test
    @DisplayName("Test setting and getting token value")
    void testSetAndGetTokenValue() {
        String newToken = faker.lorem().word();
        token.setToken(newToken);
        assertEquals(newToken, token.getToken());
    }

    @Test
    @DisplayName("Test setting and getting expiration date")
    void testSetAndGetExpirationDate() {
        Instant newExpireDate = Instant.now().plusSeconds(7200);
        token.setExpireDate(newExpireDate);
        assertEquals(newExpireDate, token.getExpireDate());
    }

    @Test
    @DisplayName("Test marking token as disabled")
    void testMarkTokenAsDisabled() {
        token.disabled(); // Mark token as disabled
        assertTrue(token.getDisabled());
    }

    @Test
    @DisplayName("Test Token entity with null values")
    void testTokenWithNullValues() {
        Token nullToken = new Token();
        assertNull(nullToken.getToken());
        assertNull(nullToken.getExpireDate());
        assertNull(nullToken.getUser());
        assertNull(nullToken.getDisabled());
    }
}
