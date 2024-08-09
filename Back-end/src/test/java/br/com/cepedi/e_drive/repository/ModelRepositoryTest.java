package br.com.cepedi.e_drive.repository;



import br.com.cepedi.e_drive.model.entitys.Model;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ModelRepositoryTest {

    @Autowired
    private ModelRepository modelRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        modelRepository.deleteAll();
    }

    @Test
    @DisplayName("Test save and find by ID")
    public void testSaveAndFindById() {
        // Create a new Model instance
        Model model = new Model();
        model.setName(faker.company().name());
        model.setActivated(true); // Definir um valor para 'activated'

        // Save the Model in the database
        Model savedModel = modelRepository.save(model);

        // Retrieve the Model by its ID
        Optional<Model> foundModel = modelRepository.findById(savedModel.getId());

        // Verify that the Model was saved and retrieved correctly
        assertTrue(foundModel.isPresent(), "Model should be present");
        assertEquals(savedModel.getId(), foundModel.get().getId(), "ID should match");
        assertTrue(foundModel.get().getActivated(), "Model should be activated");
    }

    @Test
    @DisplayName("Test find all models")
    public void testFindAll() {
        // Create and save a new Model instance
        Model model = new Model();
        model.setName(faker.company().name());
        model.setActivated(true); // Definir um valor para 'activated'
        modelRepository.save(model);

        // Retrieve all models from the database
        List<Model> models = modelRepository.findAll();

        // Verify if the number of retrieved models matches the expected number
        assertEquals(1, models.size(), "There should be one Model");
    }

    @Test
    @DisplayName("Test delete model")
    public void testDelete() {
        // Create and save a new Model instance
        Model model = new Model();
        model.setName(faker.company().name());
        model.setActivated(true); // Definir um valor para 'activated'
        Model savedModel = modelRepository.save(model);

        // Delete the Model
        modelRepository.delete(savedModel);

        // Verify that the Model was deleted
        Optional<Model> deletedModel = modelRepository.findById(savedModel.getId());
        assertFalse(deletedModel.isPresent(), "Model should be deleted");
    }

    @Test
    @DisplayName("Test update model")
    public void testUpdate() {
        // Create and save a new Model instance
        Model model = new Model();
        model.setName(faker.company().name());
        model.setActivated(true); // Definir um valor para 'activated'
        Model savedModel = modelRepository.save(model);

        // Update the model details
        savedModel.setName(faker.company().name());

        // Save the updated model
        Model updatedModel = modelRepository.save(savedModel);

        // Verify that the updated details are correct
        assertEquals(savedModel.getName(), updatedModel.getName());
    }
}
