package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository; // Removido "static" para permitir a injeção de dependência

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        userRepository.deleteAll();

    }

    @AfterEach
    public void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    @Order(1)
    public void testCreateAndFindUserByEmail() {
        // Gerar dados com Faker
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();

        // Criar e salvar um usuário
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);

        User savedUser = userRepository.save(user);

        // Buscar o usuário pelo e-mail
        User foundUser = userRepository.findByEmail(email);

        // Verificar se o usuário foi encontrado e se os dados estão corretos
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getEmail()).isEqualTo(email);
        assertThat(foundUser.getPassword()).isEqualTo(password);
        assertThat(foundUser.getName()).isEqualTo(name);
    }

    @Test
    @Order(2)
    public void testFindUserByNonExistentEmail() {
        // Tentar buscar um usuário com um e-mail que não existe
        String nonExistentEmail = faker.internet().emailAddress();
        User foundUser = userRepository.findByEmail(nonExistentEmail);

        // Verificar que o usuário não foi encontrado
        assertThat(foundUser).isNull();
    }

    @Test
    @Order(3)
    public void testUpdateUser() {
        // Gerar dados com Faker
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();

        // Criar e salvar um usuário
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);

        User savedUser = userRepository.save(user);

        // Atualizar os dados do usuário
        String newName = faker.name().fullName();
        savedUser.setName(newName);
        userRepository.save(savedUser); // Salvar as alterações

        // Buscar o usuário atualizado pelo e-mail
        User foundUser = userRepository.findByEmail(email);

        // Verificar se os dados foram atualizados corretamente
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getName()).isEqualTo(newName);
    }

    @Test
    @Order(4)
    public void testDeleteUser() {
        // Gerar dados com Faker
        String email = faker.internet().emailAddress();
        String password = faker.internet().password();
        String name = faker.name().fullName();

        // Criar e salvar um usuário
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);

        User savedUser = userRepository.save(user);

        // Excluir o usuário
        userRepository.delete(savedUser);

        // Tentar buscar o usuário pelo e-mail
        User foundUser = userRepository.findByEmail(email);

        // Verificar que o usuário não foi encontrado após a exclusão
        assertThat(foundUser).isNull();
    }

    @Test
    @Order(5)
    public void testSaveAndFindMultipleUsers() {
        // Gerar dados com Faker
        for (int i = 0; i < 5; i++) {
            String email = faker.internet().emailAddress();
            String password = faker.internet().password();
            String name = faker.name().fullName();

            // Criar e salvar um usuário
            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setName(name);

            userRepository.save(user);
        }

        // Verificar se vários usuários foram salvos corretamente
        assertThat(userRepository.findAll()).hasSize(5);
    }

}
