package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;

import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

public class PropulsionTest {

    private Faker faker;
    private DataRegisterPropulsion dataRegisterPropulsion;
    private DataUpdatePropulsion dataUpdatePropulsion;
    private Propulsion propulsion;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        String name = faker.company().name();
        dataRegisterPropulsion = Mockito.mock(DataRegisterPropulsion.class);
        Mockito.when(dataRegisterPropulsion.name()).thenReturn(name);
        dataUpdatePropulsion = Mockito.mock(DataUpdatePropulsion.class);
        propulsion = new Propulsion(dataRegisterPropulsion);
    }

    @Test
    @DisplayName("Test creation with no-args constructor")
    void testNoArgsConstructor() {
        // Arrange
        Propulsion propulsion = new Propulsion(); 

        // Act
        // Não há ações adicionais, pois estamos testando o estado padrão da entidade

        // Assert
        assertNotNull(propulsion, () -> "Propulsion instance should be created with no-args constructor.");
        assertNull(propulsion.getName(), () -> "Name should be null by default.");
        assertNull(propulsion.getActivated(), () -> "Activated should be null by default.");
    }

    @Test
    @DisplayName("Test creation with all-args constructor")
    void testAllArgsConstructor() {
        // Arrange
        Long id = faker.number().randomNumber();
        String name = faker.company().name();
        Boolean activated = faker.bool().bool();

        // Act
        Propulsion propulsion = new Propulsion(id, name, activated);

        // Assert
        assertNotNull(propulsion, () -> "Propulsion instance should be created with all-args constructor.");
        assertEquals(id, propulsion.getId(), () -> "ID should be initialized correctly.");
        assertEquals(name, propulsion.getName(), () -> "Name should be initialized correctly.");
        assertEquals(activated, propulsion.getActivated(), () -> "Activated status should be initialized correctly.");
    }

    @Test
    @DisplayName("Test creation with DataRegisterPropulsion")
    void testCreationWithDataRegisterPropulsion() {
        // Assert
        assertNotNull(propulsion, () -> "Propulsion instance should be created with DataRegisterPropulsion.");
        assertEquals(dataRegisterPropulsion.name(), propulsion.getName(), () -> "Name should be initialized correctly from DataRegisterPropulsion.");
        assertTrue(propulsion.getActivated(), () -> "Activated should default to true when using DataRegisterPropulsion.");
    }

    @Test
    @DisplayName("Test updating Propulsion with new values")
    void testUpdatePropulsion() {
        // Arrange
        String newName = faker.company().name();
        Mockito.when(dataUpdatePropulsion.name()).thenReturn(newName);

        // Act
        propulsion.update(dataUpdatePropulsion);

        // Assert
        assertEquals(newName, propulsion.getName(), () -> "The name should be updated.");
    }

    @Test
    @DisplayName("Test updating Propulsion with null values")
    void testUpdatePropulsionWithNullValues() {
        // Arrange
        String originalName = propulsion.getName();
        Mockito.when(dataUpdatePropulsion.name()).thenReturn(null);

        // Act
        propulsion.update(dataUpdatePropulsion);

        // Assert
        assertEquals(originalName, propulsion.getName(), () -> "The name should not change when the new name is null.");
    }

    @Test
    @DisplayName("Test activating Propulsion")
    void testActivatePropulsion() {
        // Act
        propulsion.deactivated();
        assertFalse(propulsion.getActivated(), () -> "Propulsion should be deactivated.");

        propulsion.activated();
        assertTrue(propulsion.getActivated(), () -> "Propulsion should be activated.");
    }

    @Test
    @DisplayName("Test deactivating Propulsion")
    void testDeactivatePropulsion() {
        // Act
        propulsion.activated();
        assertTrue(propulsion.getActivated(), () -> "Propulsion should be activated.");

        propulsion.deactivated();
        assertFalse(propulsion.getActivated(), () -> "Propulsion should be deactivated.");
    }

    @Test
    @DisplayName("Test getter and setter for name")
    void testNameGetterAndSetter() {
        // Arrange
        String name = faker.company().name();

        // Act
        propulsion.setName(name);
        String retrievedName = propulsion.getName();

        // Assert
        assertEquals(name, retrievedName, () -> "The name should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        // Arrange
        Boolean activated = faker.bool().bool();

        // Act
        propulsion.setActivated(activated);
        Boolean retrievedActivated = propulsion.getActivated();

        // Assert
        assertEquals(activated, retrievedActivated, () -> "The activated status should be set and retrieved correctly.");
    }
}

