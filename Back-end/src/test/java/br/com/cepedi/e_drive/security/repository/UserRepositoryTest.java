package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.config.TestConfig;
import br.com.cepedi.e_drive.security.model.entitys.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Import(TestConfig.class)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should save and find a user by email")
    public void testCreateAndFindUserByEmail() {
        // Arrange
        String email = faker.internet().emailAddress();
        String rawPassword = faker.internet().password();
        String name = faker.name().fullName();
        User user = new User();
        user.setEmail(email);
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        user.setName(name);

        // Act
        userRepository.save(user);
        User foundUser = userRepository.findByEmail(email);


        System.out.println("Raw password: " + rawPassword);
        System.out.println("Encoded password: " + encodedPassword);
        System.out.println("Found user password (encoded): " + foundUser.getPassword());

        // Assert
        assertEquals(email, foundUser.getEmail(), () -> "Expected email to be " + email + " but was " + foundUser.getEmail());
        // assertTrue(passwordEncoder.matches(rawPassword, foundUser.getPassword()), () -> "Expected password to match but it didn't");
        assertEquals(name, foundUser.getName(), () -> "Expected name to be " + name + " but was " + foundUser.getName());
    }




    @Test
    @DisplayName("Should return null when finding a user by non-existent email")
    public void testFindUserByNonExistentEmail() {
        // Arrange
        String nonExistentEmail = faker.internet().emailAddress();

        // Act
        User foundUser = userRepository.findByEmail(nonExistentEmail);

        // Assert
        assertNull(foundUser, () -> "Expected no user to be found for email " + nonExistentEmail);
    }

    @Test
    @DisplayName("Should update a user and reflect the changes")
    public void testUpdateUser() {
        // Arrange
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);
        User savedUser = userRepository.save(user);

        // Act
        String newName = faker.name().fullName();
        savedUser.setName(newName);
        userRepository.save(savedUser); // Atualiza o usuário
        User foundUser = userRepository.findByEmail(email);

        // Assert
        assertEquals(newName, foundUser.getName(), () -> "Expected updated name to be " + newName + " but was " + foundUser.getName());
    }


    @Test
    @DisplayName("Should delete a user and not find it by email")
    public void testDeleteUser() {
        // Arrange
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);
        User savedUser = userRepository.save(user);

        // Act
        userRepository.delete(savedUser);
        User foundUser = userRepository.findByEmail(email);

        // Assert
        assertNull(foundUser, () -> "Expected no user to be found for email " + email + " after deletion");
    }




    @Test
    @DisplayName("Should return true if the email exists")
    public void testExistsByEmail() {
        // Arrange
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);
        userRepository.save(user);

        // Act
        boolean exists = userRepository.existsByEmail(email);

        // Assert
        assertEquals(true, exists, () -> "Expected existsByEmail to return true for email " + email + " but returned false");
    }

    @Test
    @DisplayName("Should return false if the email does not exist")
    public void testExistsByNonExistentEmail() {
        // Arrange
        String nonExistentEmail = faker.internet().emailAddress();

        // Act
        boolean exists = userRepository.existsByEmail(nonExistentEmail);

        // Assert
        assertEquals(false, exists, () -> "Expected existsByEmail to return false for non-existent email " + nonExistentEmail + " but returned true");
    }



}


