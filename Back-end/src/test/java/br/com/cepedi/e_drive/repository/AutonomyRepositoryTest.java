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

    @Test
    @DisplayName("Test save and find by ID")
    public void testSaveAndFindById() {
        // Create a new Autonomy instance
        Autonomy autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );

        // Save the Autonomy in the database
        Autonomy savedAutonomy = autonomyRepository.save(autonomy);

        // Retrieve the Autonomy by its ID
        Optional<Autonomy> foundAutonomy = autonomyRepository.findById(savedAutonomy.getId());

        // Verify that the Autonomy was saved and retrieved correctly
        assertTrue(foundAutonomy.isPresent(), "Autonomy should be present");
        assertEquals(savedAutonomy.getId(), foundAutonomy.get().getId(), "ID should match");
    }

    @Test
    @DisplayName("Test find all autonomies")
    public void testFindAll() {
        // Create and save a new Autonomy instance
        Autonomy autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );
        autonomyRepository.save(autonomy);

        // Retrieve all autonomies from the database
        List<Autonomy> autonomies = autonomyRepository.findAll();

        // Verify if the number of retrieved autonomies matches the expected number
        assertEquals(1, autonomies.size(), "There should be one Autonomy");
    }

    @Test
    @DisplayName("Test delete autonomy")
    public void testDelete() {
        // Create and save a new Autonomy instance
        Autonomy autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );
        Autonomy savedAutonomy = autonomyRepository.save(autonomy);

        // Delete the Autonomy
        autonomyRepository.delete(savedAutonomy);

        // Verify that the Autonomy was deleted
        Optional<Autonomy> deletedAutonomy = autonomyRepository.findById(savedAutonomy.getId());
        assertFalse(deletedAutonomy.isPresent(), "Autonomy should be deleted");
    }

    @Test
    @DisplayName("Test update autonomy")
    public void testUpdate() {
        // Create and save a new Autonomy instance
        Autonomy autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );
        Autonomy savedAutonomy = autonomyRepository.save(autonomy);

        // Update the autonomy details
        savedAutonomy.setMileagePerLiterRoad(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        savedAutonomy.setMileagePerLiterCity(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        savedAutonomy.setConsumptionEnergetic(new BigDecimal(faker.number().randomDouble(2, 1, 100)));
        savedAutonomy.setAutonomyElectricMode(new BigDecimal(faker.number().randomDouble(2, 1, 100)));

        // Save the updated autonomy
        Autonomy updatedAutonomy = autonomyRepository.save(savedAutonomy);

        // Verify that the updated details are correct
        assertEquals(savedAutonomy.getMileagePerLiterRoad(), updatedAutonomy.getMileagePerLiterRoad());
        assertEquals(savedAutonomy.getMileagePerLiterCity(), updatedAutonomy.getMileagePerLiterCity());
        assertEquals(savedAutonomy.getConsumptionEnergetic(), updatedAutonomy.getConsumptionEnergetic());
        assertEquals(savedAutonomy.getAutonomyElectricMode(), updatedAutonomy.getAutonomyElectricMode());
    }
}

