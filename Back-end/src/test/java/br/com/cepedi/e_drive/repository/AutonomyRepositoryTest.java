package br.com.cepedi.e_drive.repository;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import br.com.cepedi.e_drive.model.entitys.Autonomy;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AutonomyRepositoryTest {

    @Autowired
    private AutonomyRepository autonomyRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        autonomyRepository.deleteAll();
    }

    private Autonomy createTestAutonomy() {
        return new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );
    }

    @Test
    @DisplayName("Test save and find by ID")
    public void testSaveAndFindById() {
        // Arrange
        Autonomy autonomy = createTestAutonomy();

        // Act
        Autonomy savedAutonomy = autonomyRepository.save(autonomy);
        Optional<Autonomy> foundAutonomy = autonomyRepository.findById(savedAutonomy.getId());

        // Assert
        assertTrue(foundAutonomy.isPresent(), () -> "Autonomy should be present");
        assertEquals(savedAutonomy.getId(), foundAutonomy.get().getId(), () -> "ID should match");
    }

    @Test
    @DisplayName("Test find all autonomies")
    public void testFindAll() {
        // Arrange
        Autonomy autonomy = createTestAutonomy();
        autonomyRepository.save(autonomy);

        // Act
        List<Autonomy> autonomies = autonomyRepository.findAll();

        // Assert
        assertEquals(1, autonomies.size(), () -> "There should be one Autonomy");
    }

    @Test
    @DisplayName("Test delete autonomy")
    public void testDelete() {
        // Arrange
        Autonomy autonomy = createTestAutonomy();
        Autonomy savedAutonomy = autonomyRepository.save(autonomy);

        // Act
        autonomyRepository.delete(savedAutonomy);
        Optional<Autonomy> deletedAutonomy = autonomyRepository.findById(savedAutonomy.getId());

        // Assert
        assertFalse(deletedAutonomy.isPresent(), () -> "Autonomy should be deleted");
    }

    @Test
    @DisplayName("Test update autonomy")
    public void testUpdate() {
        // Arrange
        Autonomy autonomy = createTestAutonomy();
        Autonomy savedAutonomy = autonomyRepository.save(autonomy);

        // Act
        savedAutonomy.setMileagePerLiterRoad(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        savedAutonomy.setMileagePerLiterCity(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        savedAutonomy.setConsumptionEnergetic(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        savedAutonomy.setAutonomyElectricMode(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        Autonomy updatedAutonomy = autonomyRepository.save(savedAutonomy);

        // Assert
        assertEquals(savedAutonomy.getMileagePerLiterRoad(), updatedAutonomy.getMileagePerLiterRoad(), () -> "Mileage per liter road should match");
        assertEquals(savedAutonomy.getMileagePerLiterCity(), updatedAutonomy.getMileagePerLiterCity(), () -> "Mileage per liter city should match");
        assertEquals(savedAutonomy.getConsumptionEnergetic(), updatedAutonomy.getConsumptionEnergetic(), () -> "Consumption energetic should match");
        assertEquals(savedAutonomy.getAutonomyElectricMode(), updatedAutonomy.getAutonomyElectricMode(), () -> "Autonomy electric mode should match");
    }

    @Test
    @DisplayName("Test find by non-existing ID")
    public void testFindByNonExistingId() {
        // Act
        Optional<Autonomy> foundAutonomy = autonomyRepository.findById(Long.MAX_VALUE);

        // Assert
        assertFalse(foundAutonomy.isPresent(), () -> "Autonomy should not be present");
    }

    @Test
    @DisplayName("Test delete non-existing entity")
    public void testDeleteNonExistingEntity() {
        // Arrange
        Autonomy autonomy = createTestAutonomy();
        autonomy.setId(Long.MAX_VALUE); // Non-existing ID

        // Act
        autonomyRepository.delete(autonomy);

        // Assert
        // No exception should be thrown and nothing should be affected
    }
}
