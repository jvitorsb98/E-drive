package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VehicleTypeTest {

    private Faker faker;
    private DataRegisterVehicleType dataRegisterVehicleType;
    private VehicleType vehicleType;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        String name = faker.company().name(); 
        dataRegisterVehicleType = new DataRegisterVehicleType(name);
        vehicleType = new VehicleType(dataRegisterVehicleType);
    }

    @Test
    @DisplayName("Test creation with no-args constructor")
    void testNoArgsConstructor() {
        VehicleType vehicleType = new VehicleType(); 
        assertNotNull(vehicleType, () -> "VehicleType instance should be created with no-args constructor.");
        assertNull(vehicleType.getName(), () -> "Name should be null by default.");
        assertFalse(vehicleType.isActivated(), () -> "Activated should be false by default.");
    }

    @Test
    @DisplayName("Test creation with all-args constructor")
    void testAllArgsConstructor() {
        String name = faker.company().name(); 
        boolean activated = faker.bool().bool();
        VehicleType vehicleType = new VehicleType(null, name, activated);
        assertNotNull(vehicleType, () -> "VehicleType instance should be created with all-args constructor.");
        assertEquals(name, vehicleType.getName(), () -> "Name should be initialized correctly.");
        assertEquals(activated, vehicleType.isActivated(), () -> "Activated status should be initialized correctly.");
    }

    @Test
    @DisplayName("Test creation with DataRegisterVehicleType")
    void testCreationWithDataRegisterVehicleType() {
        assertNotNull(vehicleType, "VehicleType instance should be created with DataRegisterVehicleType.");
        assertEquals(dataRegisterVehicleType.name(), vehicleType.getName(), () -> "Name should be initialized correctly from DataRegisterVehicleType.");
        assertTrue(vehicleType.isActivated(), () -> "Activated should default to true when using DataRegisterVehicleType.");
    }

    @Test
    @DisplayName("Test updating VehicleType with new values")
    void testUpdateVehicleType() {
        String newName = faker.company().name(); 
        DataUpdateVehicleType updateData = new DataUpdateVehicleType(newName);
        vehicleType.updateDataVehicleType(updateData);
        assertEquals(newName, vehicleType.getName(), () -> "The name should be updated.");
    }

    @Test
    @DisplayName("Test updating VehicleType with null name")
    void testUpdateVehicleTypeWithNullName() {
        DataUpdateVehicleType data = mock(DataUpdateVehicleType.class);
        when(data.name()).thenReturn(null);
        String originalName = vehicleType.getName(); 
        vehicleType.updateDataVehicleType(data);
        assertEquals(originalName, vehicleType.getName(), () -> "The name should not be updated if the new name is null.");
    }

    @Test
    @DisplayName("Test activating and disabling VehicleType")
    void testActivateAndDisableVehicleType() {
        vehicleType.disabled();
        assertFalse(vehicleType.isActivated(), () -> "VehicleType should be deactivated.");

        vehicleType.activated();
        assertTrue(vehicleType.isActivated(), () -> "VehicleType should be activated.");
    }

    @Test
    @DisplayName("Test getter and setter for name")
    void testNameGetterAndSetter() {
        String name = faker.company().name(); 
        vehicleType.setName(name);
        assertEquals(name, vehicleType.getName(), () -> "The name should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        boolean activated = faker.bool().bool();
        vehicleType.setActivated(activated);
        assertEquals(activated, vehicleType.isActivated(), () -> "The activated status should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test constructor of VehicleType with DataRegisterVehicleType")
    void testVehicleTypeConstructor() {
        String expectedName = faker.company().name();
        DataRegisterVehicleType dataRegisterVehicleType = mock(DataRegisterVehicleType.class);
        when(dataRegisterVehicleType.name()).thenReturn(expectedName);
        VehicleType vehicleType = new VehicleType(dataRegisterVehicleType);
        assertNotNull(vehicleType, () -> "VehicleType should not be null");
        assertEquals(expectedName, vehicleType.getName(), () -> "The name should be set correctly from DataRegisterVehicleType");
        assertTrue(vehicleType.isActivated(), () -> "The activated field should be set to true by default");
    }
}


