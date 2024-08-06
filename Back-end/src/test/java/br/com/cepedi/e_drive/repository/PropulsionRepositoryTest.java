package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
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
public class PropulsionRepositoryTest {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @BeforeEach
    public void deleteAllPropulsions() {
        propulsionRepository.deleteAll();
    }

    // Test to verify if a propulsion can be saved correctly in the database
    @Test
    public void testSavePropulsion() {
        // Create a new propulsion instance
        Propulsion propulsion = new Propulsion();
        propulsion.setName("Test Propulsion");
        propulsion.setActivated(true);

        // Save the propulsion in the database and verify if the ID was generated
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);
        assertNotNull(savedPropulsion.getId());
    }

    // Test to verify if all deactivated propulsions can be retrieved correctly from the database
    @Test
    public void testFindAllDeactivatedPropulsions() {
        // Create a new propulsion instance
        Propulsion propulsion = new Propulsion();
        propulsion.setName("Test Propulsion");
        propulsion.setActivated(false);

        // Save the propulsion in the database
        propulsionRepository.save(propulsion);

        // Retrieve all deactivated propulsions from the database
        Pageable pageable = PageRequest.of(0, 10);
        Page<Propulsion> propulsions = propulsionRepository.findAllByActivatedFalse(pageable);

        // Verify if the number of retrieved propulsions matches the expected number
        assertEquals(1, propulsions.getTotalElements());
    }

    // Test to verify if a propulsion can be deleted correctly from the database
    @Test
    public void testDeletePropulsion() {
        // Create a new propulsion instance
        Propulsion propulsion = new Propulsion();
        propulsion.setName("Test Propulsion");
        propulsion.setActivated(true);

        // Save the propulsion in the database
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Delete the propulsion from the database
        propulsionRepository.delete(savedPropulsion);

        // Verify if the propulsion was deleted
        Optional<Propulsion> deletedPropulsion = propulsionRepository.findById(savedPropulsion.getId());
        assertFalse(deletedPropulsion.isPresent());
    }

    // Test to verify if a propulsion can be updated correctly in the database
    @Test
    public void testUpdatePropulsion() {
        // Create a new propulsion instance
        Propulsion propulsion = new Propulsion();
        propulsion.setName("Test Propulsion");
        propulsion.setActivated(true);

        // Save the propulsion in the database
        Propulsion savedPropulsion = propulsionRepository.save(propulsion);

        // Update the propulsion details
        savedPropulsion.setName("Updated Propulsion");
        savedPropulsion.setActivated(false);

        // Save the updated propulsion in the database
        Propulsion updatedPropulsion = propulsionRepository.save(savedPropulsion);

        // Verify if the updated propulsion details are correct
        assertEquals("Updated Propulsion", updatedPropulsion.getName());
        assertFalse(updatedPropulsion.getActivated());
    }

    // Test to verify if propulsions can be retrieved by name containing a specific string
    @Test
    public void testFindByNameContaining() {
        // Create a new propulsion instance
        Propulsion propulsion = new Propulsion();
        propulsion.setName("Sample Propulsion");
        propulsion.setActivated(true);

        // Save the propulsion in the database
        propulsionRepository.save(propulsion);

        // Retrieve propulsions by name containing "Sample"
        Pageable pageable = PageRequest.of(0, 10);
        Page<Propulsion> propulsions = propulsionRepository.findByNameContaining("Sample", pageable);

        // Verify if the number of retrieved propulsions matches the expected number
        assertEquals(1, propulsions.getTotalElements());
    }

    // Test to verify if all activated propulsions can be retrieved correctly from the database
    @Test
    public void testFindAllActivatedPropulsions() {
        // Create a new propulsion instance
        Propulsion propulsion = new Propulsion();
        propulsion.setName("Active Propulsion");
        propulsion.setActivated(true);

        // Save the propulsion in the database
        propulsionRepository.save(propulsion);

        // Retrieve all activated propulsions from the database
        Pageable pageable = PageRequest.of(0, 10);
        Page<Propulsion> propulsions = propulsionRepository.findAllByActivatedTrue(pageable);

        // Verify if the number of retrieved propulsions matches the expected number
        assertEquals(1, propulsions.getTotalElements());
    }
}
