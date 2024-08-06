package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity VehicleType")
public class VehicleTypeTest {

    private Faker faker;
    private VehicleType vehicleType;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        
        // Criação da instância de VehicleType
        vehicleType = new VehicleType(
                null, // ID gerado automaticamente
                faker.company().name(),
                faker.bool().bool()
        );
    }

    @Test
    @DisplayName("Test creation of VehicleType entity")
    void testVehicleTypeCreation() {
        assertNotNull(vehicleType);
        assertNotNull(vehicleType.getName());
        assertNotNull(vehicleType.getActivated());
    }

    @Test
    @DisplayName("Test updating VehicleType entity")
    void testVehicleTypeUpdate() {
        vehicleType.setName(faker.company().name());
        vehicleType.setActivated(faker.bool().bool());
        
        assertNotNull(vehicleType.getName());
        assertNotNull(vehicleType.getActivated());
    }

    @Test
    @DisplayName("Test activating and deactivating VehicleType entity")
    void testVehicleTypeActivation() {
        vehicleType.setActivated(false);
        assertFalse(vehicleType.getActivated());

        vehicleType.setActivated(true);
        assertTrue(vehicleType.getActivated());
    }

    @Test
    @DisplayName("Test handling of null values in VehicleType entity")
    void testVehicleTypeNullValues() {
        VehicleType vehicleTypeWithNulls = new VehicleType(null, null, null);
        assertNull(vehicleTypeWithNulls.getName());
        assertNull(vehicleTypeWithNulls.getActivated());
    }
}
