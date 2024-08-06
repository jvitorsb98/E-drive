package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Propulsion")
public class PropulsionTest {

    private Faker faker;
    private Propulsion propulsion;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        propulsion = new Propulsion(
                null, // ID will be generated automatically
                faker.company().name(),
                faker.bool().bool()
        );
    }

    @Test
    @DisplayName("Test creation of Propulsion entity")
    void testPropulsionCreation() {
        assertNotNull(propulsion);
        assertNotNull(propulsion.getName(), "Name should not be null");
        assertNotNull(propulsion.getActivated(), "Activated should not be null");
    }

    @Test
    @DisplayName("Test updating Propulsion entity")
    void testPropulsionUpdate() {
        // Simulate updating the Propulsion
        String newName = faker.company().name();
        propulsion.setName(newName);

        // Check if the update was successful
        assertEquals(newName, propulsion.getName());
    }

    @Test
    @DisplayName("Test activating Propulsion entity")
    void testPropulsionActivation() {
        propulsion.setActivated(false);
        assertFalse(propulsion.getActivated());

        propulsion.setActivated(true);
        assertTrue(propulsion.getActivated());
    }

    @Test
    @DisplayName("Test deactivating Propulsion entity")
    void testPropulsionDeactivation() {
        propulsion.setActivated(true);
        assertTrue(propulsion.getActivated());

        propulsion.setActivated(false);
        assertFalse(propulsion.getActivated());
    }

    @Test
    @DisplayName("Test handling of null values")
    void testPropulsionNullValues() {
        Propulsion propulsionWithNulls = new Propulsion(null, null, null);
        assertNull(propulsionWithNulls.getName(), "Name should be null");
        assertNull(propulsionWithNulls.getActivated(), "Activated should be null");

        // Update with valid values
        propulsionWithNulls.setName(faker.company().name());
        propulsionWithNulls.setActivated(faker.bool().bool());

        assertNotNull(propulsionWithNulls.getName(), "Name should not be null after setting");
        assertNotNull(propulsionWithNulls.getActivated(), "Activated should not be null after setting");
    }
}

