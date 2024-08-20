package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

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
        String password = faker.internet().password();
        String name = faker.name().fullName();
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);

        // Act
        userRepository.save(user);
        User foundUser = userRepository.findByEmail(email);

        // Assert
        assertEquals(email, foundUser.getEmail(), () -> "Expected email to be " + email + " but was " + foundUser.getEmail());
        assertEquals(password, foundUser.getPassword(), () -> "Expected password to be " + password + " but was " + foundUser.getPassword());
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


