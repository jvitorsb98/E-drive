package br.com.cepedi.e_drive.model.entitys;


import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Model")
public class ModelTest {

    private Faker faker;
    private Model model;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        model = new Model(
                null, 
                faker.company().name(),
                faker.bool().bool()
        );
    }

    @Test
    @DisplayName("Test creation of Model entity")
    void testModelCreation() {
        assertNotNull(model);
        assertNotNull(model.getName(), "Name should not be null");
        assertNotNull(model.getActivated(), "Activated should not be null");
    }

    @Test
    @DisplayName("Test updating Model entity")
    void testModelUpdate() {
        // Simulate updating the Model
        String newName = faker.company().name();
        model.setName(newName);

        // Check if the update was successful
        assertEquals(newName, model.getName());
    }

    @Test
    @DisplayName("Test activating Model entity")
    void testModelActivation() {
        model.setActivated(false);
        assertFalse(model.getActivated());

        model.setActivated(true);
        assertTrue(model.getActivated());
    }

    @Test
    @DisplayName("Test deactivating Model entity")
    void testModelDeactivation() {
        model.setActivated(true);
        assertTrue(model.getActivated());

        model.setActivated(false);
        assertFalse(model.getActivated());
    }

    @Test
    @DisplayName("Test handling of null values")
    void testModelNullValues() {
        Model modelWithNulls = new Model(null, null, null);
        assertNull(modelWithNulls.getName(), "Name should be null");
        assertNull(modelWithNulls.getActivated(), "Activated should be null");

        // Update with valid values
        modelWithNulls.setName(faker.company().name());
        modelWithNulls.setActivated(faker.bool().bool());

        assertNotNull(modelWithNulls.getName(), "Name should not be null after setting");
        assertNotNull(modelWithNulls.getActivated(), "Activated should not be null after setting");
    }
}

