package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Vehicle")
public class VehicleTest {

    private Faker faker;
    private Vehicle vehicle;
    private Category category;
    private VehicleType type;
    private Brand brand;
    private Propulsion propulsion;
    private Autonomy autonomy;

    @BeforeEach
    void setUp() {
        faker = new Faker();

        // Criação das instâncias associadas
        category = new Category(null, faker.company().name(), faker.bool().bool());
        type = new VehicleType(null, faker.company().name(), faker.bool().bool());
        brand = new Brand(null, faker.company().name(), faker.bool().bool());
        propulsion = new Propulsion(null, faker.company().name(), faker.bool().bool());

        // Correção da criação da instância de Autonomy
        autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );

        // Criação da instância de Vehicle
        vehicle = new Vehicle(
                null,
                faker.company().catchPhrase(),
                faker.company().bs(),
                faker.bool().bool(),
                category,
                type,
                brand,
                propulsion,
                autonomy
        );
    }

    @Test
    @DisplayName("Test creation of Vehicle entity")
    void testVehicleCreation() {
        assertNotNull(vehicle);
        assertNotNull(vehicle.getMotor());
        assertNotNull(vehicle.getVersion());
        assertNotNull(vehicle.getActivated());
        assertNotNull(vehicle.getCategory());
        assertNotNull(vehicle.getType());
        assertNotNull(vehicle.getBrand());
        assertNotNull(vehicle.getPropulsion());
        assertNotNull(vehicle.getAutonomy());

        assertEquals(category, vehicle.getCategory());
        assertEquals(type, vehicle.getType());
        assertEquals(brand, vehicle.getBrand());
        assertEquals(propulsion, vehicle.getPropulsion());
        assertEquals(autonomy, vehicle.getAutonomy());
    }

    @Test
    @DisplayName("Test updating Vehicle entity")
    void testVehicleUpdate() {
        vehicle.setMotor(faker.company().catchPhrase());
        vehicle.setVersion(faker.company().bs());
        vehicle.setActivated(faker.bool().bool());

        assertNotNull(vehicle.getMotor());
        assertNotNull(vehicle.getVersion());
        assertNotNull(vehicle.getActivated());
    }

    @Test
    @DisplayName("Test activating and deactivating Vehicle entity")
    void testVehicleActivation() {
        vehicle.setActivated(false);
        assertFalse(vehicle.getActivated());

        vehicle.setActivated(true);
        assertTrue(vehicle.getActivated());
    }

    @Test
    @DisplayName("Test handling of null values in Vehicle entity")
    void testVehicleNullValues() {
        Vehicle vehicleWithNulls = new Vehicle(null, null, null, null, null, null, null, null, null);
        assertNull(vehicleWithNulls.getMotor());
        assertNull(vehicleWithNulls.getVersion());
        assertNull(vehicleWithNulls.getActivated());
        assertNull(vehicleWithNulls.getCategory());
        assertNull(vehicleWithNulls.getType());
        assertNull(vehicleWithNulls.getBrand());
        assertNull(vehicleWithNulls.getPropulsion());
        assertNull(vehicleWithNulls.getAutonomy());
    }
}
