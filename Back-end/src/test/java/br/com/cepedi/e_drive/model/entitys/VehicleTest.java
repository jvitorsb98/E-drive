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
    private Propulsion propulsion;
    private Autonomy autonomy;

    @BeforeEach
    void setUp() {
        faker = new Faker();

        // Criação das instâncias associadas
        category = new Category(null, faker.company().name(), faker.bool().bool());
        type = new VehicleType(null, faker.company().name(), faker.bool().bool());
        propulsion = new Propulsion(null, faker.company().name(), faker.bool().bool());

        // Criação da instância de Autonomy
        autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );

        // Criação da instância de Vehicle
        vehicle = new Vehicle(
                faker.company().catchPhrase(), // Motor
                faker.company().bs(),           // Versão
                null,                            // Model pode ser nulo
                category,                       // Categoria
                type,                           // Tipo
                propulsion,                     // Propulsão
                autonomy,                       // Autonomia
                null                            // O ano pode ser nulo para o teste inicial
        );

    }

    @Test
    @DisplayName("Test creation of Vehicle entity")
    void testVehicleCreation() {
        assertNotNull(vehicle, "Vehicle should not be null");
        assertNotNull(vehicle.getMotor(), "Motor should not be null");
        assertNotNull(vehicle.getVersion(), "Version should not be null");
        assertTrue(vehicle.isActivated(), "Activated should be true");
        assertNotNull(vehicle.getCategory(), "Category should not be null");
        assertNotNull(vehicle.getType(), "Type should not be null");
        assertNotNull(vehicle.getPropulsion(), "Propulsion should not be null");
        assertNotNull(vehicle.getAutonomy(), "Autonomy should not be null");
    }

    @Test
    @DisplayName("Test updating Vehicle entity")
    void testVehicleUpdate() {
        String newMotor = faker.company().catchPhrase();
        String newVersion = faker.company().bs();
        vehicle.setMotor(newMotor);
        vehicle.setVersion(newVersion);
        vehicle.setActivated(faker.bool().bool());

        assertEquals(newMotor, vehicle.getMotor(), "Motor should be updated");
        assertEquals(newVersion, vehicle.getVersion(), "Version should be updated");
        assertNotNull(vehicle.isActivated(), "Activated should not be null");
    }

    @Test
    @DisplayName("Test activating and deactivating Vehicle entity")
    void testVehicleActivation() {
        vehicle.setActivated(false);
        assertFalse(vehicle.isActivated(), "Vehicle should be deactivated");

        vehicle.setActivated(true);
        assertTrue(vehicle.isActivated(), "Vehicle should be activated");
    }


}
