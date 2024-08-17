package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class PropulsionRepositoryTest {

    @Autowired
    private PropulsionRepository propulsionRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        propulsionRepository.deleteAll();
    }

    private Propulsion createTestPropulsion(String name, boolean activated) {
        Propulsion propulsion = new Propulsion();
        propulsion.setName(name);
        propulsion.setActivated(activated);
        return propulsion;
    }

    @Test
    @DisplayName("Test saving propulsion and verifying ID")
    public void testSavePropulsion() {
        // Arrange
        Propulsion propulsion = createTestPropulsion(faker.company().name(), true);

        // Act
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Assert
        assertNotNull(savedPropulsion.getId(), () -> "ID should be generated");
    }

    @Test
    @DisplayName("Test retrieving all deactivated propulsions")
    public void testFindAllDeactivatedPropulsions() {
        // Arrange
        Propulsion propulsion = createTestPropulsion(faker.company().name(), false);
        propulsionRepository.save(propulsion);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Propulsion> propulsions = propulsionRepository.findAllByActivatedFalse(pageable);

        // Assert
        assertEquals(1, propulsions.getTotalElements(), () -> "There should be one deactivated propulsion");
    }

    @Test
    @DisplayName("Test deleting a propulsion")
    public void testDeletePropulsion() {
        // Arrange
        Propulsion propulsion = createTestPropulsion(faker.company().name(), true);
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Act
        propulsionRepository.delete(savedPropulsion);
        Optional<Propulsion> deletedPropulsion = propulsionRepository.findById(savedPropulsion.getId());

        // Assert
        assertFalse(deletedPropulsion.isPresent(), () -> "Propulsion should be deleted");
    }

    @Test
    @DisplayName("Test updating a propulsion")
    public void testUpdatePropulsion() {
        // Arrange
        Propulsion propulsion = createTestPropulsion(faker.company().name(), true);
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Act
        savedPropulsion.setName(faker.company().name());
        savedPropulsion.setActivated(false);
        Propulsion updatedPropulsion = propulsionRepository.save(savedPropulsion);

        // Assert
        assertEquals(savedPropulsion.getName(), updatedPropulsion.getName(), () -> "Name should be updated");
        assertFalse(updatedPropulsion.getActivated(), () -> "Activated status should be updated");
    }

    @Test
    @DisplayName("Test finding propulsions by name containing a specific string")
    public void testFindByNameContaining() {
        // Arrange
        String namePart = "Sample";
        Propulsion propulsion = createTestPropulsion(namePart + " Propulsion", true);
        propulsionRepository.save(propulsion);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Propulsion> propulsions = propulsionRepository.findByNameContaining(namePart, pageable);

        // Assert
        assertEquals(1, propulsions.getTotalElements(), () -> "There should be one propulsion containing the name part");
    }

    @Test
    @DisplayName("Test retrieving all activated propulsions")
    public void testFindAllActivatedPropulsions() {
        // Arrange
        Propulsion propulsion = createTestPropulsion(faker.company().name(), true);
        propulsionRepository.save(propulsion);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Propulsion> propulsions = propulsionRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertEquals(1, propulsions.getTotalElements(), () -> "There should be one activated propulsion");
    }

    @Test
    @DisplayName("Test finding propulsions with pagination")
    public void testFindAllPropulsionsWithPagination() {
        // Arrange
        for (int i = 0; i < 5; i++) {
            propulsionRepository.save(createTestPropulsion(faker.company().name(), true));
        }

        // Act
        Pageable pageable = PageRequest.of(0, 3); // Requesting 3 propulsions per page
        Page<Propulsion> propulsionsPage1 = propulsionRepository.findAll(pageable);

        // Assert
        assertEquals(3, propulsionsPage1.getNumberOfElements(), () -> "Page 1 should contain three propulsions");
        assertTrue(propulsionsPage1.hasNext(), () -> "There should be a next page");

        // Act - Fetch the next page
        pageable = PageRequest.of(1, 3); // Requesting 3 propulsions per page, second page
        Page<Propulsion> propulsionsPage2 = propulsionRepository.findAll(pageable);

        // Assert
        assertEquals(2, propulsionsPage2.getNumberOfElements(), () -> "Page 2 should contain two propulsions");
        assertFalse(propulsionsPage2.hasNext(), () -> "There should be no next page");
    }

    @Test
    @DisplayName("Test finding by ID for non-existent propulsion")
    public void testFindByIdForNonExistentPropulsion() {
        // Act
        Optional<Propulsion> foundPropulsion = propulsionRepository.findById(Long.MAX_VALUE); // Using an unlikely ID

        // Assert
        assertFalse(foundPropulsion.isPresent(), () -> "Propulsion should not be found for a non-existent ID");
    }
    
    @Test
    @DisplayName("Test saving propulsion with minimal data")
    public void testSavePropulsionWithMinimalData() {
        // Arrange
        Propulsion propulsion = createTestPropulsion("", false);

        // Act
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Assert
        assertNotNull(savedPropulsion.getId(), () -> "ID should be generated even with minimal data");
    }
    
    @Test
    @DisplayName("Test saving propulsion with maximum length name")
    public void testSavePropulsionWithMaxLengthName() {
        // Arrange
        String longName = "A".repeat(255); // Assume 255 is the maximum length allowed
        Propulsion propulsion = createTestPropulsion(longName, true);

        // Act
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Assert
        assertNotNull(savedPropulsion.getId(), () -> "ID should be generated for max length name");
        assertEquals(longName, savedPropulsion.getName(), () -> "Name should be saved correctly");
    }
    
    @Test
    @DisplayName("Test saving propulsion with duplicate names")
    public void testSavePropulsionWithDuplicateNames() {
        // Arrange
        String modelName = faker.company().name();
        Propulsion propulsion1 = createTestPropulsion(modelName, true);
        Propulsion propulsion2 = createTestPropulsion(modelName, true);
        propulsionRepository.save(propulsion1);

        // Act
        Propulsion savedPropulsion2 = propulsionRepository.save(propulsion2);

        // Assert
        assertNotNull(savedPropulsion2.getId(), () -> "Second propulsion should be saved even with duplicate name");
        assertNotEquals(propulsion1.getId(), savedPropulsion2.getId(), () -> "Propulsions with the same name should have different IDs");
    }



}
