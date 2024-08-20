package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Model;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

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

    private Model createTestModel(String name, boolean activated) {
        Model model = new Model();
        model.setName(name);
        model.setActivated(activated);
        return model;
    }

    @Test
    @DisplayName("Test save and find by ID")
    public void testSaveAndFindById() {
        // Arrange
        Model model = createTestModel(faker.company().name(), true);

        // Act
        Model savedModel = modelRepository.save(model);
        Optional<Model> foundModel = modelRepository.findById(savedModel.getId());

        // Assert
        assertTrue(foundModel.isPresent(), () -> "Model should be present");
        assertEquals(savedModel.getId(), foundModel.get().getId(), () -> "ID should match");
        assertTrue(foundModel.get().getActivated(), () -> "Model should be activated");
    }

    @Test
    @DisplayName("Test find all activated models")
    public void testFindAllActivatedModels() {
        // Arrange
        Model activeModel1 = createTestModel(faker.company().name(), true);
        Model activeModel2 = createTestModel(faker.company().name(), true);
        Model inactiveModel = createTestModel(faker.company().name(), false);
        
        modelRepository.save(activeModel1);
        modelRepository.save(activeModel2);
        modelRepository.save(inactiveModel);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Model> activeModels = modelRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertEquals(2, activeModels.getTotalElements(), () -> "There should be two activated models");
        assertTrue(activeModels.getContent().stream().allMatch(model -> model.getActivated()), 
            () -> "All retrieved models should be activated");
    }

    @Test
    @DisplayName("Test delete model")
    public void testDelete() {
        // Arrange
        Model model = createTestModel(faker.company().name(), true);
        Model savedModel = modelRepository.save(model);

        // Act
        modelRepository.delete(savedModel);
        Optional<Model> deletedModel = modelRepository.findById(savedModel.getId());

        // Assert
        assertFalse(deletedModel.isPresent(), () -> "Model should be deleted");
    }

    @Test
    @DisplayName("Test update model")
    public void testUpdate() {
        // Arrange
        Model model = createTestModel(faker.company().name(), true);
        Model savedModel = modelRepository.save(model);

        // Act
        savedModel.setName(faker.company().name());
        Model updatedModel = modelRepository.save(savedModel);

        // Assert
        assertEquals(savedModel.getName(), updatedModel.getName(), () -> "Name should be updated");
    }
    
    @Test
    @DisplayName("Test find all activated models with pagination")
    public void testFindAllActivatedModelsWithPagination() {
        // Arrange
        Model activeModel1 = createTestModel(faker.company().name(), true);
        Model activeModel2 = createTestModel(faker.company().name(), true);
        Model activeModel3 = createTestModel(faker.company().name(), true);
        modelRepository.save(activeModel1);
        modelRepository.save(activeModel2);
        modelRepository.save(activeModel3);

        // Act
        Pageable pageable = PageRequest.of(0, 2); // Requesting 2 models per page
        Page<Model> activeModelsPage1 = modelRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertEquals(2, activeModelsPage1.getNumberOfElements(), () -> "Page 1 should contain two models");
        assertTrue(activeModelsPage1.hasNext(), () -> "There should be a next page");
        
        // Act - Fetch the next page
        pageable = PageRequest.of(1, 2); // Requesting 2 models per page, second page
        Page<Model> activeModelsPage2 = modelRepository.findAllByActivatedTrue(pageable);
        
        // Assert
        assertEquals(1, activeModelsPage2.getNumberOfElements(), () -> "Page 2 should contain one model");
        assertFalse(activeModelsPage2.hasNext(), () -> "There should be no next page");
    }

    @Test
    @DisplayName("Test find by ID for non-existent model")
    public void testFindByIdForNonExistentModel() {
        // Act
        Optional<Model> foundModel = modelRepository.findById(Long.MAX_VALUE); // Using an unlikely ID
        
        // Assert
        assertFalse(foundModel.isPresent(), () -> "Model should not be found for a non-existent ID");
    }

    @Test
    @DisplayName("Test save model with duplicate names")
    public void testSaveModelWithDuplicateNames() {
        // Arrange
        String modelName = faker.company().name();
        Model model1 = createTestModel(modelName, true);
        Model model2 = createTestModel(modelName, true);
        modelRepository.save(model1);
        
        // Act
        Model savedModel2 = modelRepository.save(model2);

        // Assert
        assertNotNull(savedModel2.getId(), () -> "Second model should be saved even with the same name");
        assertNotEquals(model1.getId(), savedModel2.getId(), () -> "Models with the same name should have different IDs");
    }
}

